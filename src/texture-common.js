const textureData = (function () {
    return {
        init_texture: _init_texture,
        draw_into_texture: _drawImageIntoTexture,
        create_fbo_textures: _create_fbo_textures,
        set_framebuffer: _setFramebuffer,
        get_fbo_texture: _get_texture,
        get_fbo: _get_fbo
    };

    function _get_texture(program_obj, i) {
        return program_obj.fbo_data[i].texture;
    }

    function _get_fbo(program_obj, i) {
        return program_obj.fbo_data[i].fbo;
    }

    function _init_texture(gl) {
        // Create a texture.
        var texture = gl.createTexture();

        // Bind it to texture unit 0's 2D bind point
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we don't need mips and so we're not filtering
        // and we don't repeat at the edges.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        return texture;
    }


    ///////////////////////////////////////
    // GET IMAGE FROM TEXTURE

    function _drawImageIntoTexture(gl, img_data, image_width, image_height) {
        // Upload the image into the texture.
        var mipLevel = 0;               // the largest mip
        var internalFormat = gl.RGBA;   // format we want in the texture
        var border = 0;                 // must be 0
        var srcFormat = gl.RGBA;        // format of data we are supplying
        var srcType = gl.UNSIGNED_BYTE;  // type of data we are supplying
        var data = img_data;                // no data = create a blank texture
        var args = data ? [
            gl.TEXTURE_2D,
            mipLevel,
            internalFormat,
            srcFormat,
            srcType,
            data
        ] : [
            gl.TEXTURE_2D,
            mipLevel,
            internalFormat,
            image_width,
            image_height,
            border,
            srcFormat,
            srcType,
            data
        ];
        try {
            gl.texImage2D.apply(gl, args);
        }
        catch(e) {
            console.warn("Error loading image", img_data);
        }
    }

    function _create_fbo_textures(program_obj, gl, n, offset, image_width, image_height) {
        offset = offset || 0;
        let fbo_data = [];
        for (var ii = offset; ii < n + offset; ++ii) {
            var texture = _init_texture(gl);

            //init with blank images
            _drawImageIntoTexture(gl, null, image_width, image_height);

            // Create a framebuffer
            var fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

            // Attach a texture to it.
            var attachmentPoint = gl.COLOR_ATTACHMENT0;
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0);

            fbo_data[ii] = {
                fbo: fbo,
                texture: texture
            };
        }
        return fbo_data;
    }

    function _setFramebuffer(gl, fbo, width, height) {
        // make this the framebuffer we are rendering to.
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, width, height);
    }
})();

export { textureData };
