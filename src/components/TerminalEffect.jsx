import { useEffect, useRef, useState } from "react";

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uPixelSize;
  uniform float uBrightness;
  uniform float uContrast;
  varying vec2 vUv;

  void main() {
    vec2 pixelSize = vec2(uPixelSize / uResolution.x, uPixelSize * 2.0 / uResolution.y);
    vec2 cell = floor(vUv / pixelSize);
    vec2 cellUv = cell * pixelSize;
    
    float brightness = 0.0;
    for(float y = 0.0; y < 2.0; y++) {
      for(float x = 0.0; x < 1.0; x++) {
        vec2 sampleUv = cellUv + vec2(x * pixelSize.x, y * pixelSize.y);
        vec4 color = texture2D(uTexture, sampleUv);
        brightness += (color.r + color.g + color.b) / 3.0;
      }
    }
    brightness /= 2.0;
    
    brightness = (brightness - 0.5) * uContrast + 0.5 + uBrightness;
    float pixel = step(0.5, brightness);
    gl_FragColor = vec4(vec3(pixel), 1.0);
  }
`;

const TerminalEffect = ({ children }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [debug, setDebug] = useState(false);
  const [config, setConfig] = useState({
    pixelSize: 4,
    brightness: 0,
    contrast: 1.2,
  });

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "`") {
        setDebug((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Create shader program
    const program = createShaderProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Set up buffers
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Set up attributes and uniforms
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      uTexture: gl.getUniformLocation(program, "uTexture"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uPixelSize: gl.getUniformLocation(program, "uPixelSize"),
      uBrightness: gl.getUniformLocation(program, "uBrightness"),
      uContrast: gl.getUniformLocation(program, "uContrast"),
    };

    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const render = () => {
      // Capture page content
      const html2canvas = window.html2canvas;
      if (!html2canvas) return;

      html2canvas(container, {
        backgroundColor: null,
        logging: false,
        useCORS: true,
      }).then((contentCanvas) => {
        // Update canvas size
        canvas.width = contentCanvas.width;
        canvas.height = contentCanvas.height;
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Update texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          contentCanvas
        );

        // Set uniforms
        gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.uPixelSize, config.pixelSize);
        gl.uniform1f(uniforms.uBrightness, config.brightness);
        gl.uniform1f(uniforms.uContrast, config.contrast);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      });

      requestAnimationFrame(render);
    };

    render();

    return () => {
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
    };
  }, [config]);

  return (
    <>
      <div ref={containerRef} style={{ position: "absolute", left: "-9999px" }}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      {debug && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.8)",
            padding: 20,
            borderRadius: 5,
            color: "white",
            zIndex: 9999,
          }}
        >
          <h3>Debug Panel</h3>
          <div>
            <label>Pixel Size: </label>
            <input
              type="range"
              min="1"
              max="10"
              value={config.pixelSize}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  pixelSize: Number(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label>Brightness: </label>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.1"
              value={config.brightness}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  brightness: Number(e.target.value),
                }))
              }
            />
          </div>
          <div>
            <label>Contrast: </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={config.contrast}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  contrast: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

function createShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

export default TerminalEffect;
