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
  url: string
): WebGLTexture | null {
  console.log(url);

  const texture = gl.createTexture();
  const image = new Image();

  image.onload = () => {
    // Src: MDN
    // Bind the texture to the texture unit
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Specify a 2D texture image
    // texImage2D(target, level, internalformat, format, type, pixels)
    // target - the target texture (TEXTURE_2D, TEXTURE_CUBE_MAP_POSITIVE_X, etc.)
    // level - the level-of-detail number. Level 0 is the base image level. Level n is the nth mipmap reduction image
    // internalformat - the number of color components in the texture
    // format - the format of the texel data
    // type - the data type of the texel data
    // pixels - the texel data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
    // WebGL1 has different requirements for power of 2 images
    // vs. non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };

  image.src = url;
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
