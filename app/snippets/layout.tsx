import SidebarButtons from "@/app/snippets/_components/SidebarButtons";
import { Button } from "@/components/ui/button";
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
        <nav className="grid gap-7 px-5">
          {data.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 font-semibold tracking-tight">
                {section.title}
              </h4>
              <div className="space-y-1">
                {/* {section.items.map((item) => (
                  <Button
                    key={`${item.title}-${item.url}`}
                    asChild
                    variant="ghost"
                    className="w-full justify-start font-medium"
                  >
                    <Link key={item.title} href={item.url}>
                      {item.title}
                    </Link>
                  </Button>
                ))} */}
                <SidebarButtons items={section.items} />
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <article>{children}</article>
    </div>
  );
}
