import { useEffect, useRef } from "react";
import "../styles/NoteOverlay.css";

function NoteOverlay({ isVisible, onClose, onSubmit }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isVisible && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isVisible]);

  const handleSubmit = () => {
    if (textareaRef.current && textareaRef.current.value.trim()) {
      onSubmit(textareaRef.current.value);
      textareaRef.current.value = "";
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="note-overlay">
      <div className="note-container">
        <div className="note-content">
          <pre className="note-border">
            {"╔══════════════════════════════════════╗\n"}
            {"║                                      ║\n"}
            {"║                                      ║\n"}
            {"║                                      ║\n"}
            {"║                                      ║\n"}
            {"║                                      ║\n"}
            {"║                                      ║\n"}
            {"║                                      ║\n"}
            {"╚══════════════════════════════════════╝"}
          </pre>
          <textarea
            ref={textareaRef}
            className="note-textarea"
            placeholder="Type your note here..."
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
        </div>
        <div className="send-button" onClick={handleSubmit}>
          <pre>
            {"   ╔═══════╗\n"}
            {"   ║ SEND  ║\n"}
            {"   ╚═══════╝"}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default NoteOverlay;
