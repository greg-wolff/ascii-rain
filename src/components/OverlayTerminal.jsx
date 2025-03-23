import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logToSheet } from "../api/sheetsApi";
import "../styles/OverlayTerminal.css";
import NoteOverlay from "./NoteOverlay";
import StyledText from "./StyledText";

function OverlayTerminal({ isVisible, onClose, updatePixelConfig }) {
  const [input, setInput] = useState("");
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [lines, setLines] = useState([
    {
      text: "Welcome to glass.florist, type `help` for more info",
      type: "system",
    },
  ]);
  const navigate = useNavigate();
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const helpPages = {
    1: [
      { text: "╔══════════════════════════════════════╗", type: "system" },
      { text: "║           glass.florist help         ║", type: "system" },
      { text: "║              [page 1/2]              ║", type: "system" },
      { text: "╠══════════════════════════════════════╣", type: "system" },
      { text: "║ navigation commands:                 ║", type: "system" },
      { text: "║ - back: return to main terminal      ║", type: "system" },
      { text: "║ - map: go to map view               ║", type: "system" },
      { text: "║ - entries: go to entries view       ║", type: "system" },
      { text: "║                                     ║", type: "system" },
      { text: "║ terminal commands:                  ║", type: "system" },
      { text: "║ - clear: clear terminal screen      ║", type: "system" },
      { text: "║ - log: open note overlay           ║", type: "system" },
      { text: "║              next >                 ║", type: "system" },
      { text: "╚══════════════════════════════════════╝", type: "system" },
    ],
    2: [
      { text: "╔══════════════════════════════════════╗", type: "system" },
      { text: "║         text effect commands         ║", type: "system" },
      { text: "║              [page 2/2]              ║", type: "system" },
      { text: "╠══════════════════════════════════════╣", type: "system" },
      { text: "║ color effects:                      ║", type: "system" },
      { text: "║ /flash1: purple ↔ lavender          ║", type: "system" },
      { text: "║ /flash2: red ↔ black                ║", type: "system" },
      { text: "║ /flash3: light ↔ dark green         ║", type: "system" },
      { text: "║ /glow1: red→orange→yellow→green     ║", type: "system" },
      { text: "║ /glow2: red→magenta→blue→dark red   ║", type: "system" },
      { text: "║ /glow3: white→green→white→cyan      ║", type: "system" },
      { text: "║ /rainbow: rainbow colors            ║", type: "system" },
      { text: "║                                     ║", type: "system" },
      { text: "║ animation effects:                  ║", type: "system" },
      { text: "║ /wave: vertical wave motion         ║", type: "system" },
      { text: "║ /wave2: diagonal wave motion        ║", type: "system" },
      { text: "║ /shake: wacky shaking               ║", type: "system" },
      { text: "║ /slide: vertical slide              ║", type: "system" },
      { text: "║ /scroll: horizontal scroll          ║", type: "system" },
      { text: "║                                     ║", type: "system" },
      { text: "║ tip: combine effects with +         ║", type: "system" },
      { text: "║ example: /rainbow+wave hello        ║", type: "system" },
      { text: "║           < prev                    ║", type: "system" },
      { text: "╚══════════════════════════════════════╝", type: "system" },
    ],
  };

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Update pixel size when terminal becomes visible
  useEffect(() => {
    // If we can update pixelation, set size to 2 when terminal is visible
    if (updatePixelConfig) {
      if (isVisible) {
        updatePixelConfig({
          pixelSize: 2,
          showOriginal: true,
        });
      }
    }
  }, [isVisible, updatePixelConfig]);

  const handleCommand = () => {
    const command = input.trim();
    const commandLower = command.toLowerCase();
    const newLines = [...lines, { text: `> ${input}`, type: "input" }];

    if (commandLower.startsWith("/")) {
      // Handle text effects
      const effectCommand = command.split(" ")[0];
      const text = command.slice(effectCommand.length).trim();

      if (!text) {
        newLines.push({
          text: "please provide text after the effect command",
          type: "error",
        });
      } else {
        // Split combined effects and validate each one
        const effects = effectCommand
          .split("+")
          .map((effect) => (effect.startsWith("/") ? effect : `/${effect}`));
        const validEffects = [
          "/flash1",
          "/flash2",
          "/flash3",
          "/glow1",
          "/glow2",
          "/glow3",
          "/rainbow",
          "/wave",
          "/wave2",
          "/shake",
          "/slide",
          "/scroll",
        ];

        const invalidEffect = effects.find(
          (effect) => !validEffects.includes(effect)
        );

        if (invalidEffect) {
          newLines.push({
            text: `unknown effect command: ${invalidEffect}. type 'help' to see available effects`,
            type: "error",
          });
        } else {
          newLines.push({
            text,
            type: "system",
            effect: effects.join(" "),
          });
        }
      }
    } else if (commandLower === "help 2" || commandLower === "next") {
      newLines.push(...helpPages[2]);
    } else if (commandLower === "prev") {
      newLines.push(...helpPages[1]);
    } else {
      switch (commandLower) {
        case "help":
          newLines.push(...helpPages[1]);
          break;
        case "back":
          navigate("/");
          break;
        case "map":
          navigate("/map");
          break;
        case "entries":
          navigate("/entries");
          break;
        case "clear":
          setLines([
            {
              text: "Terminal cleared. Type `help` for available commands",
              type: "system",
            },
          ]);
          setInput("");
          return;
        case "log":
          setShowNoteOverlay(true);
          break;
        default:
          newLines.push({
            text: "invalid command. type `help` for available commands",
            type: "error",
          });
      }
    }

    setLines(newLines);
    setInput("");
  };

  const handleNoteSubmit = async (message) => {
    const newLines = [...lines];
    try {
      const result = await logToSheet(message);
      newLines.push({
        text: `message logged successfully (id: ${result.spreadsheetId})`,
        type: "system",
      });
    } catch (error) {
      newLines.push({
        text: `Failed to log message: ${error.message}`,
        type: "error",
      });
    }
    setLines(newLines);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="overlay-terminal">
      <div className="terminal-window" ref={terminalRef}>
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.effect ? (
              <StyledText text={line.text} effect={line.effect} />
            ) : (
              line.text
            )}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="prompt">&gt; </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
      <NoteOverlay
        isVisible={showNoteOverlay}
        onClose={() => setShowNoteOverlay(false)}
        onSubmit={handleNoteSubmit}
      />
    </div>
  );
}

export default OverlayTerminal;
