import { promises as fs } from "fs";
import matter from "gray-matter";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildNotes() {
  try {
    // Read all markdown files from public/notes
    const notesDir = path.join(__dirname, "../public/notes");
    const files = await fs.readdir(notesDir);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    // Process each markdown file
    const notes = await Promise.all(
      markdownFiles.map(async (file) => {
        const content = await fs.readFile(path.join(notesDir, file), "utf-8");
        const { data, content: markdownContent } = matter(content);
        const title = file.replace(".md", "");

        return {
          id: title,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          content: markdownContent,
          date: data.date || new Date().toISOString().split("T")[0],
        };
      })
    );

    // Sort notes by date (newest first)
    notes.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Write the processed notes to a JSON file
    await fs.writeFile(
      path.join(__dirname, "../public/notes.json"),
      JSON.stringify(notes, null, 2)
    );

    console.log("Successfully built notes.json");
  } catch (error) {
    console.error("Error building notes:", error);
    process.exit(1);
  }
}

buildNotes();
