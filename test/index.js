import "../style/main.scss";

import * as vertex_shader from '../shaders/vertex_shader.glsl';
import * as fragment_shader from '../shaders/fragment_sh.glsl';

import { texturize } from '../src/index';

window.addEventListener('load', () => {
    texturize({
        vertex_shader,
        fragment_shader,
        config_path: "/config/config.json",
        WIN_LOADED: true
    }).then(() => {
        console.info("SYSTEM RUNNING");
    });
})