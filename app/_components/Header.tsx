import { Github, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import Image from "next/image";
import iconPng from "@/app/icon.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/blocks/buttons/ToggleTheme";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes } from "@/constants/constants";
import SidebarButtons from "@/app/snippets/_components/SidebarButtons";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function Header() {
  return (
    <header className="bg-background/70 sticky top-0 z-50 w-full border-b px-4 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="focus-visible:ring-ring ring-offset-background flex h-6 items-center space-x-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Image
              src={iconPng}
              alt="logo"
              width={32}
              height={32}
              className="h-6 w-6 object-cover dark:invert"
            />
            <span className="text-2xl leading-none font-medium">MhL</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Button
              asChild
              variant="link"
              size="xs"
              className="text-foreground"
            >
              <Link href="/snippets/components/typography">Snippets</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-4">
              <SheetTitle>
                <Link
                  href="/"
                  className="focus-visible:ring-ring ring-offset-background flex h-6 items-center space-x-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Image
                    src={iconPng}
                    alt="logo"
                    width={32}
                    height={32}
                    className="h-6 w-6 object-cover dark:invert"
                  />
                  <span className="text-2xl leading-none font-medium">MhL</span>
                </Link>
              </SheetTitle>

              <SheetDescription className="sr-only">
                A collection of snippets and tools to help you build your
                website.
              </SheetDescription>

              <Separator className="bg-foreground my-1 h-[2px] w-full" />

              <nav className="grid gap-7">
                {routes.snippets.map((section) => (
                  <div key={section.title}>
                    <h4 className="mb-2 font-semibold tracking-tight">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      <SidebarButtons items={section.items} />
                    </div>
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
