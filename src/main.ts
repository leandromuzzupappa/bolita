import "./style.css";

import {
  loadTexture,
  createShader,
  /* enableAttribute, */
  loadImage,
} from "./utils.js";

import {
  vertexData,
  uvData,
  vertexShaderData,
  fragmentShaderData,
} from "./webgl";

const sequenceLength = 179;
const sequenceImages = Object.values(
  import.meta.glob("./assets/images/*.{png,jpg,jpeg,PNG,JPEG}", {
    eager: true,
    as: "url",
  })
).sort((a, b) => {
  const getNumber = (str: string) => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  return getNumber(a) - getNumber(b);
});

console.log(sequenceImages);

async function init() {
  const canvas = document.querySelector<HTMLCanvasElement>(".pepitos");
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext("webgl");
  if (!gl) {
    throw new Error("WebGL not supported");
  }

  const planeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, planeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);

  const texture = gl.createTexture();
  const image = await loadImage(sequenceImages[0]);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // flip the image's y axis

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderData);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderData
  );

  const program = gl.createProgram();
  if (!program) return;
  if (vertexShader) gl.attachShader(program, vertexShader);
  if (fragmentShader) gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  // Create attribures
  // prettier-ignore
  /* const positionLocation = enableAttribute(gl, program, "position", planeBuffer, 3, gl.FLOAT, false, 0, 0); */

  // prettier-ignore
  /* const uvLocation = enableAttribute(gl, program, "uv", uvBuffer, 2, gl.FLOAT, false, 0, 0); */

  // use the program
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);

  const uniformLocations = {
    textureID: gl.getUniformLocation(program, `textureID`),
  };
  gl.uniform1i(uniformLocations.textureID, 0);

  function animate() {
    requestAnimationFrame(animate);

    if (gl) gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  });

  window.addEventListener("scroll", () => {
    // get scroll percentege rounded from 1 to 179
    const scrollPercentage = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        (sequenceLength - 1) +
        1
    );

    loadTexture(gl, sequenceImages[scrollPercentage]);
  });
}

init();
