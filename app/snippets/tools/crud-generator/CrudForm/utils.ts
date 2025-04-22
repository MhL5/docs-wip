import type { Options } from "./types";

/**
 * Generates a function name based on the HTTP method and resource name
 */
function generateFunctionName({
  method,
  name,
  capitalFirstWord = false,
}: {
  method: Options["method"];
  name: Options["name"];
  capitalFirstWord?: boolean;
}) {
  const methodMap: Record<Options["method"], string> = {
    post: "create",
    get: "get",
    delete: "delete",
    put: "update",
    patch: "update",
  };

  const methodName = methodMap[method];
  const firstWord = capitalFirstWord
    ? methodName.charAt(0).toUpperCase() + methodName.slice(1)
    : methodName;

  return `${firstWord}${name.charAt(0).toUpperCase() + name.slice(1)}`;
}

/**
 * API configuration based on the current version
 */
const apiConfig = {
  apiImport: `import { authFetcher } from "@/features/authentication/utils/authFetcher";`,
  resultTypeImport: `import type { FetchResult } from "@/types/FetchResult";`,
  catchUtilImport: `import { catchErrorTyped } from "@/utils/catchErrorTyped";`,
  apiObject: "authFetcher",
  resultType: "FetchResult",
  catchFunction: "catchErrorTyped",
};

/**
 * Generates an async function for API requests
 */
function generateAsyncFunction({
  name,
  route,
  method,
  defaultErrorMessage,
}: Options): string {
  if (!name) return "";

  const {
    apiImport,
    resultTypeImport,
    catchUtilImport,
    apiObject,
    resultType,
    catchFunction,
  } = apiConfig;

  const paramsTypeName = generateFunctionName({
    method,
    name,
    capitalFirstWord: true,
  });
  const isGetMethod = method === "get";
  const functionName = generateFunctionName({ method, name });

  // Build the complete function
  return `${apiImport}
${resultTypeImport}
${catchUtilImport}

type ApiResponse = any;

${isGetMethod ? "" : `export type ${paramsTypeName}Params = any;`}

const defaultErrorMessage = \`${defaultErrorMessage}\`;
const expectedErrors: Record<string, string> = {};
function getErrorMessage(errorMessage: string | undefined) {
  if (!errorMessage) return defaultErrorMessage;
  return expectedErrors[errorMessage] || defaultErrorMessage;
}

export async function ${functionName}(${isGetMethod ? "" : `params: ${paramsTypeName}Params`}): Promise<${resultType}<ApiResponse>> {
  const [error, data] = await ${catchFunction}<ApiResponse>(
    ${apiObject}.${method}('${route}'${isGetMethod ? "" : `, {json: params}`}).json(),
  );

  if (error || !data)
    return {
      success: false,
      message: getErrorMessage(error?.message),
      error,
    };

  return { success: true, data };
}`;
}

/**
 * Generates TanStack Query hooks for the API functions
 */
function generateTanStackQueryHooks({
  name,
  method,
  queryHook,
  mutationSuccessMessage,
}: Options): string[] {
  const functionName = generateFunctionName({ method, name });
  const hookName = generateFunctionName({
    method,
    name,
    capitalFirstWord: true,
  });

  if (method === "get") {
    const queryOptions = `import { ${functionName} } from "@/features/${name}/services/${functionName}";
import { queryOptions } from "@tanstack/react-query";

export const ${functionName}QueryOptions = () => {
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

import { ${functionName}QueryOptions } from "@/features/${name}/hooks/${functionName}QueryOptions";
import { ${queryHook} } from "@tanstack/react-query";

export function use${hookName}() {
  return ${queryHook}(${functionName}QueryOptions());
}`;

    return [queryOptions, query];
  }

  const paramsTypeName = generateFunctionName({
    method,
    name,
    capitalFirstWord: true,
  });

  const mutation = `"use client";

import {
  ${functionName},
  type ${paramsTypeName}Params,
} from "@/features/${name}/services/${functionName}";
import { ${functionName}QueryOptions } from "@/features/${name}/hooks/${functionName}QueryOptions";
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
      toast.success('${mutationSuccessMessage}');
      queryClient.invalidateQueries({
        queryKey: [${functionName}QueryOptions().queryKey],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}`;

  return [mutation];
}

export {
  generateFunctionName,
  generateAsyncFunction,
  generateTanStackQueryHooks,
};
