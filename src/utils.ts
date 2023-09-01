export function repeat(n: number, pattern: number[]): number[] {
  return [...Array(n)].reduce((sum) => sum.concat(pattern), []);
}

export function createBuffer(
  gl: WebGLRenderingContext,
  target: GLenum,
  data: ArrayBufferView | null,
  usage: GLenum
): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);
  return buffer;
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = src;
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image at "${src}"`));
  });
}

export function loadTexture(
  gl: WebGLRenderingContext,
  image: HTMLImageElement
): WebGLTexture | null {
  console.log(image);

  const texture = gl.createTexture();

  if (!image.complete) {
    const imageElement = new Image();
    imageElement.src = image.src;

    imageElement.onload = () => {
      setImageTexture(gl, imageElement, texture);
    };

    return texture;
  }

  function setImageTexture(
    gl: WebGLRenderingContext,
    image: HTMLImageElement,
    texture: WebGLTexture | null
  ) {
    // Src: MDN
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  }

  setImageTexture(gl, image, texture);

  return texture;
}

function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) === 0;
}

export function createShader(
  gl: WebGLRenderingContext,
  type: GLenum,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  // If it didn't compile, get the error
  // and delete the shader
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

export function enableAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  buffer: WebGLBuffer | null,
  size: number = 3,
  type: GLenum = gl.FLOAT,
  normalized: boolean = false,
  stride: number = 0,
  offset: number = 0
): number {
  const attribute = gl.getAttribLocation(program, name);
  gl.enableVertexAttribArray(attribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // For some reason, this is neede (?)
  gl.vertexAttribPointer(attribute, size, type, normalized, stride, offset);

  return attribute;
}
