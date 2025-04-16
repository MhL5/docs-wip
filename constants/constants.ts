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
      title: "Components",
      url: "#",
      items: [
        {
          title: "typography",
          url: "/snippets/components/typography",
        },
        {
          title: "form",
          url: "/snippets/components/form",
          subItems: [
            {
              title: "input",
              url: "/snippets/components/form/input",
            },
          ],
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
