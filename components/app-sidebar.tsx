import { GalleryVerticalEnd } from "lucide-react";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import icon from "@/app/icon.png";

const data = {
  navMain: [
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/snippets">
                <Image
                  src={icon}
                  alt=""
                  width={20}
                  height={20}
                  className="size-7 rounded-sm"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-lg font-medium">Snippets</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
