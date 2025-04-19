import { Button } from "@/components/ui/button";
import { snippetsPageLink } from "@/constants/constants";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center p-4 text-center">
      <div className="max-w-4xl">
        <h1 className="mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-bold text-transparent md:text-7xl dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
          Mohammad Hosein Lashani
        </h1>
        <h2 className="text-secondary-foreground mb-8 text-3xl font-medium md:text-4xl">
          Frontend Developer
        </h2>
        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl">
          Welcome to my digital space where I share code snippets and write
          about frontend development.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="default" size="lg">
            <Link href="#">Read Blog</Link>
          </Button>

          {snippetsPageLink ? (
            <Button asChild variant="outline" size="lg">
              <Link href={snippetsPageLink}>View Snippets</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
