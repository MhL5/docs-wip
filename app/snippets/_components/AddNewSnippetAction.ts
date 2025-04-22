"use server";

import { toCamelCase } from "@/utils/toCamelCase";

export async function handleSavingSnippet({
  title,
  content,
  category,
}: {
  title: string;
  content: string;
  category: string;
}) {
  if (process.env.NODE_ENV !== "development") return null;

  const fs = require("fs").promises;
  const path = require("path");

  // Basic validation
  if (!title || !content || !category) {
    console.error("Missing required fields: title, content, or category.");
    // Consider throwing an error or returning a status
    return { success: false, message: "Missing required fields." };
  }

  // Sanitize title to be URL/filesystem friendly (basic example)
  const sanitizedTitle = toCamelCase(title);

  if (!sanitizedTitle) {
    console.error("Invalid title after sanitization.");
    return { success: false, message: "Invalid title." };
  }

  const snippetDirPath = path.join(
    process.cwd(),
    "app",
    "snippets",
    category,
    sanitizedTitle,
  );
  const snippetFilePath = path.join(snippetDirPath, "page.mdx");

  try {
    // 1. Create the directory if it doesn't exist
    await fs.mkdir(snippetDirPath, { recursive: true });
    console.log(`Directory created or already exists: ${snippetDirPath}`);

    // 2. Write the content to the page.mdx file
    await fs.writeFile(snippetFilePath, content, "utf8");
    console.log(`Snippet file created: ${snippetFilePath}`);

    // IMPORTANT: After creating the file, you need to update `constants/snippetsLinks.ts`
    // This usually involves reading the file, parsing it (if JSON or JS object),
    // adding the new entry, and writing it back.
    // Alternatively, run the 'npm run generate-routes' script if it handles this.
    console.warn(
      "Remember to update constants/snippetsLinks.ts or run 'npm run generate-routes'",
    );

    return { success: true, message: "Snippet saved successfully." };
  } catch (error) {
    console.error("Error saving snippet:", error);
    // Provide more specific error feedback if possible
    return {
      success: false,
      message: `Failed to save snippet: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
