# WTEX: a (VERY) simple texturing test system using webgl2

This library provides a very simple texturing system for testing image processing, convolution-like shaders
using a multi-framebuffers approach.

```
npm run build
```

or

```
yarn build
```

to bundle your application.


## To watch

```
npm run watch
```


## To test (see the test/index.js folder for a working example)

I assume the "http-server" simple node server is used here

```
npm run build
cd dist
http-server . -o
```

## API and usage
The library builds a single file called wtex.js which exposes an object called wtex.
The wtex.texturing function takes as input an options object and draws a fullscreen canvas with your texture.
The input image could be an image or a video. A DOM element is built using the input config you provide and it's used to feed the main texture.

### Input config options
```javascript
{
    vertex_shader: "<your vertex shader code as text>",
    fragment_shader: "<your fragment shader code as text>",
    config_path: "/config/config.json", //the path where the config json file should be downloaded, defaults to "/config/config.json"
    WIN_LOADED: true    //a boolean which says if a window.addEventListener('load') should be used before start or not
}
```

### Config JSON object options
```javascript
{
    "input": {
        "imagePath": "/img/tree.jpg",    //the path where the image should be retrieved
        "domQuery": "#canvas"           //OR as an alternative, the dom query to select a dom element to read from
    },
    "output": {
        "domQuery": "#canvas"           //the dom query to select a dom element to write to
    },
    "dont_create_base_texture": false,  //prevent the use of a base texture (because your test program will provide it itself)
    "has_framebuffer": true,            //use framebuffer objects
    "framebuffers_n": 1,                //number of framebuffer objects to use as a chain
    "framebuffers_offset": 1            //first fbo will have an active index of "n"
}
```