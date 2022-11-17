import { get_config, parse_config } from "./config";
import { init_program } from "./program-def";
import { render_loop } from "./program-loop";
import { textureData } from "./texture-common";
import * as _program_def from "./program-def";
import * as _webgl_utils from "./utils";

export const texturize_quad = _texturize_quad;
export default texturize_quad;

export const texture_data = textureData;
export const program_def = _program_def;
export const webgl_utils = _webgl_utils;


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
            gl = canvas.getContext("webgl2", {
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