import NavigationLinks from "@/app/_components/NavigationLinks";
import iconPng from "@/app/icon.png";
import ModeToggle from "@/components/blocks/buttons/ToggleTheme";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { snippetsPageLink } from "@/constants/constants";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

          <nav className="hidden lg:flex lg:items-center lg:gap-x-6">
            {snippetsPageLink ? (
              <Button
                asChild
                variant="link"
                size="xs"
                className="text-foreground"
              >
                <Link href={`${snippetsPageLink}`}>Snippets</Link>
              </Button>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
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

              <NavigationLinks isInsideSheet />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
