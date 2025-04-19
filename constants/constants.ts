import { BookOpen, Table, Code2, Package, Zap, Wrench } from "lucide-react";
import { JSX } from "react";

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
    tailwindClass: "text-purple-600 dark:text-purple-400",
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
} as const;
