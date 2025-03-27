export async function fetchNotes() {
  try {
    const response = await fetch("/notes.json");
    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}
