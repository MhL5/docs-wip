import { SunIcon } from "lucide-react";
import Image from "next/image";
import iconPng from "@/app/icon.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b px-4 py-1.5 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link
              href="/"
              className="flex items-center gap-2 ltr:mr-2 rtl:ml-2"
            >
              <Image
                src={iconPng}
                alt="logo"
                width={32}
                height={32}
                className="size-5 object-cover dark:invert"
              />
              <span className="text-2xl font-bold">MhL</span>
            </Link>
          </Button>

          <nav>
            <Button asChild variant="ghost">
              <Link
                className="mr-6 flex items-center hover:opacity-75"
                href="/snippets"
              >
                <span className="font-bold">Snippets</span>
              </Link>
            </Button>
          </nav>
        </div>

        <div>
          <Button variant="ghost" aria-label="Toggle theme">
            <SunIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
