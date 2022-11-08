import { draw_shapes } from './utils';
import { textureData } from './texture-common';
import { resizeCanvasToDisplaySize } from "./utils";

export const render_loop = _render;
export const program_loop_fn = _draw_fbos_textures.bind(null, _draw_main_texture);


function _render(running_program, opts) {
    const { gl } = opts;

    return draw_loop();


    ///////////////////////////////////////
    ///////////////////////////////////////
    // DRAW

    function draw_loop() {
        requestAnimationFrame(draw_loop);

        resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // turn off depth and cull tests because some programs don't use them
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        running_program.exec_loop(running_program, gl, opts);
    }
}

function _draw_fbos_textures(next_fn, current_program, gl, opts) {
    const { program, base_texture } = current_program,
        { framebuffers_offset, framebuffers_n } = opts,
        inputEl = opts.inputElement || document.getElementById(opts.inputElementId),
        canvas = opts.canvas || document.getElementById(opts.outputElementId) || gl.canvas;

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(current_program.vertex_data.vao);

    // start with the original image on unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, base_texture);
    textureData.draw_into_texture(gl, inputEl);
    
    _update_uniforms_for_fbo(current_program, gl);

    // loop through each effect we want to apply.
    for (var ii = framebuffers_offset; ii < framebuffers_n + framebuffers_offset; ++ii) {
        // Setup to draw into one of the framebuffers.
        textureData.set_framebuffer(
            gl, current_program, 
            textureData.get_fbo(current_program, ii), 
            canvas.clientWidth, canvas.clientHeight
        );

        draw_shapes(gl);

        // for the next draw, use as input texture (associated to gl.TEXTURE0) the texture we just rendered to.
        gl.bindTexture(gl.TEXTURE_2D, textureData.get_fbo_texture(current_program, ii));
    }

    next_fn(current_program, gl);
}

function _draw_main_texture(current_program, gl) {
    const { uniforms, program } = current_program;

    uniforms.u_flip_y && uniforms.u_flip_y.set(gl, program, '1f', -1);
    textureData.set_framebuffer(gl, current_program, null, gl.canvas.width, gl.canvas.height);

    draw_shapes(gl);
}

function _update_uniforms_for_fbo(current_program, gl) {
    const { uniforms, program } = current_program

    // don't y flip images while drawing to the textures
    uniforms.u_flip_y && uniforms.u_flip_y.set(gl, program, '1f', 1);

    // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader
    uniforms.u_resolution.set(gl, program, '2f', [gl.canvas.width, gl.canvas.height]);

    if (uniforms.u_time) {
        var u_time = (performance.now() - current_program.start_time) / 1000.;
        uniforms.u_time.set(gl, program, '1f', u_time);
    }

    // Tell the shader to get the texture from texture unit 0
    uniforms.u_image.set(gl, program, '1i', 0);
}