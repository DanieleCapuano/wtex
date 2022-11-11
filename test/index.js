import "../style/main.scss";

import * as vertex_shader from '../shaders/vertex_shader.glsl';
import * as fragment_shader from '../shaders/fragment_sh.glsl';

import { texturize_quad } from '../src/index';

window.addEventListener('load', () => {
    let updating_img = false,
        last_now = 0;
    const _update_img = (imgElem, path) => {
        imgElem.decoding = 'sync';
        imgElem.loading = 'eager';
        imgElem.src = path;

        const _onload = () => {
            imgElem.removeEventListener('load', _onload);
            if (imgElem.complete) {
                window.dispatchEvent(new CustomEvent('image-update'));
                updating_img = false;
            }
        }
        imgElem.addEventListener('load', _onload);
    };

    texturize_quad({
        vertex_shader,
        fragment_shader,
        config_path: "/config/config.json",
        WIN_LOADED: true,
        frame_update: (current_prog, gl, opts) => {
            const { now } = opts;
            const { paths } = opts.input;
            const int_now = parseInt(now);
            if (!updating_img && int_now !== last_now && int_now % 2 === 0) {
                last_now = int_now;
                updating_img = true;
                opts.input.current_img_index = (opts.input.current_img_index + 1) % paths.length;
                _update_img(opts.input.elem, paths[opts.input.current_img_index]);
            }
        }
    }).then(() => {
        console.info("SYSTEM RUNNING");
    });
})