"use client";

import {
  apiDefaultErrorMessage,
  methods,
  queryHooks,
} from "@/app/snippets/tools/crud-generator/CrudForm/constants";
import { Options } from "@/app/snippets/tools/crud-generator/CrudForm/types";
import {
  generateAsyncFunction,
  generateTanStackQueryHooks,
} from "@/app/snippets/tools/crud-generator/CrudForm/utils";
import CopyButton from "@/components/blocks/buttons/CopyButton";
import Code from "@/components/blocks/code/Code";
import CodeBlock from "@/components/blocks/code/CodeBlock";
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
    name: "",
    nameLabel: "",
    method: "get",
    queryHook: "useSuspenseQuery",
    route: "",
  });

  const isGetMethod = states.method === "get";
  const { data, name } = generateAsyncFunction(states);

  return (
    <fieldset className="my-8 flex flex-col gap-5 rounded-md border p-5">
      <legend className="flex gap-3 px-4 text-lg font-bold">
        <>Crud Form</>
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
          <Label>Label:</Label>
          <Input
            type="text"
            dir="auto"
            value={states.nameLabel}
            onChange={(e) =>
              setStates((s) => ({ ...s, nameLabel: e.target.value }))
            }
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

        {!isGetMethod ? null : (
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

      {generateTanStackQueryHooks(states).length > 0 && !!data ? (
        <Suspense>
          {generateTanStackQueryHooks(states)?.map(({ data, name }, i) => {
            return (
              <CodeBlock
                key={`generateTanStackQueryHooks-${data.slice(0, 10)}-${i}`}
                data={data}
                name={name}
              />
            );
          })}
          <CodeBlock
            key={`generateTanStackQueryHooks-${data.slice(0, 10)}`}
            data={data}
            name={name}
          />
        </Suspense>
      ) : null}
    </fieldset>
  );
}
