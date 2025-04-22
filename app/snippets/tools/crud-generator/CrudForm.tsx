"use client";

import Code from "@/components/blocks/code/Code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, Suspense, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CopyButton from "@/components/blocks/buttons/CopyButton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const methods = ["post", "get", "delete", "put", "patch"] as const;
const queryHooks = ["useSuspenseQuery", "useQuery"] as const;
const apiDefaultErrorMessage =
  "مشکلی در هنگام دریافت X رخ داده است! لطفا دوباره تلاش کنید.";
type Options = {
  method: "post" | "get" | "delete" | "put" | "patch";
  name: string;
  defaultErrorMessage: string;
  route: string;
  version: "legacy" | "latest";
  queryHook: "useSuspenseQuery" | "useQuery";
  mutationSuccessMessage: string;
};

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

export default function CrudForm() {
  const [states, setStates] = useState<Options>({
    version: "latest",
    name: "",
    method: "get",
    queryHook: "useSuspenseQuery",
    defaultErrorMessage: apiDefaultErrorMessage,
    route: "",
    mutationSuccessMessage: "",
  });

  const isGetMethod = states.method === "get";

  return (
    <fieldset className="my-8 flex flex-col gap-5 rounded-md border p-5">
      <legend className="flex gap-3 px-4 text-lg font-bold">
        <span>Crud Form</span>
        <Button
          className=""
          variant="ghost"
          onClick={() => {
            setStates((s) => ({
              ...s,
              version: s.version === "latest" ? "legacy" : "latest",
            }));
          }}
        >
          {states.version === "latest" ? "latest" : "legacy"}
        </Button>
      </legend>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label>Name:</Label>
          <Input
            type="text"
            dir="auto"
            value={states.name}
            onChange={(e) => setStates((s) => ({ ...s, name: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Route:</Label>
          <Input
            type="text"
            dir="auto"
            value={states.route}
            onChange={(e) => {
              const startsWithSlash = e.target.value.startsWith("/");
              if (startsWithSlash)
                return toast.error("Route must not start with a slash");
              setStates((s) => ({ ...s, route: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Fallback Error Message:</Label>
          <Input
            type="text"
            dir="auto"
            value={states.defaultErrorMessage}
            onChange={(e) =>
              setStates((s) => ({ ...s, defaultErrorMessage: e.target.value }))
            }
          />
        </div>

        <Select
          onValueChange={(value) => {
            const isValidMethod = methods.includes(
              value as (typeof methods)[number],
            );

            if (!isValidMethod) return;

            setStates((s) => ({
              ...s,
              method: value as (typeof methods)[number],
            }));
          }}
          defaultValue={states.method}
        >
          <div className="flex flex-col gap-2">
            <Label className="">Method:</Label>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="" />
            </SelectTrigger>
          </div>
          <SelectContent>
            {methods.map((method) => {
              return (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {!isGetMethod ? (
          <div className="flex flex-col gap-2">
            <Label>Mutation Success Message:</Label>
            <Input
              type="text"
              dir="auto"
              value={states.mutationSuccessMessage}
              onChange={(e) =>
                setStates((s) => ({
                  ...s,
                  mutationSuccessMessage: e.target.value,
                }))
              }
            />
          </div>
        ) : (
          <Select
            onValueChange={(value) => {
              const isValidQueryHook = queryHooks.includes(
                value as (typeof queryHooks)[number],
              );

              if (!isValidQueryHook) return;

              setStates((s) => ({
                ...s,
                queryHook: value as (typeof queryHooks)[number],
              }));
            }}
            defaultValue={states.queryHook}
          >
            <div className="flex flex-col gap-2">
              <Label className="">Query Hook type:</Label>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
            </div>
            <SelectContent>
              {queryHooks.map((method) => {
                return (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </form>

      <Suspense>
        {generateTanStackQueryHooks(states)?.map((tqh, i) => {
          return (
            <div
              key={`generateTanStackQueryHooks-${tqh.slice(0, 10)}-${i}`}
              className={`${tqh ? "h-fit" : "h-0"} bg-code-background relative overflow-y-hidden rounded-lg transition-all duration-500 ease-linear`}
            >
              {tqh && (
                <div className="p-4">
                  <CopyButton
                    content={tqh}
                    className="absolute top-3 right-3"
                  />
                  <Code lang="tsx">{tqh}</Code>
                </div>
              )}
            </div>
          );
        })}
      </Suspense>

      <Suspense>
        <div
          className={`${generateAsyncFunction(states) ? "h-fit" : "h-0"} bg-code-background relative overflow-y-hidden rounded-lg transition-all duration-500 ease-linear`}
        >
          {generateAsyncFunction(states) && (
            <div className="p-4">
              <CopyButton
                content={generateAsyncFunction(states)}
                className="absolute top-3 right-3"
              />
              <Code lang="tsx">{generateAsyncFunction(states)}</Code>
            </div>
          )}
        </div>
      </Suspense>
    </fieldset>
  );
}
