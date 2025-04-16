import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

const data = [
  //  add snippets here
  {
    title: "Components",
    url: "#",
    items: [
      {
        title: "typography",
        url: "/snippets/components/typography",
      },
    ],
  },
  {
    title: "Hooks",
    url: "#",
    items: [
      {
        title: "useIsMobile",
        url: "/snippets/hooks/useIsMobile",
      },
      {
        title: "useIsMounted",
        url: "/snippets/hooks/useIsMounted",
      },
      {
        title: "useDebouncedValue",
        url: "/snippets/hooks/useDebouncedValue",
      },
    ],
  },
];

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-7xl grid-cols-[14rem_1fr] gap-5">
      <aside className="w-full pt-6 ltr:border-r rtl:border-l">
        <nav className="space-y-6">
          {data.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 text-sm font-semibold tracking-tight">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-sm",
                      "transition-colors",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </nav>
      </aside>

      <article className="">{children}</article>
    </div>
  );
}
