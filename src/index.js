import { get_config, parse_config } from "./config";
import { init_program } from "wbase";
import { render_loop, stop_loop } from "./program-loop";

const texturize_quad = _texturize_quad;
const texture_stop = _texture_stop;

export {
    texturize_quad, texture_stop
};
export default {
    texturize_quad, texture_stop
};


let running_program = {};
let configRef = {};

function _texturize_quad(input_opts) {
    const { vertex_shader, fragment_shader, config_path, WIN_LOADED } = input_opts;
    return new Promise((res) => {
        const _onloaded = () => {
            get_config(config_path || "/config/config.json").then(json_conf => {
                _start(Object.assign(input_opts, json_conf, {
                    vertex_shader,
                    fragment_shader
                })).then(res);
            });
        };
        if (WIN_LOADED) _onloaded();
        window.addEventListener('load', _onloaded);
    });
}

function _start(config) {
    return parse_config(config).then((parsed_obj) => {
        const { input, output } = parsed_obj;
        let canvas = output.elem,
            inputElement = input.elem,
            gl = config.gl || canvas.getContext("webgl2", {
                desynchronized: true,
                powerPreference: 'high-performance'
            });

        if (!gl) {
            return;
        }

        config = Object.assign(config, parsed_obj, {
            gl,
            canvas,
            inputElement
        });
        configRef = config;
        
        running_program = init_program(gl, config);
        config.running_program = running_program;

        return render_loop(running_program, config);
    });
}

function _texture_stop() {
    let config = configRef;
    stop_loop(config);

    if (config.running_program) {
        //to be put into wbase library?
        const { program, vertex_data, fbo_data } = config.running_program;
        const { pos_buffer, coord_buffer } = vertex_data;
        (config.textures || []).forEach(t => gl.deleteTexture(t));
        [pos_buffer, coord_buffer].forEach(b => gl.deleteBuffer(b));
        (fbo_data || []).forEach(fbod => {
            gl.deleteTexture(fbod.texture);
            gl.deleteFramebuffer(fbod.fbo);
        });
        gl.deleteProgram(program);
        
        config.running_program = null;
    }
}