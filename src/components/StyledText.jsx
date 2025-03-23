import { useEffect, useState } from "react";
import "../styles/StyledText.css";

function StyledText({ text, effect }) {
  const [chars, setChars] = useState([]);

  useEffect(() => {
    if (!text) return;

    // Split text into individual characters with their styles
    setChars(
      text.split("").map((char, i) => ({
        char,
        key: `${char}-${i}`,
        style: {},
      }))
    );
  }, [text]);

  if (!effect) {
    return <span>{text}</span>;
  }

  // Handle multiple effects separated by spaces
  const effectClasses = effect
    .split(" ")
    .map((e) => e.substring(1)) // Remove the "/" prefix from each effect
    .join(" ");

  return (
    <span className={`styled-text ${effectClasses}`}>
      {chars.map((char, i) => (
        <span
          key={char.key}
          className="char"
          style={{
            ...char.style,
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {char.char}
        </span>
      ))}
    </span>
  );
}

export default StyledText;
