import { Github, MoonIcon, SunIcon } from "lucide-react";
import Image from "next/image";
import iconPng from "@/app/icon.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/blocks/buttons/ToggleTheme";

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
        </div>
      </div>
    </header>
  );
}
