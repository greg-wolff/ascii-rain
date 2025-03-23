// Expanded character pool with glitch chars and alphabet
const glitchChars =
  "̴̡̼̤̝̦̳͎̤̠̲̟̘̙̭͕͊̇̐͆̌͑̏͑̚͝ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,.!?;: ";

// Collection of surreal, fragmentary poem lines
const poemLines = [
  "w̴h̵i̷s̴p̸e̸r̸s̵ ̸m̵e̷l̶t̷ ̶t̸h̴r̵o̵u̸g̴h̵ ̶d̴i̴g̶i̷t̴a̷l̷ ̶s̶k̷i̷n̸",
  "c̶h̸r̷o̶m̷e̴ ̴d̷r̵i̶n̶k̶ ̵s̸t̷a̵t̷i̷c̵ ̶d̶r̸e̸a̵m̸s̸",
  "s̴h̸a̶d̴o̵w̶s̴ ̴b̵i̷r̷t̶h̶ ̸f̸o̸r̷g̶o̶t̴t̶e̸n̷ ̵c̷o̴d̸e̶",
  "b̷i̶n̷a̶r̶y̵ ̴h̷e̴a̸r̸t̵s̵ ̵b̷l̵e̵e̸d̵ ̷q̶u̷a̵n̴t̸u̷m̶ ̷i̵n̵k̷",
  "e̶l̴e̶c̵t̸r̵i̷c̵ ̶g̵h̷o̸s̴t̶s̶ ̸t̴a̴s̷t̸e̴ ̷t̷o̸m̶o̴r̶r̶o̴w̴'̷s̸ ̵r̴a̷i̵n̵",
  "f̴r̴a̸c̵t̷u̸r̷e̸d̴ ̷e̸c̶h̸o̵e̷s̸ ̶d̵a̴n̸c̸e̴ ̷i̴n̷ ̵v̷o̶i̴d̸ ̵s̷p̷a̶c̷e̷",
  "m̴e̴m̴o̶r̴y̷ ̸c̷r̸y̵s̸t̵a̸l̶s̷ ̷d̵i̵s̴s̴o̴l̵v̸e̷ ̴t̵i̸m̷e̵'̴s̶ ̵t̸e̵e̴t̵h̵",
  "s̸i̴l̸i̴c̴o̸n̴ ̵f̵l̵o̷w̷e̴r̶s̸ ̴b̸l̷o̷o̵m̸ ̷i̶n̶ ̸d̴e̴a̵d̶ ̴s̵c̴r̵e̴e̸n̵s̷",
  "d̵a̴t̷a̸ ̴m̸o̸t̸h̸s̵ ̴c̶i̵r̴c̴l̵e̶ ̵h̶o̷l̶l̴o̸w̵ ̸l̸i̵g̷h̴t̶",
  "s̴y̸n̶t̷h̶e̶t̷i̷c̴ ̶s̶o̷u̵l̷s̸ ̵l̷e̸a̷k̴ ̵r̵a̴i̵n̴b̷o̶w̵ ̶r̴u̷s̴t̷",
  "g̶l̴a̸s̵s̷ ̸t̸h̸o̵u̴g̷h̴t̵s̴ ̷s̷h̴a̸t̶t̵e̷r̸ ̶i̵n̴t̷o̵ ̸s̷t̸a̵r̸s̴",
  "c̸o̸p̸p̴e̵r̷ ̷v̷e̴i̵n̸s̸ ̵p̴u̶l̷s̶e̵ ̷w̴i̸t̶h̷ ̷l̸o̴s̸t̵ ̴s̸i̸g̷n̵a̸l̴s̴",
  "d̷i̷g̵i̷t̸a̸l̸ ̴d̶u̶s̸t̶ ̶b̷r̸e̶e̵d̷s̷ ̷n̸e̷w̵ ̷s̷i̵l̶e̸n̶c̷e̸",
  "q̶u̵a̵n̷t̸u̵m̸ ̴w̴o̶l̶v̸e̵s̵ ̵h̵o̴w̷l̷ ̷t̶h̵r̸o̸u̴g̶h̷ ̵b̷r̴o̸k̸e̷n̶ ̶b̵i̸t̷s̸",
  "c̶h̷r̷o̶m̴e̷ ̶t̵e̸a̴r̷s̶ ̵f̴a̴l̷l̵ ̶t̵h̸r̵o̶u̴g̶h̴ ̷m̷a̸t̸r̵i̸x̶ ̶d̶r̵e̸a̷ms",
];

const MAX_JUMBLE_CLOUDS = 2;

const MAX_GLITCH_CLOUDS = 1;

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
  "stickers/D22BE9BD-BA30-4331-9C89-BE37CC8AF234.png",
  "stickers/730674B1-BDDD-4B11-8FB1-098F14A3363E.png",
  "stickers/1B43A1DB-8A0D-4343-8E5D-873D89491A76.png",
  "stickers/D871F752-F554-4A08-B12E-2EB8C053B8C5.png",
  "stickers/8B6B05F2-0169-48C8-864B-4FD480331342.png",
  "stickers/0A2C9DE3-9172-4F79-9D5F-4313A96A48C7.png",
  "stickers/501CF1EF-9079-4AB7-86FA-151CACAF41D5.png",
  "stickers/907C8223-DA81-4590-ADE5-B748A766CF99.png",
];

const MAX_STICKER_CLOUDS = 3;

class GlitchCloud {
  constructor() {
    this.randomSeed = Math.random();
    this.randomSeed2 = Math.random();
    this.chars = [];
    this.x = this.randomSeed * window.innerWidth;
    this.y = this.randomSeed2 * window.innerHeight;
    this.vx = (this.randomSeed2 - 0.5) * 15;
    this.vy = (this.randomSeed - 0.5) * 2;
    this.age = 0;
    this.lifespan = 10 + this.randomSeed * 100; // Longer lifespan
    this.size = 15;
    this.radius = 100 + this.randomSeed * 600; // Reduced radius for denser clouds
    this.maxSize = 20 + this.randomSeed * 40; // Reduced number of characters
    this.container = document.querySelector(".glitch-container");
    this.currentPoemLine =
      poemLines[Math.floor(Math.random() * poemLines.length)];
    this.lineHeight = 20; // Height between lines
    this.numVisibleLines = 9; // Number of visible lines
    this.charIndex = 0; // Track position in poem line
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

    // Add random font size variation
    const baseFontSize = 16;
    const fontVariation = Math.random() * 4 - 2;
    const fontSize = `${baseFontSize + fontVariation}px`;

    char.style.fontSize = fontSize;
    echo1.style.fontSize = fontSize;
    echo2.style.fontSize = fontSize;

    // Track position in poem line using age instead of lifespan
    const position = this.age % this.currentPoemLine.length;

    // Get next few characters, wrapping around if needed
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

    // Create a more organic cloud shape using random angles and distances
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * this.radius;
    const randomOffset = (Math.random() + Math.random() + Math.random()) / 3;
    const offsetX = Math.cos(angle) * distance * randomOffset;
    const offsetY = Math.sin(angle) * distance * randomOffset;
    const verticalSpread = Math.sin(angle) * (this.lineHeight * 0.5);
    const finalOffsetY = offsetY + verticalSpread;

    // Position characters with organic distribution
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

    // Only add new characters at a slower rate
    if (this.age % 2 === 0) {
      // Add chars every other frame
      while (
        this.chars.length < targetSize &&
        this.chars.length < this.maxSize
      ) {
        this.addChar();
      }
    }

    // Update characters less frequently
    for (let i = this.chars.length - 1; i >= 0; i--) {
      if (i % 2 === this.age % 2) {
        // Only update half the chars each frame
        const char = this.chars[i];
        char.lifetime++;
        char.offsetY += char.scrollSpeed; // Scroll upward

        // Remove character if it scrolls too high or lives too long
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

        // More organic movement pattern
        const wobble = Math.sin(char.phase) * char.individualRadius;
        const spiralX = Math.cos(char.phase * 0.5) * wobble;
        const spiralY = Math.sin(char.phase * 0.5) * wobble;

        const baseX = this.x + char.offsetX + spiralX;
        const baseY = this.y + char.offsetY + spiralY;

        // Update positions
        char.main.style.transform = `translate3d(${baseX}px, ${baseY}px, 0) rotate(${
          Math.sin(char.phase) * 10
        }deg)`;
        char.main.style.opacity =
          (0.4 + Math.sin(char.phase) * 0.3) * lifecycle;
        char.main.style.filter = `blur(${Math.sin(char.phase) * 1}px)`;

        // Update echoes
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
          (0.1 + Math.sin(char.phase) * 0.05) * lifecycle;
        char.echo2.style.filter = `blur(${Math.sin(char.phase) * 1}px)`;
      }
    }

    // Reduce movement calculations
    if (this.age % 3 === 0) {
      // Update position less frequently
      this.vx += (Math.random() - 0.5) * 0.01; // Reduced from 0.02
      this.vy += (Math.random() - 0.5) * 0.01; // Reduced from 0.02
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
  constructor() {
    this.randomSeed = Math.random();
    this.x = this.randomSeed * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.age = 0;
    this.lifespan = 100 + this.randomSeed * 300;
    this.container = document.querySelector(".glitch-container");

    // Get a random poem line and clean it to get distinct words
    this.currentPoemLine = poemLines[
      Math.floor(Math.random() * poemLines.length)
    ]
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Each word gets its own scanning properties
    this.words = this.currentPoemLine.map((word) => ({
      text: word,
      windowSize: 4 + Math.floor(Math.random() * 6), // Window sizes of 1-3
      position: 0,
      speed: 0.05 + Math.random() * 0.15, // Different speeds for each word
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
      // Create elements for each word
      const element = document.createElement("div");
      const echo1 = document.createElement("div");
      const echo2 = document.createElement("div");

      // Add random font size variation
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

    // Update each word
    this.words.forEach((word) => {
      // Update the scanning position
      word.phase += word.speed;
      if (word.phase >= 1) {
        word.phase = 0;
        word.position++;
        if (word.position > word.text.length) {
          word.position = 0;
        }
      }

      // Get the current slice of the word based on position and window size
      const start = word.position;
      const end = Math.min(start + word.windowSize, word.text.length);
      const displayText = word.text.slice(start, end);

      // Update position with circular motion
      word.angle += word.rotationSpeed;
      const x = this.x + Math.cos(word.angle) * word.radius;
      const y = this.y + Math.sin(word.angle) * word.radius;

      // Calculate opacity based on age and lifespan
      const lifecycle = Math.sin((this.age / this.lifespan) * Math.PI);
      const opacity = Math.max(0, Math.min(1, lifecycle));

      // Update main element and echoes
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
  constructor() {
    this.randomSeed = Math.random();
    this.x = this.randomSeed * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.age = 0;
    this.lifespan = 250;
    this.displayDuration = 100;
    this.dissolveDuration = 75;
    this.container = document.querySelector(".glitch-container");
    this.size = 100 + Math.random() * 100;
    this.pixelSize = 1;
    this.createSticker();
  }

  createSticker() {
    // Create wrapper for sticker
    this.wrapper = document.createElement("div");
    this.wrapper.className = "sticker-wrapper";

    // Create the sticker image
    this.element = document.createElement("img");
    this.element.className = "sticker-element";

    // Select random sticker
    const stickerPath =
      STICKER_PATHS[Math.floor(Math.random() * STICKER_PATHS.length)];
    this.element.src = stickerPath;

    // Set initial styles
    this.wrapper.style.position = "absolute";
    this.wrapper.style.left = `${this.x}px`;
    this.wrapper.style.top = `${this.y}px`;
    this.wrapper.style.width = `${this.size}px`;
    this.wrapper.style.height = `${this.size}px`;

    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.element.style.opacity = "1";

    // Create canvas for pixel effect
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

    // Create pixel positions array
    const totalPixels = this.canvas.width * this.canvas.height;
    this.pixelPositions = Array.from({ length: totalPixels }, (_, i) => ({
      x: i % this.canvas.width,
      y: Math.floor(i / this.canvas.width),
    }));

    // Shuffle pixel positions
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

    // Calculate which phase we're in
    if (this.age <= this.dissolveDuration) {
      // Dissolve in phase
      const progress = this.age / this.dissolveDuration;
      const pixelsToShow = Math.floor(this.pixelPositions.length * progress);

      // Clear the pixels in batches
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
        data[idx + 3] = 0; // Set alpha to 0
      }

      this.ctx.putImageData(imageData, 0, 0);
    } else if (this.age >= this.lifespan - this.dissolveDuration) {
      // Dissolve out phase
      const progress =
        (this.age - (this.lifespan - this.dissolveDuration)) /
        this.dissolveDuration;
      const pixelsToHide = Math.floor(this.pixelPositions.length * progress);

      // Add back the pixels in batches
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
        data[idx + 3] = 255; // Set alpha to fully opaque
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

// Add SVG filter for noise effect
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

// Update cloud management
const glitchClouds = [];
const jumbleClouds = [];
const stickerClouds = [];

function createClouds() {
  if (glitchClouds.length < MAX_GLITCH_CLOUDS) {
    glitchClouds.push(new GlitchCloud());
  }
  if (jumbleClouds.length < MAX_JUMBLE_CLOUDS) {
    jumbleClouds.push(new JumbleCloud());
  }
  if (stickerClouds.length < MAX_STICKER_CLOUDS) {
    stickerClouds.push(new StickerCloud());
  }
}

function updateClouds() {
  // Update glitch clouds
  for (let i = glitchClouds.length - 1; i >= 0; i--) {
    const isAlive = glitchClouds[i].update();
    if (!isAlive) {
      glitchClouds[i].destroy();
      glitchClouds.splice(i, 1);
    }
  }

  // Update jumble clouds
  for (let i = jumbleClouds.length - 1; i >= 0; i--) {
    const isAlive = jumbleClouds[i].update();
    if (!isAlive) {
      jumbleClouds[i].destroy();
      jumbleClouds.splice(i, 1);
    }
  }

  // Update sticker clouds
  for (let i = stickerClouds.length - 1; i >= 0; i--) {
    const isAlive = stickerClouds[i].update();
    if (!isAlive) {
      stickerClouds[i].destroy();
      stickerClouds.splice(i, 1);
    }
  }

  requestAnimationFrame(updateClouds);
}

// Add after the glitch-container setup, before the animation loops
function setupPostProcessing() {
  const container = document.querySelector(".glitch-container");

  // Create post-processing overlay
  const overlay = document.createElement("div");
  overlay.className = "post-processing-overlay";

  // Create scanlines
  if (POST_PROCESSING.scanlines) {
    const scanlines = document.createElement("div");
    scanlines.className = "scanlines";
    overlay.appendChild(scanlines);
  }

  // Create noise overlay
  if (POST_PROCESSING.noise) {
    const noise = document.createElement("div");
    noise.className = "noise";
    overlay.appendChild(noise);
  }

  // Create vignette
  if (POST_PROCESSING.vignette) {
    const vignette = document.createElement("div");
    vignette.className = "vignette";
    overlay.appendChild(vignette);
  }

  container.appendChild(overlay);
}

// Add this line before starting the animation
setupPostProcessing();
setupNoiseFilter();

// Start the animation
setInterval(createClouds, 1000);
requestAnimationFrame(updateClouds);
