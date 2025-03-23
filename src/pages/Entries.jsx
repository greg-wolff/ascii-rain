// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { fetchNotes } from "../api/notes";
import OverlayTerminal from "../components/OverlayTerminal";
import "../styles/Entries.css";

function Entries({ updatePixelConfig }) {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  // Update pixel size when terminal is shown/hidden
  useEffect(() => {
    if (updatePixelConfig) {
      if (showTerminal) {
        // When overlay terminal is open
        updatePixelConfig({ pixelSize: 2, showOriginal: true });
      } else if (selectedEntry) {
        // When an entry is selected
        updatePixelConfig({ pixelSize: 4, showOriginal: true });
      } else {
        // Default for entries page
        updatePixelConfig({ pixelSize: 3, showOriginal: true });
      }
    }
  }, [showTerminal, selectedEntry, updatePixelConfig]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !selectedEntry) {
        setShowTerminal((prev) => !prev);
        console.log(updatePixelConfig);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEntry]);

  useEffect(() => {
    async function loadNotes() {
      try {
        console.log("Loading notes...");
        const notes = await fetchNotes();
        console.log("Notes loaded:", notes);
        setEntries(notes);
      } catch (err) {
        console.error("Error loading notes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  useEffect(() => {
    console.log("Current entries state:", entries);
  }, [entries]);

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
  };

  const handleClose = () => {
    setSelectedEntry(null);
  };

  const renderMarkdown = (content) => {
    try {
      // Remove the date metadata line if present
      const cleanedContent = content.replace(
        /^date:\s*\d{4}-\d{2}-\d{2}\s*\n?/m,
        ""
      );
      return (
        <ReactMarkdown
          components={{
            img: ({ src, alt }) => {
              // Parse filter parameters from alt text if present
              // Format: ![alt|brightness=120,contrast=150,saturate=130](/path/to/image.jpg)
              const [altText, filterParams] = (alt || "").split("|");
              let filterStyle = {};

              if (filterParams) {
                const filters = filterParams
                  .split(",")
                  .reduce((acc, filter) => {
                    const [key, value] = filter.trim().split("=");
                    if (key && value) {
                      acc[key] = value;
                    }
                    return acc;
                  }, {});

                // Build CSS filter string
                const filterString = Object.entries(filters)
                  .map(([key, value]) => `${key}(${value}%)`)
                  .join(" ");

                if (filterString) {
                  filterStyle.filter = filterString;
                }
              }

              return (
                <img
                  src={src}
                  alt={altText || alt}
                  style={filterStyle}
                  className="markdown-image"
                />
              );
            },
          }}
        >
          {cleanedContent || ""}
        </ReactMarkdown>
      );
    } catch (err) {
      console.error("Error rendering markdown:", err);
      return <p>{content}</p>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="entries-container"
    >
      {error && <div className="error-message">{error}</div>}
      {loading && !error && (
        <div className="loading-message">Loading entries...</div>
      )}
      <div className="entries-grid">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            layoutId={`entry-${entry.id}`}
            onClick={() => handleEntryClick(entry)}
            className="entry-card"
            whileHover={{
              scale: selectedEntry ? 1 : 1.02,
              rotate: selectedEntry ? 0 : 1,
            }}
            whileTap={{
              scale: selectedEntry ? 1 : 0.98,
              rotate: selectedEntry ? 0 : 1,
            }}
          >
            <p className="entry-date monospace">{entry.date}</p>
            <div className="entry-preview monospace">
              {renderMarkdown(entry.content.slice(0, 100) + "...")}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <motion.div className="entry-overlay" onClick={handleClose}>
            <motion.div
              layoutId={`entry-${selectedEntry.id}`}
              className="entry-detail"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="entry-date monospace">{selectedEntry.date}</p>
              <div className="entry-content monospace">
                {renderMarkdown(selectedEntry.content)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <OverlayTerminal
        isVisible={showTerminal}
        onClose={() => setShowTerminal(false)}
      />
    </motion.div>
  );
}

export default Entries;
