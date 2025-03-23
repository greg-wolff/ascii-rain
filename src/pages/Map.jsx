// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import OverlayTerminal from "../components/OverlayTerminal";
import "../styles/Map.css";

// Expanded character pool with glitch chars and alphabet
const GLITCH_CHARS =
  "̴̡̼̤̝̦̳͎̤̠̲̟̘̙̭͕͊̇̐͆̌͑̏͑̚͝ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,.!?;: ";

// Collection of surreal, fragmentary poem lines
const poemLines = [
  "w̴h̵i̷s̴p̸e̸r̸s̵ ̸m̵e̷l̶t̷ ̶t̸h̴r̵o̵u̸g̴h̵ ̶d̴i̴g̶i̷t̴a̷l̷ ̶s̶k̷i̷n̸",
  "c̶h̸r̷o̶m̷e̴ ̴d̷r̵i̶n̶k̶ ̵s̸t̷a̵t̷i̷c̵ ̶d̶r̸e̸a̵m̸s̸",
  "s̴h̸a̶d̴o̵w̶s̴ ̴b̵i̷r̷t̶h̶ ̸f̸o̸r̷g̶o̶t̴t̶e̸n̷ ̵c̷o̴d̸e̶",
];

const MAX_JUMBLE_CLOUDS = 2;
const MAX_GLITCH_CLOUDS = 1;
const MAX_STICKER_CLOUDS = 10;

// Add these constants at the top of the file
const POST_PROCESSING = {
  chromaShift: true,
  scanlines: true,
  noise: true,
  vignette: false,
};

// Add sticker image paths
const STICKER_PATHS = [
  "stickers/a.png",
  "stickers/b.png",
  "stickers/924C3EC5-FC46-4D94-B0C7-347FE5206680.png",
  "stickers/58C741D0-7E2A-4CD6-AB15-2A61C00970EB.png",
  "stickers/D542A35E-C75E-4FA7-85E2-DCFC1D30FEE1.png",
  "stickers/4407BC41-706E-40E5-857C-CF1B93DA7718.png",
  "stickers/57FB4B98-EA55-4EDA-9E77-C09C786CD92A.png",
  "stickers/7B2944F3-A137-43A8-89ED-4EFD292826C1.png",
  "stickers/C742D0D1-68B9-402E-BA94-10A5F18FA77B.png",
  "stickers/F1C9146A-268F-4212-91B3-2AC01008D837.png",
  "stickers/C84D768F-44E7-415B-8FB7-2D05D0FFA181.png",
  "stickers/2547B42B-1D83-47F5-B636-6334FBC9D1E7.png",
  "stickers/54EF767B-4EA6-48BF-BE61-62AD93BB1002.png",
  "stickers/27FE3739-3F6B-4EEA-9F3B-6E4D749E4781.png",
  "stickers/33C1771F-F678-4A2B-8CB2-F5F0CA5CD02F.png",
  "stickers/3AA29303-0E5A-4338-A80D-4A2C90C6545C.png",
  "stickers/201C1E04-FDCB-42C9-A566-AC6C24BBE360.png",
  "stickers/97F5DC33-2379-4404-91AB-99F66200FC66.png",
  "stickers/730674B1-BDDD-4B11-8FB1-098F14A3363E.png",
  "stickers/1B43A1DB-8A0D-4343-8E5D-873D89491A76.png",
  "stickers/D871F752-F554-4A08-B12E-2EB8C053B8C5.png",
  "stickers/8B6B05F2-0169-48C8-864B-4FD480331342.png",
  "stickers/0A2C9DE3-9172-4F79-9D5F-4313A96A48C7.png",
  "stickers/501CF1EF-9079-4AB7-86FA-151CACAF41D5.png",
  "stickers/907C8223-DA81-4590-ADE5-B748A766CF99.png",
];

class GlitchCloud {
  constructor(container) {
    this.randomSeed = Math.random();
    this.randomSeed2 = Math.random();
    this.chars = [];
    this.x = this.randomSeed * window.innerWidth;
    this.y = this.randomSeed2 * window.innerHeight;
    this.vx = (this.randomSeed2 - 0.5) * 15;
    this.vy = (this.randomSeed - 0.5) * 2;
    this.age = 0;
    this.lifespan = 10 + this.randomSeed * 100;
    this.size = 15;
    this.radius = 100 + this.randomSeed * 600;
    this.maxSize = 20 + this.randomSeed * 40;
    this.container = container;
    this.currentPoemLine =
      poemLines[Math.floor(Math.random() * poemLines.length)];
    this.lineHeight = 20;
    this.numVisibleLines = 9;
    this.charIndex = 0;
    this.createCloud();
  }

  createCloud() {
    for (let i = 0; i < this.size; i++) {
      this.addChar();
    }
  }

  addChar() {
    const char = document.createElement("div");
    const echo1 = document.createElement("div");
    const echo2 = document.createElement("div");

    char.className = "glitch-char";
    echo1.className = "glitch-char echo echo1";
    echo2.className = "glitch-char echo echo2";

    const baseFontSize = 16;
    const fontVariation = Math.random() * 4 - 2;
    const fontSize = `${baseFontSize + fontVariation}px`;

    char.style.fontSize = fontSize;
    echo1.style.fontSize = fontSize;
    echo2.style.fontSize = fontSize;

    const position = this.age % this.currentPoemLine.length;
    const getWrappedSlice = (start, length) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        const index = (start + i) % this.currentPoemLine.length;
        result += this.currentPoemLine[index];
      }
      return result;
    };

    char.textContent = getWrappedSlice(position, 8);
    echo1.textContent = getWrappedSlice(position + 1, 8);
    echo2.textContent = getWrappedSlice(position + 2, 8);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * this.radius;
    const randomOffset = (Math.random() + Math.random() + Math.random()) / 3;
    const offsetX = Math.cos(angle) * distance * randomOffset;
    const offsetY = Math.sin(angle) * distance * randomOffset;
    const verticalSpread = Math.sin(angle) * (this.lineHeight * 0.5);
    const finalOffsetY = offsetY + verticalSpread;

    char.style.transform = `translate3d(${this.x + offsetX}px, ${
      this.y + finalOffsetY
    }px, 0)`;
    echo1.style.transform = `translate3d(${this.x + offsetX + 1}px, ${
      this.y + finalOffsetY
    }px, 0)`;
    echo2.style.transform = `translate3d(${this.x + offsetX - 1}px, ${
      this.y + finalOffsetY
    }px, 0)`;

    this.container.appendChild(char);
    this.container.appendChild(echo1);
    this.container.appendChild(echo2);

    this.chars.push({
      main: char,
      echo1: echo1,
      echo2: echo2,
      offsetX,
      offsetY: finalOffsetY,
      angle,
      distance,
      speed: 0.02 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 1,
      individualRadius: 0.5 + Math.random(),
      lifetime: 0,
      maxLifetime: 150 + Math.random() * 100,
      scrollSpeed: 0.5 + Math.random() * 0.5,
    });
  }

  update() {
    this.age++;
    const lifecycle = Math.sin((this.age / this.lifespan) * Math.PI);
    const targetSize = Math.floor(this.maxSize * lifecycle);

    if (this.age % 2 === 0) {
      while (
        this.chars.length < targetSize &&
        this.chars.length < this.maxSize
      ) {
        this.addChar();
      }
    }

    for (let i = this.chars.length - 1; i >= 0; i--) {
      if (i % 2 === this.age % 2) {
        const char = this.chars[i];
        char.lifetime++;
        char.offsetY += char.scrollSpeed;

        if (
          char.offsetY < -this.lineHeight ||
          char.lifetime > char.maxLifetime
        ) {
          char.main.remove();
          char.echo1.remove();
          char.echo2.remove();
          this.chars.splice(i, 1);
          continue;
        }

        char.phase += char.speed;

        const wobble = Math.sin(char.phase) * char.individualRadius;
        const spiralX = Math.cos(char.phase * 0.5) * wobble;
        const spiralY = Math.sin(char.phase * 0.5) * wobble;

        const baseX = this.x + char.offsetX + spiralX;
        const baseY = this.y + char.offsetY + spiralY;

        char.main.style.transform = `translate3d(${baseX}px, ${baseY}px, 0) rotate(${
          Math.sin(char.phase) * 10
        }deg)`;
        char.main.style.opacity =
          (0.4 + Math.sin(char.phase) * 0.3) * lifecycle;
        char.main.style.filter = `blur(${Math.sin(char.phase) * 1}px)`;

        char.echo1.style.transform = `translate3d(${
          baseX + 2
        }px, ${baseY}px, 0) rotate(${Math.sin(char.phase) * 10}deg)`;
        char.echo1.style.background = `linear-gradient(${char.phase * 360}deg, 
          rgba(142, 85, 114, ${0.3 + Math.sin(char.phase) * 0.2}), 
          rgba(92, 107, 128, ${0.3 + Math.cos(char.phase) * 0.2}), 
          rgba(76, 88, 102, ${0.3 + Math.sin(char.phase * 2) * 0.2}))`;
        char.echo1.style.webkitBackgroundClip = "text";
        char.echo1.style.webkitTextFillColor = "transparent";

        char.echo2.style.transform = `translate3d(${
          baseX - 2
        }px, ${baseY}px, 0) rotate(${Math.sin(char.phase) * 10}deg)`;
        char.echo2.style.background = `linear-gradient(${-char.phase * 360}deg, 
          rgba(121, 104, 126, ${0.3 + Math.sin(char.phase) * 0.2}), 
          rgba(96, 85, 99, ${0.3 + Math.cos(char.phase * 2) * 0.2}), 
          rgba(82, 94, 103, ${0.3 + Math.sin(char.phase * 3) * 0.2}))`;
        char.echo2.style.webkitBackgroundClip = "text";
        char.echo2.style.webkitTextFillColor = "transparent";

        char.echo1.style.opacity =
          (0.2 + Math.sin(char.phase) * 0.1) * lifecycle;
        char.echo1.style.filter = `blur(${Math.sin(char.phase) * 1}px)`;
        char.echo2.style.opacity =
          (0.2 + Math.cos(char.phase) * 0.1) * lifecycle;
        char.echo2.style.filter = `blur(${Math.cos(char.phase) * 1}px)`;
      }
    }

    if (this.age % 3 === 0) {
      this.vx += (Math.random() - 0.5) * 0.01;
      this.vy += (Math.random() - 0.5) * 0.01;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
    }

    if (this.age >= this.lifespan) {
      this.destroy();
      return false;
    }

    return true;
  }

  destroy() {
    this.chars.forEach((char) => {
      char.main.remove();
      char.echo1.remove();
      char.echo2.remove();
    });
    this.chars = [];
  }
}

class JumbleCloud {
  constructor(container) {
    this.randomSeed = Math.random();
    this.x = this.randomSeed * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.age = 0;
    this.lifespan = 100 + this.randomSeed * 300;
    this.container = container;

    this.currentPoemLine = poemLines[
      Math.floor(Math.random() * poemLines.length)
    ]
      .split(/\s+/)
      .filter((word) => word.length > 0);

    this.words = this.currentPoemLine.map((word) => ({
      text: word,
      windowSize: 4 + Math.floor(Math.random() * 6),
      position: 0,
      speed: 0.05 + Math.random() * 0.15,
      phase: 0,
      element: null,
      echo1: null,
      echo2: null,
      angle: Math.random() * Math.PI * 2,
      radius: 30 + Math.random() * 100,
      rotationSpeed: 0.001 + Math.random() * 0.003,
    }));

    this.createCloud();
  }

  createCloud() {
    this.words.forEach((word) => {
      const element = document.createElement("div");
      const echo1 = document.createElement("div");
      const echo2 = document.createElement("div");

      const baseFontSize = 16;
      const fontVariation = Math.random() * 8 - 2;
      const fontSize = `${baseFontSize + fontVariation}px`;

      element.style.fontSize = fontSize;
      echo1.style.fontSize = fontSize;
      echo2.style.fontSize = fontSize;

      element.className = "jumble-char";
      echo1.className = "jumble-char echo echo1";
      echo2.className = "jumble-char echo echo2";

      this.container.appendChild(element);
      this.container.appendChild(echo1);
      this.container.appendChild(echo2);

      word.element = element;
      word.echo1 = echo1;
      word.echo2 = echo2;
    });
  }

  update() {
    this.age++;

    this.words.forEach((word) => {
      word.phase += word.speed;
      if (word.phase >= 1) {
        word.phase = 0;
        word.position++;
        if (word.position > word.text.length) {
          word.position = 0;
        }
      }

      const start = word.position;
      const end = Math.min(start + word.windowSize, word.text.length);
      const displayText = word.text.slice(start, end);

      word.angle += word.rotationSpeed;
      const x = this.x + Math.cos(word.angle) * word.radius;
      const y = this.y + Math.sin(word.angle) * word.radius;

      const lifecycle = Math.sin((this.age / this.lifespan) * Math.PI);
      const opacity = Math.max(0, Math.min(1, lifecycle));

      word.element.textContent = displayText;
      word.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      word.element.style.opacity = opacity * 0.8;

      word.echo1.textContent = displayText;
      word.echo1.style.transform = `translate3d(${x + 9}px, ${y}px, 0)`;
      word.echo1.style.background = `linear-gradient(${word.phase * 360}deg, 
        rgba(${Math.sin(word.phase * 5) * 255},${
        Math.sin(word.phase * 5) * 255
      },${Math.sin(word.phase * 5) * 255},0.5), 
        rgba(${Math.cos(word.phase * 3) * 255},165,${
        Math.sin(word.phase * 2) * 255
      },0.5), 
        rgba(0,${Math.sin(word.phase * 4) * 255},255,0.5))`;
      word.echo1.style.webkitBackgroundClip = "text";
      word.echo1.style.webkitTextFillColor = "transparent";
      word.echo1.style.opacity = opacity * 0.4;

      word.echo2.textContent = displayText;
      word.echo2.style.transform = `translate3d(${x - 7}px, ${y}px, 0)`;
      word.echo2.style.background = `linear-gradient(${-word.phase * 360}deg, 
        rgba(${Math.sin(word.phase * 2) * 255},${
        Math.sin(word.phase * 2) * 255
      },${Math.sin(word.phase * 2) * 255},0.5), 
        rgba(${Math.cos(word.phase * 4) * 255},128,${
        Math.sin(word.phase * 3) * 255
      },0.5), 
        rgba(255,255,255, ${Math.cos(word.phase * 5)})`;
      word.echo2.style.webkitBackgroundClip = "text";
      word.echo2.style.webkitTextFillColor = "transparent";
      word.echo2.style.color = "rgba(0,255,255,0.5)";
      word.echo2.style.opacity = opacity * 0.2;
      word.echo1.style.willChange = "transform, opacity";
      word.echo2.style.willChange = "transform, opacity";
    });

    if (this.age >= this.lifespan) {
      this.destroy();
      return false;
    }

    return true;
  }

  destroy() {
    this.words.forEach((word) => {
      word.element.remove();
      word.echo1.remove();
      word.echo2.remove();
    });
    this.words = [];
  }
}

class StickerCloud {
  constructor(container) {
    this.randomSeed = Math.random();
    this.x = this.randomSeed * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.age = 0;
    this.lifespan = 250;
    this.displayDuration = 100;
    this.dissolveDuration = 75;
    this.container = container;
    this.size = 100 + Math.random() * 100;
    this.pixelSize = 1;
    this.createSticker();
  }

  createSticker() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "sticker-wrapper";

    this.element = document.createElement("img");
    this.element.className = "sticker-element";

    const stickerPath =
      STICKER_PATHS[Math.floor(Math.random() * STICKER_PATHS.length)];
    this.element.src = stickerPath;

    this.wrapper.style.position = "absolute";
    this.wrapper.style.left = `${this.x}px`;
    this.wrapper.style.top = `${this.y}px`;
    this.wrapper.style.width = `${this.size}px`;
    this.wrapper.style.height = `${this.size}px`;

    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.element.style.opacity = "1";

    this.canvas = document.createElement("canvas");
    this.canvas.className = "dissolve-canvas";
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width = Math.ceil(this.size);
    this.canvas.height = Math.ceil(this.size);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#1a1a1f";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const totalPixels = this.canvas.width * this.canvas.height;
    this.pixelPositions = Array.from({ length: totalPixels }, (_, i) => ({
      x: i % this.canvas.width,
      y: Math.floor(i / this.canvas.width),
    }));

    for (let i = this.pixelPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.pixelPositions[i], this.pixelPositions[j]] = [
        this.pixelPositions[j],
        this.pixelPositions[i],
      ];
    }

    this.wrapper.appendChild(this.element);
    this.wrapper.appendChild(this.canvas);
    this.container.appendChild(this.wrapper);
  }

  update() {
    this.age++;

    if (this.age <= this.dissolveDuration) {
      const progress = this.age / this.dissolveDuration;
      const pixelsToShow = Math.floor(this.pixelPositions.length * progress);

      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      const data = imageData.data;

      for (let i = 0; i < pixelsToShow; i++) {
        const pos = this.pixelPositions[i];
        const idx = (pos.y * this.canvas.width + pos.x) * 4;
        data[idx + 3] = 0;
      }

      this.ctx.putImageData(imageData, 0, 0);
    } else if (this.age >= this.lifespan - this.dissolveDuration) {
      const progress =
        (this.age - (this.lifespan - this.dissolveDuration)) /
        this.dissolveDuration;
      const pixelsToHide = Math.floor(this.pixelPositions.length * progress);

      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      const data = imageData.data;

      for (let i = 0; i < pixelsToHide; i++) {
        const pos = this.pixelPositions[i];
        const idx = (pos.y * this.canvas.width + pos.x) * 4;
        data[idx + 3] = 255;
      }

      this.ctx.putImageData(imageData, 0, 0);
    }

    if (this.age >= this.lifespan) {
      this.destroy();
      return false;
    }

    return true;
  }

  destroy() {
    this.wrapper.remove();
  }
}

function setupNoiseFilter() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("style", "position: absolute; width: 0; height: 0");
  svg.innerHTML = `
    <defs>
      <filter id="noise-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 .5 1 1"/>
          <feFuncG type="discrete" tableValues="0 .5 1 1"/>
          <feFuncB type="discrete" tableValues="0 .5 1 1"/>
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic"/>
      </filter>
    </defs>
  `;
  document.body.appendChild(svg);
}

function setupPostProcessing(container) {
  const overlay = document.createElement("div");
  overlay.className = "post-processing-overlay";

  if (POST_PROCESSING.scanlines) {
    const scanlines = document.createElement("div");
    scanlines.className = "scanlines";
    overlay.appendChild(scanlines);
  }

  if (POST_PROCESSING.noise) {
    const noise = document.createElement("div");
    noise.className = "noise";
    overlay.appendChild(noise);
  }

  if (POST_PROCESSING.vignette) {
    const vignette = document.createElement("div");
    vignette.className = "vignette";
    overlay.appendChild(vignette);
  }

  container.appendChild(overlay);
}

function Map({ updatePixelConfig }) {
  const [showTerminal, setShowTerminal] = useState(false);

  // Ensure pixelation is disabled on map page
  useEffect(() => {
    if (updatePixelConfig) {
      updatePixelConfig({
        showOriginal: true,
        pixelSize: 2,
      });
    }
  }, [updatePixelConfig]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowTerminal((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".glitch-container");
    if (!container) return;

    setupNoiseFilter();
    setupPostProcessing(container);

    const glitchClouds = [];
    const jumbleClouds = [];
    const stickerClouds = [];

    function createClouds() {
      if (glitchClouds.length < MAX_GLITCH_CLOUDS) {
        glitchClouds.push(new GlitchCloud(container));
      }
      if (jumbleClouds.length < MAX_JUMBLE_CLOUDS) {
        jumbleClouds.push(new JumbleCloud(container));
      }
      if (stickerClouds.length < MAX_STICKER_CLOUDS) {
        stickerClouds.push(new StickerCloud(container));
      }
    }

    let animationFrameId;
    function updateClouds() {
      for (let i = glitchClouds.length - 1; i >= 0; i--) {
        const isAlive = glitchClouds[i].update();
        if (!isAlive) {
          glitchClouds[i].destroy();
          glitchClouds.splice(i, 1);
        }
      }

      for (let i = jumbleClouds.length - 1; i >= 0; i--) {
        const isAlive = jumbleClouds[i].update();
        if (!isAlive) {
          jumbleClouds[i].destroy();
          jumbleClouds.splice(i, 1);
        }
      }

      for (let i = stickerClouds.length - 1; i >= 0; i--) {
        const isAlive = stickerClouds[i].update();
        if (!isAlive) {
          stickerClouds[i].destroy();
          stickerClouds.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(updateClouds);
    }

    const cloudInterval = setInterval(createClouds, 1000);
    updateClouds();

    return () => {
      clearInterval(cloudInterval);
      cancelAnimationFrame(animationFrameId);
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="map-container"
    >
      <div className="glitch-container"></div>
      <OverlayTerminal
        isVisible={showTerminal}
        onClose={() => setShowTerminal(false)}
      />
    </motion.div>
  );
}

export default Map;
