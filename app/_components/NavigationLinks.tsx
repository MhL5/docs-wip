"use client";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { snippetsLinks } from "@/constants/snippetsLinks";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface NavItemProps {
  title: string;
  url: string;
  isActive: boolean;
  className?: string;
  isSubItem?: boolean;
  isInsideSheet?: boolean;
}

const NavItem = ({
  title,
  url,
  isActive,
  className,
  isSubItem,
  isInsideSheet,
}: NavItemProps) => {
  const Wrapper = isInsideSheet ? SheetClose : Fragment;

  return (
    <Wrapper asChild>
      <Button
        asChild
        variant="nav"
        size={isSubItem ? "xs" : "sm"}
        className={cn(
          "w-full justify-start text-base transition-all",
          isActive ? "text-primary" : "text-muted-foreground",
          className,
        )}
      >
        <Link href={url}>{title}</Link>
      </Button>
    </Wrapper>
  );
};

export default function NavigationLinks({
  isInsideSheet = false,
}: {
  isInsideSheet?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-6 px-5">
      {snippetsLinks.map(({ title, url, items }) => (
        <div key={`${title}-${url}`}>
          <h2 className="text-foreground mb-2 w-full justify-start px-2 text-lg font-semibold tracking-wider hover:bg-transparent">
            {title}
          </h2>
          <div className="space-y-1">
            {items?.map((item) => {
              const isActive = pathname.includes(item.url);

              return (
                <div key={`${item.title}-${item.url}`} className="space-y-1">
                  <NavItem
                    title={item.title}
                    url={item.url}
                    isInsideSheet={isInsideSheet}
                    isActive={isActive}
                  />
                  {item?.subItems?.map((subItem) => (
                    <NavItem
                      key={subItem.title}
                      title={subItem.title}
                      url={subItem.url}
                      isActive={isActive}
                      isInsideSheet={isInsideSheet}
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
  );
}
