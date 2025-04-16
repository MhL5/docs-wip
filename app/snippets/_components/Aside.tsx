"use client";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/constants";
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
    variant="ghost"
    size={isSubItem ? "sm" : "default"}
    className={cn(
      "w-full justify-start transition-colors",
      isActive
        ? "bg-primary/10 text-primary hover:bg-primary/20"
        : "text-muted-foreground hover:text-foreground hover:bg-muted",
      className,
    )}
  >
    <Link href={url}>{title}</Link>
  </Button>
);

export default function Aside() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-full pt-6 lg:block ltr:border-r rtl:border-l">
      <nav className="grid gap-6 px-5">
        {routes.snippets.map(({ title, url, items }) => (
          <div key={`${title}-${url}`}>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-foreground mb-2 w-full justify-start px-2 text-lg font-semibold tracking-tight hover:bg-transparent"
            >
              <Link href={url}>{title}</Link>
            </Button>
            <div className="space-y-1">
              {items?.map((item) => {
                const isActive = pathname.includes(item.url);

                return (
                  <div key={`${item.title}-${item.url}`} className="space-y-1">
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
                        className="pl-6 text-sm"
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
