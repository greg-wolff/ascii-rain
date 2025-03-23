/* eslint-env node */
import cors from "cors";
import express from "express";
import { promises as fs } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static("public"));

// Endpoint to list markdown files
app.get("/notes", async (req, res) => {
  try {
    const files = await fs.readdir(path.join(__dirname, "public/notes"));
    const markdownFiles = files.filter((file) => file.endsWith(".md"));
    res.json(markdownFiles);
  } catch (error) {
    console.error("Error reading notes directory:", error);
    res.status(500).json({ error: "Failed to read notes directory" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
