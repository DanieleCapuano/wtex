import { draw_shapes, texture_data, resizeCanvasToDisplaySize } from 'wbase';

export const render_loop = _render;
export const stop_loop = _stop_loop;
export const program_loop_fn = _draw_fbos_textures.bind(null, _draw_main_texture);

let image_drawn_in_texture = false;
let _stop_running = false,
    raf_id = null;  //requestAnimationFrame ID

function _stop_loop(opts) {
    const { gl } = opts;
    if (!gl) return;

    _stop_running = true;
    raf_id && cancelAnimationFrame(raf_id);

    gl.useProgram(null);
    gl.bindVertexArray(null);
}


function _render(running_program, opts) {
    const { gl, canvas } = opts;
    const { uniforms, program, vertex_data } = running_program;

    _stop_running = false;
    image_drawn_in_texture = false;

    resizeCanvasToDisplaySize(canvas);

    //TODO fix the resize listener and behavior which follows
    //
    // const _update_img = () => {
    //     resizeCanvasToDisplaySize(canvas);
    //     image_drawn_in_texture = false;
    // };
    // window.addEventListener('resize', _update_img);
    // window.addEventListener('image-update', _update_img);
    if (opts.input.isVideo && ('requestVideoFrameCallback' in HTMLVideoElement.prototype)) {
        let inputEl = opts.inputElement || document.getElementById(opts.inputElementId)
        const registerTextureUpdate = (now, metadata) => {
            // Do something with the frame.
            image_drawn_in_texture = false;

            if (!_stop_running) {
                inputEl.requestVideoFrameCallback(registerTextureUpdate);
            }
        };
        inputEl.requestVideoFrameCallback(registerTextureUpdate);
    }

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vertex_data.vao);

    // turn off depth and cull tests because some programs don't use them
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    if (uniforms.u_image) {
        uniforms.u_image.set(gl, program, '1i', 0);
    }

    return draw_loop();


    ///////////////////////////////////////
    ///////////////////////////////////////
    // DRAW

    function draw_loop() {
        if (_stop_running || gl.isContextLost()) {
            _stop_running = true;
            raf_id && cancelAnimationFrame(raf_id);
            return;
        }

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        if (uniforms.u_resolution) {
            uniforms.u_resolution.set(gl, program, '2f', [gl.canvas.width, gl.canvas.height]);
        }
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        (running_program.exec_loop || program_loop_fn)(running_program, gl, opts);

        raf_id = requestAnimationFrame(draw_loop);
    }
}

function _draw_fbos_textures(next_fn, current_program, gl, opts) {
    const { base_texture, uniforms } = current_program,
        { framebuffers_offset, framebuffers_n, frame_update } = opts,
        inputEl = opts.inputElement || document.getElementById(opts.inputElementId);

    let texture_to_draw,
        texture_unit;

    opts.now = (performance.now() - current_program.start_time) / 1000.;

    if (!image_drawn_in_texture && (inputEl || {}).complete) {
        texture_to_draw = (opts.textures || [])[opts.base_texture_i || 0] || base_texture;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        if (uniforms.u_resolution) {
            uniforms.u_resolution.set(gl, current_program, '2f', [gl.canvas.width, gl.canvas.height]);
        }

        if (!opts.textures && opts.base_texture_i === undefined) {
            let texture_unit_offset = 0;
            texture_data.draw_into_texture(
                gl,
                texture_to_draw, texture_unit_offset,
                inputEl, gl.canvas.width, gl.canvas.height
            );
        }
        image_drawn_in_texture = true;
        opts.input.should_update_texture = false;
    }

    if (frame_update) {
        frame_update(current_program, gl, opts);
    }

    _update_uniforms_for_fbo(current_program, gl, opts);

    texture_to_draw = (opts.textures || [])[opts.base_texture_i || 0] || base_texture;
    texture_unit = opts.base_active_texture || gl.TEXTURE0;
    gl.activeTexture(texture_unit);
    gl.bindTexture(gl.TEXTURE_2D, texture_to_draw);

    // loop through each effect we want to apply.
    for (var ii = framebuffers_offset; ii < framebuffers_n + framebuffers_offset; ++ii) {
        // Setup to draw into one of the framebuffers.
        texture_data.set_framebuffer(
            gl,
            texture_data.get_fbo(current_program, ii),
            gl.canvas.width, gl.canvas.height
        );

        draw_shapes(gl);

        // for the next draw, use as input texture (associated to gl.TEXTURE0) the texture we just rendered to.
        gl.bindTexture(gl.TEXTURE_2D, texture_data.get_fbo_texture(current_program, ii));
    }

    next_fn(current_program, gl);
}

function _draw_main_texture(current_program, gl) {
    const { uniforms, program } = current_program;

    uniforms.u_flip_y && uniforms.u_flip_y.set(gl, program, '1f', -1);
    texture_data.set_framebuffer(gl, null, gl.canvas.width, gl.canvas.height);

    draw_shapes(gl);
}

function _update_uniforms_for_fbo(current_program, gl, opts) {
    const { uniforms, program } = current_program;
    const { now } = opts;

    // don't y flip images while drawing to the textures
    uniforms.u_flip_y && uniforms.u_flip_y.set(gl, program, '1f', 1);
    if (uniforms.u_time) {
        uniforms.u_time.set(gl, program, '1f', now);
    }
}