export async function fetchNotes() {
  try {
    const response = await fetch("/notes/");
    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }
    const files = await response.json();
    return Promise.all(
      files.map(async (file) => {
        const content = await fetch(`/notes/${file}`).then((res) => res.text());
        const title = file.replace(".md", "");
        // Extract date from markdown content if specified
        const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
        const date = dateMatch
          ? dateMatch[1]
          : new Date().toISOString().split("T")[0];
        return {
          id: title,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          content,
          date,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}
