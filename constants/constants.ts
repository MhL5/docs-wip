import { snippetsLinks } from "@/constants/snippetsLinks";
import {
  BookOpen,
  Table,
  Code2,
  Package,
  Zap,
  Wrench,
  Hammer,
  Settings2,
  Notebook,
} from "lucide-react";
import type { JSX } from "react";

export const snippetsCategoryConfig: Record<
  string,
  { icon: JSX.ElementType; tailwindClass: string }
> = {
  guides: {
    icon: BookOpen,
    tailwindClass: "text-blue-600 dark:text-blue-400",
  },
  schemas: {
    icon: Table,
    tailwindClass: "text-emerald-600 dark:text-emerald-400",
  },
  types: {
    icon: Code2,
    tailwindClass: "text-blue-600 dark:text-blue-400",
  },
  components: {
    icon: Package,
    tailwindClass: "text-orange-600 dark:text-orange-400",
  },
  hooks: {
    icon: Zap,
    tailwindClass: "text-yellow-600 dark:text-yellow-400",
  },
  utils: {
    icon: Wrench,
    tailwindClass: "text-emerald-600 dark:text-emerald-400",
  },
  tools: {
    icon: Hammer,
    tailwindClass: "text-rose-600 dark:text-rose-400",
  },
  configs: {
    icon: Settings2,
    tailwindClass: "text-purple-600 dark:text-purple-400",
  },
  notes: {
    icon: Notebook,
    tailwindClass: "text-zinc-600 dark:text-zinc-400",
  },
} as const;

export const snippetsPageLink =
  snippetsLinks?.[0]?.items && snippetsLinks[0].items[0]?.url;
