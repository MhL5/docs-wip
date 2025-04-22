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
const apiDefaultErrorMessage =
  "مشکلی در هنگام دریافت X رخ داده است! لطفا دوباره تلاش کنید.";
type Options = {
  method: "post" | "get" | "delete" | "put" | "patch";
  name: string;
  defaultErrorMessage: string;
  route: string;
  version: "legacy" | "latest";
};

function generateResult({
  version,
  name,
  route,
  method,
  defaultErrorMessage,
}: Options) {
  if (!name) return ``; // Simplified check

  const renameMethod = {
    post: "create",
    get: "get",
    delete: "delete",
    put: "update",
    patch: "update",
  };

  const functionName = `${renameMethod[method]}${name[0].toUpperCase() + name.slice(1)}`;

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

  // Common template parts
  const commonImports = `
// todo: add types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;`;

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
export async function ${functionName}(): ${resultType}<ApiResponse> {
  const [error, data] = await ${catchFunction}<ApiResponse>(
    ${apiObject}.${method}('${route}').json(),
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

export default function CrudForm({
  result,
}: {
  result: (data: string) => ReactNode;
}) {
  const [states, setStates] = useState<Options>({
    version: "latest",
    name: "",
    method: "get",
    defaultErrorMessage: apiDefaultErrorMessage,
    route: "",
  });

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
              <SelectValue placeholder="Select a verified email to display" />
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
      </form>

      <Suspense>
        <div
          className={`${generateResult(states) ? "h-160" : "h-0"} bg-code-background relative overflow-y-hidden rounded-lg transition-all duration-500 ease-linear`}
        >
          {generateResult(states) && (
            <div className="p-4">
              <CopyButton
                content={generateResult(states)}
                className="absolute top-3 right-3"
              />
              <Code lang="tsx">{generateResult(states)}</Code>
            </div>
          )}
        </div>
      </Suspense>
    </fieldset>
  );
}
