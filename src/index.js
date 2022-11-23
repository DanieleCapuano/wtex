import { get_config, parse_config } from "./config";
import { init_program } from "wbase";
import { render_loop, stop_loop } from "./program-loop";

const texturize_quad = _texturize_quad;

export {
    texturize_quad, stop_loop
};
export default {
    texturize_quad, stop_loop
};


let running_program = {};

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
        running_program = init_program(gl, config);

        return render_loop(running_program, config);
    });
}