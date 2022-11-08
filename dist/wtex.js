/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var wtex;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"get_config\": () => (/* binding */ get_config),\n/* harmony export */   \"parse_config\": () => (/* binding */ parse_config)\n/* harmony export */ });\nvar get_config = _get_config;\nvar parse_config = _parse_config;\nfunction _get_config(config_path) {\n  return new Promise(function (res) {\n    fetch(config_path).then(function (o) {\n      return o.json();\n    }).then(function (json_config) {\n      return res(json_config);\n    });\n  });\n}\nfunction _parse_config(config) {\n  var input = config.input,\n    output = config.output;\n  return Promise.all([{\n    conf: input,\n    type: 'input'\n  }, {\n    conf: output,\n    type: 'output'\n  }].map(function (obj) {\n    return new Promise(function (res) {\n      var _ref = obj.conf || {},\n        domQuery = _ref.domQuery,\n        imagePath = _ref.imagePath;\n      if (domQuery) {\n        obj.elem = document.querySelector(domQuery);\n        return res(obj);\n      } else if (imagePath) {\n        obj.elem = new Image();\n        obj.elem.src = imagePath;\n        obj.elem.addEventListener('load', res.bind(null, obj));\n      } else {\n        res(obj);\n      }\n    });\n  }));\n}\n\n//# sourceURL=webpack://wtex/./src/config.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"texturize\": () => (/* binding */ texturize)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.js\");\n/* harmony import */ var _program_def__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./program-def */ \"./src/program-def.js\");\n/* harmony import */ var _program_loop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./program-loop */ \"./src/program-loop.js\");\n\n\n\nvar texturize = _texturize;\nvar running_program = {};\nfunction _texturize(input_opts) {\n  var vertex_shader = input_opts.vertex_shader,\n    fragment_shader = input_opts.fragment_shader,\n    config_path = input_opts.config_path,\n    WIN_LOADED = input_opts.WIN_LOADED;\n  return new Promise(function (res) {\n    var _onloaded = function _onloaded() {\n      (0,_config__WEBPACK_IMPORTED_MODULE_0__.get_config)(config_path || \"/config/config.json\").then(function (json_conf) {\n        _start(Object.assign(json_conf, {\n          vertex_shader: vertex_shader,\n          fragment_shader: fragment_shader\n        })).then(res);\n      });\n    };\n    if (WIN_LOADED) _onloaded();\n    window.addEventListener('load', _onloaded);\n  });\n}\nfunction _start(config) {\n  return (0,_config__WEBPACK_IMPORTED_MODULE_0__.parse_config)(config).then(function (parsed_objs) {\n    var canvas = parsed_objs.find(function (o) {\n        return o.type === 'output';\n      }).elem,\n      inputElement = parsed_objs.find(function (o) {\n        return o.type === 'input';\n      }).elem,\n      gl = canvas.getContext(\"webgl2\", {\n        desynchronized: true,\n        powerPreference: 'high-performance'\n      });\n    if (!gl) {\n      return;\n    }\n    config = Object.assign({}, config, {\n      gl: gl,\n      canvas: canvas,\n      inputElement: inputElement\n    });\n    running_program = (0,_program_def__WEBPACK_IMPORTED_MODULE_1__.init_program)(gl, config);\n    return (0,_program_loop__WEBPACK_IMPORTED_MODULE_2__.render_loop)(running_program, config);\n  });\n}\n\n//# sourceURL=webpack://wtex/./src/index.js?");

/***/ }),

/***/ "./src/program-def.js":
/*!****************************!*\
  !*** ./src/program-def.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"get_program_data\": () => (/* binding */ get_program_data),\n/* harmony export */   \"init_program\": () => (/* binding */ init_program),\n/* harmony export */   \"init_program_fbos\": () => (/* binding */ init_program_fbos)\n/* harmony export */ });\n/* harmony import */ var _vertex_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vertex-common */ \"./src/vertex-common.js\");\n/* harmony import */ var _uniforms_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uniforms-common */ \"./src/uniforms-common.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n/* harmony import */ var _texture_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./texture-common */ \"./src/texture-common.js\");\n/* harmony import */ var _program_loop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./program-loop */ \"./src/program-loop.js\");\n\n\n\n\n\nvar init_program = _init_program;\nvar init_program_fbos = _init_program_fbos;\nvar get_program_data = _get_program_data;\nfunction _init_program(gl, opts) {\n  var p_o = {};\n  try {\n    // setup GLSL program\n    var shaders = [opts.vertex_shader, opts.fragment_shader].map(function (sh) {\n      return _decorate_source(sh);\n    });\n    if (opts.build_program) {\n      p_o = opts.build_program(gl, shaders);\n    } else {\n      var program = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createProgramFromSources)(gl, shaders);\n      p_o = _init_program_fbos(Object.assign({\n        program: program\n      }, _get_program_data(gl, program, shaders)), gl, opts);\n    }\n  } catch (e) {\n    console.warn(\"PROGRAM ERROR FOR CURRENT PROGRAM\");\n    console.warn(e);\n  }\n  return p_o;\n}\nfunction _get_program_data(gl, program, shaders) {\n  var vertex_data = (0,_vertex_common__WEBPACK_IMPORTED_MODULE_0__.init_vertex_data)(gl, program),\n    uniforms = (0,_uniforms_common__WEBPACK_IMPORTED_MODULE_1__.get_program_uniforms)(gl, program);\n  return {\n    vertex_data: vertex_data,\n    uniforms: uniforms,\n    shaders: shaders,\n    start_time: performance.now(),\n    exec_loop: _program_loop__WEBPACK_IMPORTED_MODULE_4__.program_loop_fn\n  };\n}\nfunction _init_program_fbos(current_program, gl, opts) {\n  var canvas = opts.canvas,\n    fbo_n = opts.framebuffers_n || 1,\n    fbo_offset = opts.framebuffers_offset || 1;\n  current_program.has_framebuffer = opts.has_framebuffer;\n  if (!opts.dont_create_base_texture) {\n    current_program.base_texture = current_program.base_texture || _texture_common__WEBPACK_IMPORTED_MODULE_3__.textureData.init_texture(gl, 0);\n  }\n  current_program.fbo_data = _texture_common__WEBPACK_IMPORTED_MODULE_3__.textureData.create_fbo_textures(current_program, gl, fbo_n, fbo_offset, canvas.clientWidth, canvas.clientHeight);\n  return current_program;\n}\nfunction _decorate_source(source) {\n  return eval(\"`\" + source + \"`\");\n}\n\n//# sourceURL=webpack://wtex/./src/program-def.js?");

/***/ }),

/***/ "./src/program-loop.js":
/*!*****************************!*\
  !*** ./src/program-loop.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"program_loop_fn\": () => (/* binding */ program_loop_fn),\n/* harmony export */   \"render_loop\": () => (/* binding */ render_loop)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n/* harmony import */ var _texture_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./texture-common */ \"./src/texture-common.js\");\n\n\n\nvar render_loop = _render;\nvar program_loop_fn = _draw_fbos_textures.bind(null, _draw_main_texture);\nfunction _render(running_program, opts) {\n  var gl = opts.gl;\n  return draw_loop();\n\n  ///////////////////////////////////////\n  ///////////////////////////////////////\n  // DRAW\n\n  function draw_loop() {\n    requestAnimationFrame(draw_loop);\n    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.resizeCanvasToDisplaySize)(gl.canvas);\n\n    // Tell WebGL how to convert from clip space to pixels\n    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);\n    // Clear the canvas\n    gl.clearColor(0, 0, 0, 0);\n    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);\n\n    // turn off depth and cull tests because some programs don't use them\n    gl.disable(gl.DEPTH_TEST);\n    gl.disable(gl.CULL_FACE);\n    running_program.exec_loop(running_program, gl, opts);\n  }\n}\nfunction _draw_fbos_textures(next_fn, current_program, gl, opts) {\n  var program = current_program.program,\n    base_texture = current_program.base_texture,\n    framebuffers_offset = opts.framebuffers_offset,\n    framebuffers_n = opts.framebuffers_n,\n    inputEl = opts.inputElement || document.getElementById(opts.inputElementId),\n    canvas = opts.canvas || document.getElementById(opts.outputElementId) || gl.canvas;\n\n  // Tell it to use our program (pair of shaders)\n  gl.useProgram(program);\n\n  // Bind the attribute/buffer set we want.\n  gl.bindVertexArray(current_program.vertex_data.vao);\n\n  // start with the original image on unit 0\n  gl.activeTexture(gl.TEXTURE0);\n  gl.bindTexture(gl.TEXTURE_2D, base_texture);\n  _texture_common__WEBPACK_IMPORTED_MODULE_1__.textureData.draw_into_texture(gl, inputEl);\n  _update_uniforms_for_fbo(current_program, gl);\n\n  // loop through each effect we want to apply.\n  for (var ii = framebuffers_offset; ii < framebuffers_n + framebuffers_offset; ++ii) {\n    // Setup to draw into one of the framebuffers.\n    _texture_common__WEBPACK_IMPORTED_MODULE_1__.textureData.set_framebuffer(gl, current_program, _texture_common__WEBPACK_IMPORTED_MODULE_1__.textureData.get_fbo(current_program, ii), canvas.clientWidth, canvas.clientHeight);\n    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.draw_shapes)(gl);\n\n    // for the next draw, use as input texture (associated to gl.TEXTURE0) the texture we just rendered to.\n    gl.bindTexture(gl.TEXTURE_2D, _texture_common__WEBPACK_IMPORTED_MODULE_1__.textureData.get_fbo_texture(current_program, ii));\n  }\n  next_fn(current_program, gl);\n}\nfunction _draw_main_texture(current_program, gl) {\n  var uniforms = current_program.uniforms,\n    program = current_program.program;\n  uniforms.u_flip_y && uniforms.u_flip_y.set(gl, program, '1f', -1);\n  _texture_common__WEBPACK_IMPORTED_MODULE_1__.textureData.set_framebuffer(gl, current_program, null, gl.canvas.width, gl.canvas.height);\n  (0,_utils__WEBPACK_IMPORTED_MODULE_0__.draw_shapes)(gl);\n}\nfunction _update_uniforms_for_fbo(current_program, gl) {\n  var uniforms = current_program.uniforms,\n    program = current_program.program;\n\n  // don't y flip images while drawing to the textures\n  uniforms.u_flip_y && uniforms.u_flip_y.set(gl, program, '1f', 1);\n\n  // Pass in the canvas resolution so we can convert from\n  // pixels to clipspace in the shader\n  uniforms.u_resolution.set(gl, program, '2f', [gl.canvas.width, gl.canvas.height]);\n  if (uniforms.u_time) {\n    var u_time = (performance.now() - current_program.start_time) / 1000.;\n    uniforms.u_time.set(gl, program, '1f', u_time);\n  }\n\n  // Tell the shader to get the texture from texture unit 0\n  uniforms.u_image.set(gl, program, '1i', 0);\n}\n\n//# sourceURL=webpack://wtex/./src/program-loop.js?");

/***/ }),

/***/ "./src/texture-common.js":
/*!*******************************!*\
  !*** ./src/texture-common.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"textureData\": () => (/* binding */ textureData)\n/* harmony export */ });\nvar textureData = function () {\n  return {\n    init_texture: _init_texture,\n    draw_into_texture: _drawImageIntoTexture,\n    create_fbo_textures: _create_fbo_textures,\n    set_framebuffer: _setFramebuffer,\n    get_fbo_texture: _get_texture,\n    get_fbo: _get_fbo\n  };\n  function _get_texture(program_obj, i) {\n    return program_obj.fbo_data[i].texture;\n  }\n  function _get_fbo(program_obj, i) {\n    return program_obj.fbo_data[i].fbo;\n  }\n  function _init_texture(gl) {\n    // Create a texture.\n    var texture = gl.createTexture();\n\n    // Bind it to texture unit 0's 2D bind point\n    gl.bindTexture(gl.TEXTURE_2D, texture);\n\n    // Set the parameters so we don't need mips and so we're not filtering\n    // and we don't repeat at the edges.\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);\n    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);\n    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);\n    return texture;\n  }\n\n  ///////////////////////////////////////\n  // GET IMAGE FROM TEXTURE\n\n  function _drawImageIntoTexture(gl, img_data, image_width, image_height) {\n    // Upload the image into the texture.\n    var mipLevel = 0; // the largest mip\n    var internalFormat = gl.RGBA; // format we want in the texture\n    var border = 0; // must be 0\n    var srcFormat = gl.RGBA; // format of data we are supplying\n    var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying\n    var data = img_data; // no data = create a blank texture\n    var args = data ? [gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, data] : [gl.TEXTURE_2D, mipLevel, internalFormat, image_width, image_height, border, srcFormat, srcType, data];\n    gl.texImage2D.apply(gl, args);\n  }\n  function _create_fbo_textures(program_obj, gl, n, offset, image_width, image_height) {\n    offset = offset || 0;\n    var fbo_data = [];\n    for (var ii = offset; ii < n + offset; ++ii) {\n      var texture = _init_texture(gl);\n\n      //init with blank images\n      _drawImageIntoTexture(gl, null, image_width, image_height);\n\n      // Create a framebuffer\n      var fbo = gl.createFramebuffer();\n      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);\n\n      // Attach a texture to it.\n      var attachmentPoint = gl.COLOR_ATTACHMENT0;\n      gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0);\n      fbo_data[ii] = {\n        fbo: fbo,\n        texture: texture\n      };\n    }\n    return fbo_data;\n  }\n  function _setFramebuffer(gl, program_obj, fbo, width, height) {\n    var program = program_obj.program,\n      uniforms = program_obj.uniforms;\n\n    // make this the framebuffer we are rendering to.\n    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);\n\n    // Tell the shader the resolution of the framebuffer.\n    uniforms.u_resolution && uniforms.u_resolution.set(gl, program, '2f', [width, height]);\n\n    // Tell WebGL how to convert from clip space to pixels\n    gl.viewport(0, 0, width, height);\n  }\n}();\n\n\n//# sourceURL=webpack://wtex/./src/texture-common.js?");

/***/ }),

/***/ "./src/uniforms-common.js":
/*!********************************!*\
  !*** ./src/uniforms-common.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"get_program_uniforms\": () => (/* binding */ get_program_uniforms)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nfunction get_program_uniforms(gl, program) {\n  var def_elems = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.get_program_elements)(gl, {\n    program: program\n  });\n  return Object.keys(def_elems.uniforms).reduce(function (u_data, res_name) {\n    u_data[res_name] = {\n      get: function get() {\n        return def_elems.uniforms[res_name].loc;\n      },\n      set: _set_uniform.bind(null, def_elems.uniforms[res_name])\n    };\n    return u_data;\n  }, {});\n  function _set_uniform(uniform_obj, gl, program, type, data) {\n    gl['uniform' + type].apply(gl, [].concat(uniform_obj.loc, data));\n  }\n}\n\n//# sourceURL=webpack://wtex/./src/uniforms-common.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"bind_attribute\": () => (/* binding */ bind_attribute),\n/* harmony export */   \"createProgram\": () => (/* binding */ createProgram),\n/* harmony export */   \"createProgramFromSources\": () => (/* binding */ createProgramFromSources),\n/* harmony export */   \"draw_shapes\": () => (/* binding */ draw_shapes),\n/* harmony export */   \"get_program_elements\": () => (/* binding */ get_program_elements),\n/* harmony export */   \"loadShader\": () => (/* binding */ loadShader),\n/* harmony export */   \"resizeCanvasToDisplaySize\": () => (/* binding */ resizeCanvasToDisplaySize),\n/* harmony export */   \"set_rectangle_coords\": () => (/* binding */ set_rectangle_coords)\n/* harmony export */ });\nvar set_rectangle_coords = _set_rectangle_coords;\nvar bind_attribute = _bind_attribute;\nvar loadShader = _loadShader;\nvar createProgram = _createProgram;\nvar createProgramFromSources = _createProgramFromSources;\nvar resizeCanvasToDisplaySize = _resizeCanvasToDisplaySize;\nvar draw_shapes = _draw_shapes;\nvar get_program_elements = _get_program_elems;\nvar defaultShaderType = [\"VERTEX_SHADER\", \"FRAGMENT_SHADER\"];\n\n/**\r\n   * Wrapped logging function.\r\n   * @param {string} msg The message to log.\r\n   */\nfunction error(msg) {\n  if (window.top.console) {\n    if (window.top.console.error) {\n      window.top.console.error(msg);\n    } else if (window.top.console.log) {\n      window.top.console.log(msg);\n    }\n  }\n}\n\n/**\r\n * Error Callback\r\n * @callback ErrorCallback\r\n * @param {string} msg error message.\r\n * @memberOf module:webgl-utils\r\n */\n\n/**\r\n * Loads a shader.\r\n * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.\r\n * @param {string} shaderSource The shader source.\r\n * @param {number} shaderType The type of shader.\r\n * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.\r\n * @return {WebGLShader} The created shader.\r\n */\nfunction _loadShader(gl, shaderSource, shaderType, opt_errorCallback) {\n  var errFn = opt_errorCallback || error;\n  // Create the shader object\n  var shader = gl.createShader(shaderType);\n\n  // Load the shader source\n  gl.shaderSource(shader, shaderSource);\n\n  // Compile the shader\n  gl.compileShader(shader);\n\n  // Check the compile status\n  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);\n  if (!compiled) {\n    // Something went wrong during compilation; get the error\n    var lastError = gl.getShaderInfoLog(shader);\n    errFn(\"*** Error compiling shader '\" + shader + \"':\" + lastError);\n    gl.deleteShader(shader);\n    return null;\n  }\n  return shader;\n}\n\n/**\r\n * Creates a program, attaches shaders, binds attrib locations, links the\r\n * program and calls useProgram.\r\n * @param {WebGLShader[]} shaders The shaders to attach\r\n * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in\r\n * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.\r\n * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console\r\n *        on error. If you want something else pass an callback. It's passed an error message.\r\n * @memberOf module:webgl-utils\r\n */\nfunction _createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {\n  var errFn = opt_errorCallback || error;\n  var program = gl.createProgram();\n  shaders.forEach(function (shader) {\n    gl.attachShader(program, shader);\n  });\n  if (opt_attribs) {\n    opt_attribs.forEach(function (attrib, ndx) {\n      gl.bindAttribLocation(program, opt_locations ? opt_locations[ndx] : ndx, attrib);\n    });\n  }\n  gl.linkProgram(program);\n\n  // Check the link status\n  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);\n  if (!linked) {\n    // something went wrong with the link\n    var lastError = gl.getProgramInfoLog(program);\n    errFn(\"Error in program linking:\" + lastError);\n    gl.deleteProgram(program);\n    return null;\n  }\n  return program;\n}\n\n/**\r\n   * Creates a program from 2 sources.\r\n   *\r\n   * @param {WebGLRenderingContext} gl The WebGLRenderingContext\r\n   *        to use.\r\n   * @param {string[]} shaderSourcess Array of sources for the\r\n   *        shaders. The first is assumed to be the vertex shader,\r\n   *        the second the fragment shader.\r\n   * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in\r\n   * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.\r\n   * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console\r\n   *        on error. If you want something else pass an callback. It's passed an error message.\r\n   * @return {WebGLProgram} The created program.\r\n   * @memberOf module:webgl-utils\r\n   */\nfunction _createProgramFromSources(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {\n  var shaders = [];\n  for (var ii = 0; ii < shaderSources.length; ++ii) {\n    shaders.push(loadShader(gl, shaderSources[ii], gl[defaultShaderType[ii]], opt_errorCallback));\n  }\n  return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);\n}\n\n/**\r\n * Resize a canvas to match the size its displayed.\r\n * @param {HTMLCanvasElement} canvas The canvas to resize.\r\n * @param {number} [multiplier] amount to multiply by.\r\n *    Pass in window.devicePixelRatio for native pixels.\r\n * @return {boolean} true if the canvas was resized.\r\n * @memberOf module:webgl-utils\r\n */\nfunction _resizeCanvasToDisplaySize(canvas, multiplier) {\n  multiplier = multiplier || 1;\n  var width = canvas.clientWidth * multiplier | 0;\n  var height = canvas.clientHeight * multiplier | 0;\n  if (canvas.width !== width || canvas.height !== height) {\n    canvas.width = width;\n    canvas.height = height;\n    return true;\n  }\n  return false;\n}\nfunction _set_rectangle_coords(gl, x, y, width, height) {\n  var x1 = x;\n  var x2 = x + width;\n  var y1 = y;\n  var y2 = y + height;\n  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);\n}\nfunction _bind_attribute(gl, buffer, attribute, numComponents, normalize, type) {\n  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);\n  gl.enableVertexAttribArray(attribute);\n  gl.vertexAttribPointer(attribute, numComponents, type || gl.FLOAT, normalize || false, 0, 0);\n}\nfunction _draw_shapes(gl, primitive_type, _offset, _count) {\n  // Draw the shape\n  var primitiveType = _if_is_def(primitive_type) || gl.TRIANGLES;\n  var offset = _if_is_def(_offset) || 0;\n  var count = _if_is_def(_count) || 6;\n  gl.drawArrays(primitiveType, offset, count);\n}\nfunction _get_program_elems(gl, p_obj) {\n  var program = p_obj.program;\n  p_obj.attributes = {};\n  p_obj.uniforms = {};\n  var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);\n  var p = p_obj.attributes;\n  for (var i = 0; i < numAttributes; i++) {\n    var attribute = gl.getActiveAttrib(program, i);\n    p[attribute.name] = {\n      loc: gl.getAttribLocation(program, attribute.name),\n      def: attribute\n    };\n  }\n  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);\n  p = p_obj.uniforms;\n  for (var _i = 0; _i < numUniforms; _i++) {\n    var uniform = gl.getActiveUniform(program, _i);\n    p[uniform.name] = {\n      loc: gl.getUniformLocation(program, uniform.name),\n      def: uniform\n    };\n  }\n  return p_obj;\n}\nfunction _if_is_def(o) {\n  return o !== undefined && o !== null ? o : null;\n}\n\n//# sourceURL=webpack://wtex/./src/utils.js?");

/***/ }),

/***/ "./src/vertex-common.js":
/*!******************************!*\
  !*** ./src/vertex-common.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init_vertex_data\": () => (/* binding */ init_vertex_data)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nvar init_vertex_data = _init_vertex_data;\n\n//////////////////////////////////////////////////////////////\n//////////////////////////////////////////////////////////////\n//////////////////////////////////////////////////////////////\n\nfunction _init_vertex_data(gl, program) {\n  var vertex_data = {};\n  vertex_data.vao = gl.createVertexArray();\n  gl.bindVertexArray(vertex_data.vao);\n\n  // look up where the vertex data needs to go.\n  vertex_data.positionAttributeLocation = gl.getAttribLocation(program, \"a_position\");\n  vertex_data.texCoodAttributeLocation = gl.getAttribLocation(program, \"a_texCoord\");\n  vertex_data.pos_buffer = gl.createBuffer();\n  vertex_data.coord_buffer = gl.createBuffer();\n\n  //bind buffers and write coordinates into them\n\n  ////////////////////////\n  //positions\n  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_data.pos_buffer);\n  (0,_utils__WEBPACK_IMPORTED_MODULE_0__.set_rectangle_coords)(gl, 0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);\n  (0,_utils__WEBPACK_IMPORTED_MODULE_0__.bind_attribute)(gl, vertex_data.pos_buffer, vertex_data.positionAttributeLocation, 2);\n\n  ////////////////////////\n  //texture mapping coordinates\n  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_data.coord_buffer);\n  (0,_utils__WEBPACK_IMPORTED_MODULE_0__.set_rectangle_coords)(gl, 0, 0, 1, 1);\n  (0,_utils__WEBPACK_IMPORTED_MODULE_0__.bind_attribute)(gl, vertex_data.coord_buffer, vertex_data.texCoodAttributeLocation, 2, true);\n  gl.bindVertexArray(null);\n  return vertex_data;\n}\n\n//# sourceURL=webpack://wtex/./src/vertex-common.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	wtex = __webpack_exports__;
/******/ 	
/******/ })()
;