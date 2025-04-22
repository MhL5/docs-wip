function generateFunctionName({
  method,
  name,
  capitalFirstWord = false,
}: {
  method: Options["method"];
  name: Options["name"];
  capitalFirstWord?: boolean;
}) {
  const renameMethod = {
    post: "create",
    get: "get",
    delete: "delete",
    put: "update",
    patch: "update",
  };
  const firstWord = capitalFirstWord
    ? `${renameMethod?.[method]?.[0]?.toUpperCase() + renameMethod?.[method]?.slice(1)}`
    : `${renameMethod?.[method]}`;

  return `${firstWord}${name?.[0]?.toUpperCase() + name?.slice(1)}`;
}

function generateAsyncFunction({
  version,
  name,
  route,
  method,
  defaultErrorMessage,
}: Options) {
  if (!name) return ``; // Simplified check

  // Version-specific details
  const {
    apiImport,
    resultTypeImport,
    catchUtilImport,
    apiObject,
    resultType,
    catchFunction,
  } =
    version === "latest"
      ? {
          apiImport: `import { authFetcher } from "@/features/authentication/utils/authFetcher";`,
          resultTypeImport: `import type { FetchResult } from "@/types/FetchResult";`,
          catchUtilImport: `import { catchErrorTyped } from "@/utils/catchErrorTyped";`,
          apiObject: "authFetcher",
          resultType: "FetchResult",
          catchFunction: "catchErrorTyped",
        }
      : {
          apiImport: `import { authApi } from "@/features/authentication/utils/authApi";`,
          resultTypeImport: `import type { RequestResult } from "@/types/RequestResult";`,
          catchUtilImport: `import { catchKyErrorTyped } from "@/utils/catchErrorTyped";`,
          apiObject: "authApi",
          resultType: "RequestResult",
          catchFunction: "catchKyErrorTyped",
        };

  const paramsTypeName = generateFunctionName({
    method,
    name,
    capitalFirstWord: true,
  });
  const isGetMethod = method === "get";

  const commonImports = `
type ApiResponse = any;

${isGetMethod ? "" : `export type ${paramsTypeName}Params = any;`}
`;

  const commonErrorHandling = `
const defaultErrorMessage = \`${defaultErrorMessage}\`;
const expectedErrors: Record<string, string> = {};
function getErrorMessage(errorMessage: string | undefined) {
  if (!errorMessage) return defaultErrorMessage;

  const errorMsg = expectedErrors[errorMessage];
  if (errorMsg) return errorMsg;

  return defaultErrorMessage;
}`;

  const commonFunctionBody = `
export async function ${generateFunctionName({ method, name })}(${isGetMethod ? "" : `params:${paramsTypeName}`}): ${resultType}<ApiResponse> {
  const [error, data] = await ${catchFunction}<ApiResponse>(
    ${apiObject}.${method}('${route}'${isGetMethod ? "" : `{json: params}`}).json(),
  );

  if (error || !data)
    return {
      success: false,
      message: getErrorMessage(error?.message),
      error,
    };

  return { success: true, data };
}`;

  // Combine parts into the final result string
  return `${apiImport}
${resultTypeImport}
${catchUtilImport}
${commonImports}
${commonErrorHandling}
${commonFunctionBody}
`;
}

function generateTanStackQueryHooks({
  name,
  method,
  queryHook,
  mutationSuccessMessage,
}: Options): string[] {
  const functionName = generateFunctionName({
    method,
    name,
  });
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
};
`;
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
}
`;
  return [mutation];
}

export {
  generateFunctionName,
  generateAsyncFunction,
  generateTanStackQueryHooks,
};
