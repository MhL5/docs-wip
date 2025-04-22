"use client";

import {
  apiDefaultErrorMessage,
  methods,
  queryHooks,
} from "@/app/snippets/tools/crud-generator/CrudForm/constants";
import {
  generateAsyncFunction,
  generateTanStackQueryHooks,
} from "@/app/snippets/tools/crud-generator/CrudForm/utils";
import CopyButton from "@/components/blocks/buttons/CopyButton";
import Code from "@/components/blocks/code/Code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense, useState } from "react";
import { toast } from "sonner";

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
