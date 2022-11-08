import { get_program_elements } from "./utils";

export function get_program_uniforms(gl, program) {
    let def_elems = get_program_elements(gl, { program: program });
    return Object.keys(def_elems.uniforms).reduce((u_data, res_name) => {
        u_data[res_name] = {
            get: () => def_elems.uniforms[res_name].loc,
            set: _set_uniform.bind(null, def_elems.uniforms[res_name]),
        };
        return u_data;
    }, {});

    function _set_uniform(uniform_obj, gl, program, type, data) {
        gl['uniform' + type].apply(gl, [].concat(
            uniform_obj.loc,
            data
        ));
    }

}