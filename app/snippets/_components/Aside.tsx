"use client";

import AddNewSnippet from "@/app/snippets/_components/AddNewSnippet";
import { Button } from "@/components/ui/button";
import { snippetsCategoryConfig } from "@/constants/constants";
import { snippetsLinks } from "@/constants/snippetsLinks";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  title: string;
  url: string;
  isActive: boolean;
  className?: string;
  isSubItem?: boolean;
}

const NavItem = ({
  title,
  url,
  isActive,
  className,
  isSubItem,
}: NavItemProps) => (
  <Button
    asChild
    variant={isActive ? "default" : "ghost"}
    size={isSubItem ? "xs" : "sm"}
    className={cn("w-full justify-start transition-all", className)}
  >
    <Link href={url}>{title}</Link>
  </Button>
);

export default function Aside() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-full pt-6 lg:block ltr:border-r rtl:border-l">
      <nav className="grid gap-6 overflow-hidden px-5">
        {snippetsLinks.map(({ title, url, items }) => {
          const config = snippetsCategoryConfig?.[`${title}`];
          const Icon = config.icon;

          return (
            <div
              key={`${title}-${url}`}
              className={title === "components" ? "capitalize" : ""}
            >
              <h2
                className={`${config.tailwindClass} || mb-2 flex w-full items-center justify-start gap-2 px-2 text-sm font-semibold tracking-wider capitalize`}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {title}
              </h2>
              <div className="space-y-1">
                {items?.map((item) => {
                  const isActive = pathname.includes(item.url);

                  return (
                    <div
                      key={`${item.title}-${item.url}`}
                      className="space-y-1"
                    >
                      <NavItem
                        title={item.title}
                        url={item.url}
                        isActive={isActive}
                      />
                      {item?.subItems?.map((subItem) => (
                        <NavItem
                          key={subItem.title}
                          title={subItem.title}
                          url={subItem.url}
                          isActive={isActive}
                          isSubItem
                          className="pl-6"
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <AddNewSnippet />
    </aside>
  );
}
