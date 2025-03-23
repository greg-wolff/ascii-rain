import html2canvas from "html2canvas";
import rasterizeHTML from "rasterizehtml";
import { useEffect, useRef, useState } from "react";
import "../styles/PixelatedViewport.css";

// Accept props with defaults for dynamic configuration
function PixelatedViewport({
  children,
  pixelSize = 2,
  showOriginal = true,
  scanlineIntensity = 0,
  noiseIntensity = 0,
  ghostingAmount = 0.05,
  glitchAmount = 0.3,
  rgbShiftAmount = 0.1,
  threshold = 0.15,
  opacityThreshold = 0.15,
  refreshRate = 60,
  useAsciiMode = false,
}) {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const requestRef = useRef(null);
  const debugPanelRef = useRef(null);
  const glitchCanvasRef = useRef(null);
  const bufferCanvasRef = useRef(null);

  // Combine props with state for full configuration
  const [config, setConfig] = useState({
    pixelSize: pixelSize,
    threshold: threshold,
    refreshRate: refreshRate,
    useHtml2Canvas: true,
    showOriginal: showOriginal,
    debugMode: false,
    opacityThreshold: opacityThreshold,
    glitchAmount: glitchAmount,
    rgbShiftAmount: rgbShiftAmount,
    scanlineIntensity: scanlineIntensity,
    noiseIntensity: noiseIntensity,
    ghostingAmount: ghostingAmount,
    useAsciiMode: useAsciiMode,
    showDebugGrid: false,
  });

  const [stats, setStats] = useState({
    lastRenderTime: 0,
    fps: 0,
    renderedPixels: 0,
    totalPixels: 0,
    error: null,
  });

  // ASCII characters ordered by density (for ASCII mode)
  const asciiChars = "@%#*+=-:. ";

  // Add presets for quick configuration
  const presets = {
    default: {
      pixelSize: 2,
      threshold: 0.15,
      opacityThreshold: 0.15,
      refreshRate: 60,
      glitchAmount: 0.3,
      rgbShiftAmount: 0.1,
      scanlineIntensity: 0,
      noiseIntensity: 0,
      ghostingAmount: 0.05,
      useAsciiMode: false,
      showDebugGrid: false,
    },
    highContrast: {
      pixelSize: 6,
      threshold: 0.3,
      opacityThreshold: 0.1,
      refreshRate: 30,
      glitchAmount: 0.05,
      rgbShiftAmount: 0.05,
      scanlineIntensity: 0.2,
      noiseIntensity: 0.02,
      ghostingAmount: 0.05,
      useAsciiMode: false,
    },
    lowRes: {
      pixelSize: 12,
      threshold: 0.1,
      opacityThreshold: 0.05,
      refreshRate: 20,
      glitchAmount: 0.3,
      rgbShiftAmount: 0.1,
      scanlineIntensity: 0.15,
      noiseIntensity: 0.08,
      ghostingAmount: 0.15,
      useAsciiMode: false,
    },
    ascii: {
      pixelSize: 10,
      threshold: 0.05,
      opacityThreshold: 0.05,
      refreshRate: 15,
      glitchAmount: 0.1,
      rgbShiftAmount: 0.0,
      scanlineIntensity: 0.05,
      noiseIntensity: 0.05,
      ghostingAmount: 0.1,
      useAsciiMode: true,
    },
    glitchy: {
      pixelSize: 8,
      threshold: 0.05,
      opacityThreshold: 0.01,
      refreshRate: 30,
      glitchAmount: 0.5,
      rgbShiftAmount: 0.8,
      scanlineIntensity: 0.2,
      noiseIntensity: 0.2,
      ghostingAmount: 0.2,
      useAsciiMode: false,
    },
  };

  // Toggle debug panel with backtick key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "`") {
        setConfig((prev) => ({ ...prev, debugMode: !prev.debugMode }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll and resize event handlers
  useEffect(() => {
    let scrollTimeout;
    let resizeTimeout;

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(renderPixelated, 10);
    };

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;

          if (glitchCanvasRef.current) {
            glitchCanvasRef.current.width = window.innerWidth;
            glitchCanvasRef.current.height = window.innerHeight;
          }

          if (bufferCanvasRef.current) {
            bufferCanvasRef.current.width = window.innerWidth;
            bufferCanvasRef.current.height = window.innerHeight;
          }

          renderPixelated();
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [config]);

  // Initialize the glitch effect canvas
  useEffect(() => {
    if (glitchCanvasRef.current) {
      glitchCanvasRef.current.width = window.innerWidth;
      glitchCanvasRef.current.height = window.innerHeight;
    }
  }, []);

  // Create buffer canvas for double-buffering
  useEffect(() => {
    bufferCanvasRef.current = document.createElement("canvas");
    const buffer = bufferCanvasRef.current;
    buffer.width = window.innerWidth;
    buffer.height = window.innerHeight;
  }, []);

  // Initial setup and render loop
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      console.log(
        "PixelatedViewport initialized with canvas",
        canvasRef.current
      );

      const renderLoop = () => {
        renderPixelated().catch((err) => {
          console.error("Error in render loop:", err);
        });

        if (config.refreshRate > 0) {
          requestRef.current = setTimeout(() => {
            requestAnimationFrame(renderLoop);
          }, 1000 / config.refreshRate);
        }
      };

      requestAnimationFrame(renderLoop);
    }

    return () => {
      if (requestRef.current) {
        clearTimeout(requestRef.current);
      }
    };
  }, [
    config.pixelSize,
    config.threshold,
    config.refreshRate,
    config.useHtml2Canvas,
    config.showOriginal,
    config.opacityThreshold,
    config.glitchAmount,
    config.rgbShiftAmount,
    config.scanlineIntensity,
    config.noiseIntensity,
    config.ghostingAmount,
    config.useAsciiMode,
    config.showDebugGrid,
  ]);

  // Update config when props change
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      pixelSize: pixelSize,
      showOriginal: showOriginal,
      threshold: threshold,
      opacityThreshold: opacityThreshold,
      glitchAmount: glitchAmount,
      rgbShiftAmount: rgbShiftAmount,
      scanlineIntensity: scanlineIntensity,
      noiseIntensity: noiseIntensity,
      ghostingAmount: ghostingAmount,
      refreshRate: refreshRate,
      useAsciiMode: useAsciiMode,
    }));
  }, [
    pixelSize,
    showOriginal,
    threshold,
    opacityThreshold,
    glitchAmount,
    rgbShiftAmount,
    scanlineIntensity,
    noiseIntensity,
    ghostingAmount,
    refreshRate,
    useAsciiMode,
  ]);

  // Helper function to get document content
  const getDocumentContent = () => {
    // When using the whole document, prefer the document.body or document.documentElement
    // This gives better results than trying to render just our contentRef
    return contentRef.current.querySelector(".app") || document.body;
  };

  // The main rendering function
  const renderPixelated = async () => {
    const canvas = canvasRef.current;
    const content = getDocumentContent();
    const glitchCanvas = glitchCanvasRef.current;
    const bufferCanvas = bufferCanvasRef.current;

    if (!canvas || !bufferCanvas) return;

    // Use buffer canvas for rendering
    const bufferCtx = bufferCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    const glitchCtx = glitchCanvas ? glitchCanvas.getContext("2d") : null;
    const startTime = performance.now();

    // Clear only the BUFFER canvas - main canvas stays as-is until we're done
    bufferCtx.fillStyle = "#1a1a1f";
    bufferCtx.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    if (glitchCtx) {
      glitchCtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);
    }

    // Draw debug pattern ONLY if there's no content, or if showDebugGrid is enabled
    if (!content || config.showDebugGrid) {
      const gridSize = 16;
      bufferCtx.fillStyle = "#292929";

      for (let y = 0; y < bufferCanvas.height; y += gridSize) {
        for (let x = 0; x < bufferCanvas.width; x += gridSize) {
          if ((x / gridSize + y / gridSize) % 2 === 0) {
            bufferCtx.fillRect(x, y, gridSize, gridSize);
          }
        }
      }

      if (!content) {
        console.warn("No content element found to render");
        setStats({
          lastRenderTime: 0,
          fps: 0,
          renderedPixels: 0,
          totalPixels: 0,
          error: "No content to render",
        });

        // Even with no content, copy buffer to main canvas to prevent flicker
        ctx.drawImage(bufferCanvas, 0, 0);
        return;
      }
    }

    try {
      let sourceCanvas;

      // Use selected rendering library
      if (config.useHtml2Canvas) {
        // html2canvas approach
        const options = {
          scale: 1 / config.pixelSize,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#1a1a1f",
          x: window.scrollX,
          y: window.scrollY,
          scrollX: 0,
          scrollY: 0,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          onclone: (clonedDoc) => {
            // Find and hide the pixelated canvas and debug panel in the cloned document
            const clonedCanvas = clonedDoc.querySelector(".pixelated-canvas");
            const clonedDebug = clonedDoc.querySelector(".debug-panel");
            const clonedGlitch = clonedDoc.querySelector(".glitch-canvas");

            if (clonedCanvas) clonedCanvas.style.display = "none";
            if (clonedDebug) clonedDebug.style.display = "none";
            if (clonedGlitch) clonedGlitch.style.display = "none";
          },
          ignoreElements: (element) => {
            // Ignore the debug panel itself and the canvas
            return (
              element.classList &&
              (element.classList.contains("debug-panel") ||
                element.classList.contains("pixelated-canvas") ||
                element.classList.contains("glitch-canvas"))
            );
          },
        };

        // console.log("Rendering with html2canvas", {
        //   scrollX: window.scrollX,
        //   scrollY: window.scrollY,
        //   width: window.innerWidth,
        //   height: window.innerHeight,
        // });

        try {
          sourceCanvas = document.createElement("canvas");
          // Use document.documentElement to capture the whole page
          const renderedCanvas = await html2canvas(
            document.documentElement,
            options
          );

          // Copy to our source canvas at reduced size
          sourceCanvas.width = renderedCanvas.width;
          sourceCanvas.height = renderedCanvas.height;
          sourceCanvas.getContext("2d").drawImage(renderedCanvas, 0, 0);
          //   console.log(
          //     "html2canvas completed:",
          //     sourceCanvas.width,
          //     "x",
          //     sourceCanvas.height
          //   );
        } catch (err) {
          console.error("html2canvas error:", err);
        }
      } else {
        // rasterizeHTML approach
        try {
          sourceCanvas = document.createElement("canvas");
          sourceCanvas.width = Math.ceil(window.innerWidth / config.pixelSize);
          sourceCanvas.height = Math.ceil(
            window.innerHeight / config.pixelSize
          );

          console.log(
            "Rendering with rasterizeHTML:",
            sourceCanvas.width,
            "x",
            sourceCanvas.height
          );

          // Only capture the visible part of the page
          const html = document.documentElement.outerHTML;

          await rasterizeHTML.drawHTML(html, sourceCanvas, {
            zoom: 1 / config.pixelSize,
            executeJs: false,
            baseUrl: window.location.href,
            width: window.innerWidth / config.pixelSize,
            height: window.innerHeight / config.pixelSize,
          });

          console.log("rasterizeHTML completed");
        } catch (err) {
          console.error("rasterizeHTML error:", err);
        }
      }

      // Ensure we have a valid source canvas
      if (
        !sourceCanvas ||
        sourceCanvas.width === 0 ||
        sourceCanvas.height === 0
      ) {
        console.error("Failed to render source canvas");
        return;
      }

      // Apply glitch effect to the source canvas
      if (config.glitchAmount > 0) {
        applyGlitchEffect(sourceCanvas, config.glitchAmount);
      }

      // Draw the pixelated version
      if (config.showOriginal) {
        // Show the regular non-pixelated content
        bufferCtx.drawImage(
          sourceCanvas,
          0,
          0,
          bufferCanvas.width,
          bufferCanvas.height
        );
      } else {
        // Apply pixelation effect
        const smallWidth = sourceCanvas.width;
        const smallHeight = sourceCanvas.height;

        try {
          const smallImgData = sourceCanvas
            .getContext("2d")
            .getImageData(0, 0, smallWidth, smallHeight);
          const smallPixels = smallImgData.data;

          const pixelWidth = Math.ceil(bufferCanvas.width / config.pixelSize);
          const pixelHeight = Math.ceil(bufferCanvas.height / config.pixelSize);

          let renderedPixels = 0;
          const totalPixels = pixelWidth * pixelHeight;

          // Create ghost effect by drawing previous frame with reduced opacity
          if (config.ghostingAmount > 0 && glitchCtx) {
            bufferCtx.globalAlpha = config.ghostingAmount;
            bufferCtx.drawImage(glitchCanvas, 0, 0);
            bufferCtx.globalAlpha = 1.0;
          }

          // Draw a faint debug grid to see where pixels would be
          if (config.showDebugGrid) {
            bufferCtx.strokeStyle = "rgba(100, 100, 100, 0.1)";
            bufferCtx.lineWidth = 1;
            for (let x = 0; x < bufferCanvas.width; x += config.pixelSize) {
              bufferCtx.beginPath();
              bufferCtx.moveTo(x, 0);
              bufferCtx.lineTo(x, bufferCanvas.height);
              bufferCtx.stroke();
            }
            for (let y = 0; y < bufferCanvas.height; y += config.pixelSize) {
              bufferCtx.beginPath();
              bufferCtx.moveTo(0, y);
              bufferCtx.lineTo(bufferCanvas.width, y);
              bufferCtx.stroke();
            }
          }

          // Apply pixel effect with threshold for brightness
          for (let y = 0; y < smallHeight; y++) {
            for (let x = 0; x < smallWidth; x++) {
              const i = (y * smallWidth + x) * 4;

              // Get RGBA values
              const r = smallPixels[i];
              const g = smallPixels[i + 1];
              const b = smallPixels[i + 2];
              const a = smallPixels[i + 3];

              // Skip transparent pixels
              if (a / 255 < config.opacityThreshold) continue;

              // Calculate brightness (HSP color model - human perception of lightness)
              const brightness =
                Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) / 255;

              // Draw pixel if it exceeds threshold
              if (brightness >= config.threshold) {
                const pixelX = x * config.pixelSize;
                const pixelY = y * config.pixelSize;

                if (config.useAsciiMode) {
                  // ASCII mode - use characters instead of colored pixels
                  const charIndex = Math.floor(
                    brightness * (asciiChars.length - 1)
                  );
                  const char = asciiChars[asciiChars.length - 1 - charIndex];

                  bufferCtx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
                  bufferCtx.font = `${config.pixelSize}px monospace`;
                  bufferCtx.fillText(char, pixelX, pixelY + config.pixelSize);
                } else {
                  // Regular pixel mode
                  bufferCtx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
                  bufferCtx.fillRect(
                    pixelX,
                    pixelY,
                    config.pixelSize,
                    config.pixelSize
                  );
                }

                renderedPixels++;
              }
            }
          }

          // Apply scanlines
          if (config.scanlineIntensity > 0) {
            applyScanlines(
              bufferCtx,
              bufferCanvas.width,
              bufferCanvas.height,
              config.scanlineIntensity,
              config.pixelSize
            );
          }

          // Apply noise
          if (config.noiseIntensity > 0) {
            applyNoise(
              bufferCtx,
              bufferCanvas.width,
              bufferCanvas.height,
              config.noiseIntensity
            );
          }

          // Update stats
          const endTime = performance.now();
          const renderTime = endTime - startTime;

          setStats({
            lastRenderTime: renderTime.toFixed(2),
            fps: (1000 / renderTime).toFixed(1),
            renderedPixels,
            totalPixels,
          });

          // Copy current frame to glitch canvas for ghost effect
          if (glitchCtx) {
            glitchCtx.drawImage(bufferCanvas, 0, 0);
          }
        } catch (err) {
          console.error("Error processing image data:", err);
        }
      }
    } catch (error) {
      console.error("Rendering error:", error);
    }

    // Copy buffer to main canvas
    ctx.drawImage(bufferCanvas, 0, 0);
  };

  // Apply a glitch effect to the image
  const applyGlitchEffect = (canvas, amount) => {
    const ctx = canvas.getContext("2d");

    // RGB shift is now controlled separately - using rgbShiftAmount
    if (Math.random() < config.rgbShiftAmount * 0.5) {
      // RGB shift intensity is proportional to rgbShiftAmount
      const rgbShiftX = Math.floor(Math.random() * 10 * config.rgbShiftAmount);
      const rgbShiftY = Math.floor(Math.random() * 10 * config.rgbShiftAmount);

      // Create temporary canvas for RGB shift
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      // Draw with RGB shifts
      tempCtx.drawImage(canvas, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      // Red channel shift
      ctx.fillStyle = "rgba(255,0,0,0.3)";
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(canvas, rgbShiftX, rgbShiftY);

      // Green channel stays centered
      ctx.fillStyle = "rgba(0,255,0,0.3)";
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(canvas, 0, 0);

      // Blue channel shift opposite
      ctx.fillStyle = "rgba(0,0,255,0.3)";
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(canvas, -rgbShiftX, -rgbShiftY);

      ctx.globalCompositeOperation = "source-over";
    }

    // Other glitch effects still use the general glitchAmount
    // Random block corruption
    if (Math.random() < amount * 0.3) {
      const blockSize = Math.floor(Math.random() * 30) + 10;
      const blockX = Math.floor(Math.random() * (canvas.width - blockSize));
      const blockY = Math.floor(Math.random() * (canvas.height - blockSize));
      const sourceX = Math.floor(Math.random() * (canvas.width - blockSize));
      const sourceY = Math.floor(Math.random() * (canvas.height - blockSize));

      // Copy blocks of pixels to create corruption effect
      const blockData = ctx.getImageData(
        sourceX,
        sourceY,
        blockSize,
        blockSize
      );
      ctx.putImageData(blockData, blockX, blockY);
    }

    // Random line corruption
    if (Math.random() < amount * 0.3) {
      const lineY = Math.floor(Math.random() * canvas.height);
      const lineHeight = Math.floor(Math.random() * 5) + 1;
      const lineShift = Math.floor(Math.random() * 100) - 50;

      // Shift a horizontal line of pixels
      const lineData = ctx.getImageData(0, lineY, canvas.width, lineHeight);
      ctx.putImageData(lineData, lineShift, lineY);
    }
  };

  // Apply scanline effect
  const applyScanlines = (ctx, width, height, intensity, pixelSize) => {
    ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;

    for (let y = 0; y < height; y += pixelSize * 2) {
      ctx.fillRect(0, y, width, pixelSize);
    }
  };

  // Apply noise effect
  const applyNoise = (ctx, width, height, intensity) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Only apply noise randomly based on intensity
      if (Math.random() < intensity) {
        const noise = Math.floor(Math.random() * 50) - 25;

        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Handle applying a preset
  const applyPreset = (presetName) => {
    if (presets[presetName]) {
      setConfig((prev) => ({
        ...prev,
        ...presets[presetName],
        useHtml2Canvas: prev.useHtml2Canvas,
        showOriginal: prev.showOriginal,
        debugMode: prev.debugMode,
      }));
    }
  };

  // Handle config changes
  const handleConfigChange = (key, value) => {
    setConfig((prev) => {
      // Parse numerical values
      if (typeof prev[key] === "number") {
        value = parseFloat(value);
      }
      // Parse boolean values
      if (typeof prev[key] === "boolean") {
        value = value === "true" || value === true;
      }
      return { ...prev, [key]: value };
    });
  };

  return (
    <div className="pixelated-viewport-container">
      {/* Original content (hidden but rendered) */}
      <div
        ref={contentRef}
        className="original-content"
        style={{ visibility: config.showOriginal ? "visible" : "hidden" }}
      >
        {children}
      </div>

      {/* Hidden canvas for ghosting effect */}
      <canvas ref={glitchCanvasRef} className="glitch-canvas" />

      {/* Pixelated canvas overlay */}
      <canvas ref={canvasRef} className="pixelated-canvas" />

      {/* Debug panel */}
      {config.debugMode && (
        <div className="debug-panel" ref={debugPanelRef}>
          <h3>Pixelation Debug</h3>

          <div className="debug-presets">
            <div className="debug-control">
              <label>Presets:</label>
              <div className="preset-buttons">
                <button onClick={() => applyPreset("default")}>Default</button>
                <button onClick={() => applyPreset("highContrast")}>
                  High Contrast
                </button>
                <button onClick={() => applyPreset("lowRes")}>Low Res</button>
                <button onClick={() => applyPreset("ascii")}>ASCII</button>
                <button onClick={() => applyPreset("glitchy")}>Glitchy</button>
              </div>
            </div>
          </div>

          <div className="debug-controls">
            <div className="debug-control">
              <label title="Size of each rendered pixel in pixels">
                Pixel Size:
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={config.pixelSize}
                onChange={(e) =>
                  handleConfigChange("pixelSize", e.target.value)
                }
              />
              <span>{config.pixelSize}px</span>
            </div>

            <div className="debug-control">
              <label title="Minimum brightness threshold to render a pixel">
                Brightness Threshold:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.threshold}
                onChange={(e) =>
                  handleConfigChange("threshold", e.target.value)
                }
              />
              <span>{config.threshold}</span>
            </div>

            <div className="debug-control">
              <label title="Minimum opacity threshold to render a pixel">
                Opacity Threshold:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.opacityThreshold}
                onChange={(e) =>
                  handleConfigChange("opacityThreshold", e.target.value)
                }
              />
              <span>{config.opacityThreshold}</span>
            </div>

            <div className="debug-control">
              <label title="How often to re-render the effect (low = less flickering)">
                Refresh Rate:
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={config.refreshRate}
                onChange={(e) =>
                  handleConfigChange("refreshRate", e.target.value)
                }
              />
              <span>{config.refreshRate} fps</span>
            </div>

            <div className="debug-control">
              <label title="How often standard glitch effects occur (blocks, line shifts)">
                Glitch Amount:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.glitchAmount}
                onChange={(e) =>
                  handleConfigChange("glitchAmount", e.target.value)
                }
              />
              <span>{config.glitchAmount}</span>
            </div>

            <div className="debug-control">
              <label title="Controls the extreme RGB color-shifting effect intensity">
                RGB Shift Amount:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.rgbShiftAmount}
                onChange={(e) =>
                  handleConfigChange("rgbShiftAmount", e.target.value)
                }
              />
              <span>{config.rgbShiftAmount}</span>
            </div>

            <div className="debug-control">
              <label title="Intensity of horizontal scanlines">
                Scanline Intensity:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.scanlineIntensity}
                onChange={(e) =>
                  handleConfigChange("scanlineIntensity", e.target.value)
                }
              />
              <span>{config.scanlineIntensity}</span>
            </div>

            <div className="debug-control">
              <label title="Intensity of static noise effect">
                Noise Intensity:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.noiseIntensity}
                onChange={(e) =>
                  handleConfigChange("noiseIntensity", e.target.value)
                }
              />
              <span>{config.noiseIntensity}</span>
            </div>

            <div className="debug-control">
              <label title="Amount of previous frame to blend with current frame">
                Ghosting Amount:
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.ghostingAmount}
                onChange={(e) =>
                  handleConfigChange("ghostingAmount", e.target.value)
                }
              />
              <span>{config.ghostingAmount}</span>
            </div>

            <div className="debug-control">
              <label>Rendering Engine:</label>
              <select
                value={config.useHtml2Canvas.toString()}
                onChange={(e) =>
                  handleConfigChange("useHtml2Canvas", e.target.value)
                }
              >
                <option value="true">html2canvas</option>
                <option value="false">rasterizeHTML</option>
              </select>
            </div>

            <div className="debug-control">
              <label>ASCII Mode:</label>
              <input
                type="checkbox"
                checked={config.useAsciiMode}
                onChange={(e) =>
                  handleConfigChange("useAsciiMode", e.target.checked)
                }
              />
            </div>

            <div className="debug-control">
              <label>Show Original:</label>
              <input
                type="checkbox"
                checked={config.showOriginal}
                onChange={(e) =>
                  handleConfigChange("showOriginal", e.target.checked)
                }
              />
            </div>

            <div className="debug-control">
              <label title="Show pixel grid overlay for debugging">
                Show Debug Grid:
              </label>
              <input
                type="checkbox"
                checked={config.showDebugGrid}
                onChange={(e) =>
                  handleConfigChange("showDebugGrid", e.target.checked)
                }
              />
            </div>
          </div>

          <div className="debug-stats">
            <div>Render Time: {stats.lastRenderTime}ms</div>
            <div>FPS: {stats.fps}</div>
            <div>
              Pixels: {stats.renderedPixels}/{stats.totalPixels} (
              {((stats.renderedPixels / stats.totalPixels) * 100).toFixed(1)}%)
            </div>
            {stats.error && (
              <div className="error-message">Error: {stats.error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PixelatedViewport;
