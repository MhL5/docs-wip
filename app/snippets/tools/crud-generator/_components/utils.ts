import { toCapitalize } from "@/utils/toCapitalize";
import type { Options } from "./types";

/**
 * Generates a function name based on the HTTP method and resource name
 */
function generateFunctionName({
  method,
  name,
  to = "camelCase",
}: {
  method: Options["method"];
  name: Options["name"];
  to?: "camelCase" | "capitalize";
}) {
  const methodMap: Record<Options["method"], string> = {
    post: "create",
    get: "get",
    delete: "delete",
    put: "update",
    patch: "update",
  };

  if (to === "camelCase") return `${methodMap[method]}${toCapitalize(name)}`;

  return `${toCapitalize(methodMap[method])}${toCapitalize(name)}`;
}

function generateMutationSuccessMessage({
  method,
  nameLabel,
  type,
}: {
  method: Options["method"];
  nameLabel: Options["nameLabel"];
  type: "error" | "success";
}) {
  if (type === "success") {
    if (method === "get") return "";

    switch (method) {
      case "post":
        return `${nameLabel} با موفقیت ایجاد شد`;
      case "put":
        return `${nameLabel} با موفقیت بروزرسانی شد`;
      case "patch":
        return `${nameLabel} با موفقیت بروزرسانی شد`;
      case "delete":
        return `${nameLabel} با موفقیت حذف شد`;
      default:
        return "عملیات با موفقیت انجام شد";
    }
  }

  if (type === "error") {
    switch (method) {
      case "post":
        return `خطا در ایجاد ${nameLabel}`;
      case "put":
      case "patch":
        return `خطا در بروزرسانی ${nameLabel}`;
      case "delete":
        return `خطا در حذف ${nameLabel}`;
      case "get":
        return `خطا در دریافت ${nameLabel}`;
      default:
        return "عملیات ناموفق بود";
    }
  }

  return "";
}

/**
 * API configuration based on the current version
 */
const apiConfig = {
  apiObject: "fetcher",
  resultType: "FetchResult",
  catchFunction: "catchErrorTyped",
};

/**
 * Generates an async function for API requests
 */
function generateAsyncFunction({ name, route, method, nameLabel }: Options): {
  data: string;
  name: string;
} {
  if (!name) return { data: "", name: "" };

  const { apiObject, resultType, catchFunction } = apiConfig;

  const paramsTypeName = generateFunctionName({
    method,
    name,
    to: "capitalize",
  });
  const isGetMethod = method === "get";
  const isUpdate = method === "put" || method === "patch";
  const functionName = generateFunctionName({ method, name });

  const isGetAllMethod = method === "get" && name.endsWith("s");

  const routeIncludesTemplateLiteral = route.includes("${");
  const routeTemplateLiteralType = routeIncludesTemplateLiteral
    ? [...route.matchAll(/\${(.*?)}/g)].map((m) => m[1])
    : "";

  return {
    data: `type ApiResponse = any;${
      isGetMethod
        ? ""
        : `\nexport type ${paramsTypeName}Params = ${
            isUpdate
              ? `{
 ${name}: Partial<${generateFunctionName({
   method: "post",
   name,
   to: "capitalize",
 })}Params>;
 ${name}Id: string;
}`
              : `${
                  routeTemplateLiteralType
                    ? `{
 ${routeTemplateLiteralType}: string;
}`
                    : "any"
                }`
          };`
    }

export async function ${functionName}(${
      isGetAllMethod
        ? ""
        : `${
            routeTemplateLiteralType
              ? `{
 ${routeTemplateLiteralType}: string; 
}`
              : `params`
          }: ${paramsTypeName}Params`
    }): ${resultType}<ApiResponse> {
  const [error, data] = await ${catchFunction}<ApiResponse>(
    ${apiObject}.${method}(\`${route}\`${isGetMethod ? "" : `, {json: params}`}).json(),
  );

  if (error || !data)
    return {
      success: false,
      message: getErrorMessage(error?.message),
      error,
    };

  return { success: true, data };
}

// Error handling
const defaultErrorMessage = '${generateMutationSuccessMessage({ method, nameLabel, type: "error" })}';

const expectedErrors: Record<string, string> = {};

const getErrorMessage = (errorMessage: string | undefined) =>
  !errorMessage
    ? defaultErrorMessage
    : expectedErrors?.[errorMessage] || defaultErrorMessage;

`,
    name: `${functionName}.ts`,
  };
}

/**
 * Generates TanStack Query hooks for the API functions
 */
function generateTanStackQueryHooks({
  name,
  method,
  queryHook,
  nameLabel,
}: Options): { data: string; name: string }[] {
  const functionName = generateFunctionName({ method, name });
  const hookName = generateFunctionName({
    method,
    name,
    to: "capitalize",
  });

  if (method === "get") {
    const queryOptions = `import { queryOptions } from "@tanstack/react-query";

export function ${functionName}QueryOptions() {
  return queryOptions({
    queryKey: [\`${functionName}\`],
    queryFn: async () => {
      const response = await ${functionName}();
      if (!response.success) return response.message;
      return response.data;
    },
  });
};`;

    const query = `"use client";

import { ${queryHook} } from "@tanstack/react-query";

export function ${queryHook}${hookName}() {
  return ${queryHook}(${functionName}QueryOptions());
}`;

    return [
      { data: queryOptions, name: `${functionName}QueryOptions.ts` },
      { data: query, name: `${queryHook}${hookName}.ts` },
    ];
  }

  const paramsTypeName = generateFunctionName({
    method,
    name,
    to: "capitalize",
  });

  const mutation = `"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function use${hookName}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ${paramsTypeName}Params) => {
      const response = await ${functionName}(params);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    onSuccess: () => {
      toast.success('${generateMutationSuccessMessage({ method, nameLabel, type: "success" })}');
      queryClient.invalidateQueries({
        queryKey: [${generateFunctionName({ method: "get", name })}QueryOptions().queryKey],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}`;

  return [{ data: mutation, name: `use${hookName}.ts` }];
}

export {
  generateAsyncFunction,
  generateFunctionName,
  generateTanStackQueryHooks,
};
