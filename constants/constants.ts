// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-routes' to update.

type Links = {
  title: string;
  url: string;
  items?: {
    title: string;
    url: string;
    subItems?: {
      title: string;
      url: string;
    }[];
  }[];
};

export const routes: Record<string, Links[]> = {
  snippets: [
    {
      title: "components",
      url: "/snippets/components",
      items: [
        {
          title: "typography",
          url: "/snippets/components/typography",
        },
      ],
    },
    {
      title: "features",
      url: "/snippets/features",
      items: [
        {
          title: "structured data",
          url: "/snippets/features/structured-data",
        },
      ],
    },
    {
      title: "hooks",
      url: "/snippets/hooks",
      items: [
        {
          title: "useDebouncedValue",
          url: "/snippets/hooks/useDebouncedValue",
        },
        {
          title: "useIsMobile",
          url: "/snippets/hooks/useIsMobile",
        },
        {
          title: "useIsMounted",
          url: "/snippets/hooks/useIsMounted",
        },
      ],
    },
    {
      title: "utils",
      url: "/snippets/utils",
      items: [
        {
          title: "isServer isClient",
          url: "/snippets/utils/isServer-isClient",
        },
      ],
    },
  ],
};
