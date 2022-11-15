#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

// our texture
uniform sampler2D u_image;
uniform float u_time;
uniform float u_flip_y;
uniform vec2 u_resolution;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

// we need to declare an output for the fragment shader
out vec4 outColor;


void main() {
  vec3 col = vec3(0.0);
  float offset = 1.0 / u_resolution.x;

  vec2 offsets[9] = vec2[9](
        vec2(-offset,  offset), // top-left
        vec2( 0.0f,    offset), // top-center
        vec2( offset,  offset), // top-right
        vec2(-offset,  0.0f),   // center-left
        vec2( 0.0f,    0.0f),   // center-center
        vec2( offset,  0.0f),   // center-right
        vec2(-offset, -offset), // bottom-left
        vec2( 0.0f,   -offset), // bottom-center
        vec2( offset, -offset)  // bottom-right    
    );;  

  float div = 16.;
  float kernel[9] = float[9](
    1.0 / div, 2.0 / div, 1.0 / div,
    2.0 / div, 4.0 / div, 2.0 / div,
    1.0 / div, 2.0 / div, 1.0 / div  
);

  if (u_flip_y == 1.) {
    vec3 sampleTex[9];
    for(int i = 0; i < 9; i++) {
        sampleTex[i] = vec3(texture(u_image, v_texCoord + offsets[i]));
    }
    for(int i = 0; i < 9; i++)
        col += sampleTex[i] * kernel[i];
  }
  else {
    col = texture(u_image, v_texCoord).rgb;
  }
  outColor = vec4(col, 1.);
}