"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, use, useEffect, useState } from "react";
import { codeToHtml } from "shiki";

export default function Code({
  children,
  className,
  lang,
  ...props
}: { lang: string } & ComponentPropsWithoutRef<"code">) {
  /**
   * VM9213 _99313996._.js:19 A component was suspended by an uncached promise.
   * Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.
   * temp commented out because of the error
   */
  //   const codeHtml = use(
  //   codeToHtml(children as string, {
  //     lang,
  //     theme: "github-dark",
  //   }),
  //   );

  const [codeHtml, setCodeHtml] = useState("");

  useEffect(() => {
    async function generateCode() {
      const code = await codeToHtml(children as string, {
        lang,
        theme: "github-dark",
      });
      setCodeHtml(code);
    }
    generateCode();
  }, [children]);

  return (
    <code
      dangerouslySetInnerHTML={{ __html: codeHtml }}
      {...props}
      className={cn("text-sm", className)}
    />
  );
}
