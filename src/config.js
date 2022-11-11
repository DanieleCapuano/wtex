import { parse } from "postcss";

export const get_config = _get_config;
export const parse_config = _parse_config;

function _get_config(config_path) {
    return new Promise(res => {
        fetch(config_path)
            .then(o => o.json())
            .then(json_config => res(json_config));
    })
}

function _parse_config(config) {
    const { input, output } = config;
    return Promise.all([
        _parse_elem(input),
        _parse_elem(output)
    ]).then((parsed) => {
        config.input = parsed[0];
        config.output = parsed[1];

        return config;
    });
}

function _parse_elem(obj) {
    return new Promise((res) => {
        const { domQuery, paths } = (obj || {});
        if (domQuery) {
            obj.elem = document.querySelector(domQuery);
            return res(obj);
        }
        else if (paths) {
            obj.elem = new Image();
            obj.current_img_index = 0;
            obj.elem.src = paths[obj.current_img_index];
            obj.elem.addEventListener('load', res.bind(null, obj));
        }
        else {
            res(obj);
        }
    });
}