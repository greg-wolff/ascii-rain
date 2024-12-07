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
      speed: 0.05 + Math.random() * 0.1, // Different speeds for each word
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

// Update cloud management
const glitchClouds = [];
const jumbleClouds = [];

function createClouds() {
  if (glitchClouds.length < MAX_GLITCH_CLOUDS) {
    glitchClouds.push(new GlitchCloud());
  }
  if (jumbleClouds.length < MAX_JUMBLE_CLOUDS) {
    jumbleClouds.push(new JumbleCloud());
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

// Start the animation
setInterval(createClouds, 1000);
requestAnimationFrame(updateClouds);
