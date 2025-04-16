import CopyButton from "@/components/blocks/buttons/CopyButton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";
import { ComponentPropsWithoutRef } from "react";
import { codeToHtml } from "shiki";

const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="mt-4 mb-6 scroll-m-20 font-mono text-4xl font-extrabold tracking-tight"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-4 mb-6 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-4 mb-6 scroll-m-20 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className="mt-4 mb-6 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h5: (props: ComponentPropsWithoutRef<"h5">) => (
    <h5
      className="mt-4 mb-6 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    />
  ),
  h6: (props: ComponentPropsWithoutRef<"h6">) => (
    <h6
      className="mt-4 mb-6 scroll-m-20 text-base font-semibold tracking-tight"
      {...props}
    />
  ),

  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),

  // lists
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="list-decimal space-y-2 pl-5" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-disc space-y-1 pl-5" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1" {...props} />
  ),

  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="inline-block font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium" {...props} />
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const className =
      "text-blue-500 hover:text-blue-700 dark:text-blue-700 dark:hover:text-blue-500 underline";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: ({ children, className, ...props }: ComponentPropsWithoutRef<"pre">) => {
    const codeSnippet = (
      children as React.ReactNode & { props?: { children?: React.ReactNode } }
    )?.props?.children;

    const codeString = typeof codeSnippet === "string" ? codeSnippet : null;
    return (
      <pre
        className={cn(
          "relative my-3 block w-full overflow-x-auto rounded-md bg-[#24292e] p-4 text-base",
          className,
        )}
        {...props}
      >
        {codeString && (
          <CopyButton className="absolute top-3 right-3" content={codeString} />
        )}
        {children}
      </pre>
    );
  },

  code: async ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"code">) => {
    if (className?.startsWith("language-")) {
      // If it's a code block
      const lang = className.replace("language-", ""); // Extract the language (e.g., ts, js)
      const codeHTML = await codeToHtml(children as string, {
        lang,
        theme: "github-dark",
      });

      return (
        <code
          dangerouslySetInnerHTML={{ __html: codeHTML }}
          {...props}
          className={cn("text-sm", className)}
        />
      );
    }

    return (
      <code
        {...props}
        className="prose-code:after:content-none bg-secondary text-secondary-foreground rounded-sm px-1.5 py-0.5 tracking-wide"
      >
        {typeof children === "string" ? children.replaceAll("`", "") : children}
      </code>
    );
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table>
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-muted text-muted-foreground ml-[0.075em] border-l-3 pl-4"
      {...props}
    />
  ),
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}
