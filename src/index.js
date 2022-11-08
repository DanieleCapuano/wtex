import { get_config, parse_config } from "./config";
import { init_program } from "./program-def";
import { render_loop } from "./program-loop";

export const texturize = _texturize;
export default texturize;


let running_program = {};

function _texturize(input_opts) {
    const { vertex_shader, fragment_shader, config_path, WIN_LOADED } = input_opts;
    return new Promise((res) => {
        const _onloaded = () => {
            get_config(config_path || "/config/config.json").then(json_conf => {
                _start(Object.assign(json_conf, {
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
    return parse_config(config).then((parsed_objs) => {
        let canvas = parsed_objs.find(o => o.type === 'output').elem,
            inputElement = parsed_objs.find(o => o.type === 'input').elem,
            gl = canvas.getContext("webgl2", {
                desynchronized: true,
                powerPreference: 'high-performance'
            });

        if (!gl) {
            return;
        }

        config = Object.assign({}, config, {
            gl,
            canvas,
            inputElement
        });
        running_program = init_program(gl, config);

        return render_loop(running_program, config);
    });
}