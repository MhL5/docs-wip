import fs from "fs";
import path from "path";

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

function generateRoutes(baseDir: string): Record<string, Links[]> {
  const routes: Record<string, Links[]> = {
    snippets: [],
  };

  function processDirectory(dirPath: string, baseUrl: string): Links[] {
    const items: Links[] = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith("_")) {
        continue;
      }

      if (entry.isDirectory()) {
        const fullPath = path.join(dirPath, entry.name);
        const url = `${baseUrl}/${entry.name}`;

        const subItems = processDirectory(fullPath, url);

        items.push({
          title: entry.name.replace(/-/g, " "),
          url: url,
          items: subItems.length > 0 ? subItems : undefined,
        });
      }
    }

    return items;
  }

  const snippetsDir = path.join(baseDir, "app", "snippets");
  if (fs.existsSync(snippetsDir)) {
    routes.snippets = processDirectory(snippetsDir, "/snippets");
  }

  return routes;
}

function main() {
  const baseDir = process.cwd();
  const routes = generateRoutes(baseDir);

  const output = `// This file is auto-generated. Do not edit manually.
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

export const routes: Record<string, Links[]> = ${JSON.stringify(routes, null, 2)};
`;

  fs.writeFileSync(path.join(baseDir, "constants", "constants.ts"), output);
  console.log("Routes generated successfully!");
}

main();
