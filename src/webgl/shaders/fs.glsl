precision mediump float;

uniform sampler2D textureID;
varying vec2 vUv;

void main(){
  gl_FragColor=texture2D(textureID,vUv);
}