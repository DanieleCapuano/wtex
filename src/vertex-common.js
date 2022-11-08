import {set_rectangle_coords, bind_attribute} from './utils';

export const init_vertex_data = _init_vertex_data;


//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function _init_vertex_data(gl, program) {
    let vertex_data = {};
    
    vertex_data.vao = gl.createVertexArray();
    gl.bindVertexArray(vertex_data.vao);

    // look up where the vertex data needs to go.
    vertex_data.positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    vertex_data.texCoodAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

    vertex_data.pos_buffer = gl.createBuffer();
    vertex_data.coord_buffer = gl.createBuffer();

    //bind buffers and write coordinates into them
    
    ////////////////////////
    //positions
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_data.pos_buffer);
    set_rectangle_coords(gl, 0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    bind_attribute(gl, vertex_data.pos_buffer, vertex_data.positionAttributeLocation, 2);

    ////////////////////////
    //texture mapping coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_data.coord_buffer);
    set_rectangle_coords(gl, 0, 0, 1, 1);
    bind_attribute(gl, vertex_data.coord_buffer, vertex_data.texCoodAttributeLocation, 2, true);

    gl.bindVertexArray(null);

    return vertex_data;
}
