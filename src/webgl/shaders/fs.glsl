precision mediump float;

uniform sampler2D textureID;
varying vec2 vUv;

void main(){
  
  //sampler2d = dsatexture2D(textureID,vUv);
  
  gl_FragColor=texture2D(textureID,vUv);
  //vec3 color=vec3(1.,.3,.0);
  
  //color.r=.4*color.g+.3;
  
  //gl_FragColor=vec4(color,1.);
  //gl_FragColor=vec4(1.,0.,0.,1.);
}

/*

vec2 (x, y)
vec3 (x, y, z)
vec4 (x, y, z, a/w)

vec3 (r, g, b)

vec3 color = vec3(1., .0, .0)

*/