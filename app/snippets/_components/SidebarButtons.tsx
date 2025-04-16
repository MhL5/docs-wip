"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarButtons({
  items,
}: {
  items: { title: string; url: string }[];
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive = pathname.includes(item.url);

        return (
          <Button
            key={`${item.title}-${item.url}`}
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start font-medium",
              isActive ? "text-primary" : "",
            )}
          >
            <Link key={item.title} href={item.url}>
              {item.title}
            </Link>
          </Button>
        );
      })}
    </>
  );
}
