#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

// our texture
uniform sampler2D u_image;
uniform float u_time;
uniform float u_flip_y;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  vec4 tex = texture(u_image, v_texCoord);
  if (u_flip_y == 1.) {
    tex.r = tex.r * 1.5 * abs(sin(u_time));
  }
  outColor = tex;
}