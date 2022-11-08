import { init_vertex_data } from './vertex-common';
import { get_program_uniforms } from './uniforms-common';
import { createProgramFromSources } from './utils';
import { textureData } from './texture-common';
import { program_loop_fn } from './program-loop';

export const init_program = _init_program;
export const init_program_fbos = _init_program_fbos;
export const get_program_data = _get_program_data;

function _init_program(gl, opts) {
    let p_o = {};
    try {
        // setup GLSL program
        let shaders = [opts.vertex_shader, opts.fragment_shader].map(sh => _decorate_source(sh));
        if (opts.build_program) {
            p_o = opts.build_program(gl, shaders);
        }
        else {
            let program = createProgramFromSources(
                gl,
                shaders
            );
            p_o = _init_program_fbos(
                Object.assign({ program }, _get_program_data(gl, program, shaders)),
                gl,
                opts
            );
        }
    }
    catch (e) {
        console.warn("PROGRAM ERROR FOR CURRENT PROGRAM");
        console.warn(e);
    }

    return p_o;
}

function _get_program_data(gl, program, shaders) {
    let vertex_data = init_vertex_data(gl, program),
        uniforms = get_program_uniforms(gl, program);

    return {
        vertex_data,
        uniforms,
        shaders,
        start_time: performance.now(),
        exec_loop: program_loop_fn
    };
}

function _init_program_fbos(current_program, gl, opts) {
    let canvas = opts.canvas,
        fbo_n = opts.framebuffers_n || 1,
        fbo_offset = opts.framebuffers_offset || 1;

    current_program.has_framebuffer = opts.has_framebuffer;
    if (!opts.dont_create_base_texture) {
        current_program.base_texture = current_program.base_texture || textureData.init_texture(gl, 0);
    }
    current_program.fbo_data = textureData.create_fbo_textures(current_program, gl, fbo_n, fbo_offset, canvas.clientWidth, canvas.clientHeight);

    return current_program;
}

function _decorate_source(source) {
    return eval("`" + source + "`");
}