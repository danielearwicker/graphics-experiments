import { 
    createShader, 
    createProgram,
    resizeCanvasToDisplaySize
} from "./glUtil";

import { vertex, fragment } from "./shaders";

const canvas = document.querySelector("canvas")!;

const gl = canvas.getContext("webgl")!;
if (!gl) {
    throw new Error("No webgl support");
}

const program = createProgram(gl, [
    createShader(gl, gl.VERTEX_SHADER, vertex),
    createShader(gl, gl.FRAGMENT_SHADER, fragment)
]);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

const positionBuffer = gl.createBuffer();

const zoomLoc = gl.getUniformLocation(program, "u_zoom");

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const s = 1;
// three 2d points
const positions = [
    -s, -s,
    -s, s,
    s, -s,
    s, -s,
    s, s,
    -s, s
];

gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array(positions),
    gl.STATIC_DRAW
);

gl.uniform4fv(zoomLoc, [0, 0, 1, 1]);

let scale = 1;
let dx = 0;
let dy = 0;

const keyStates: Record<string, boolean | undefined> = {};

document.addEventListener("keydown", e => keyStates[e.key] = true);
document.addEventListener("keyup", e => keyStates[e.key] = false);

function resizeCanvasContinuously() {
    if (resizeCanvasToDisplaySize(canvas)) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        console.log(gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    scale *= 0.999;
    
    const motion = 0.01 * scale;

    if (keyStates["ArrowLeft"]) {
        dx -= motion;
    } else if (keyStates["ArrowRight"]) {
        dx += motion;
    }

    if (keyStates["ArrowUp"]) {
        dy += motion;
    } else if (keyStates["ArrowDown"]) {
        dy -= motion;
    }

    gl.uniform4fv(zoomLoc, [dx, dy, scale, scale]);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.vertexAttribPointer(
        positionAttributeLocation, 
        2, // size
        gl.FLOAT, // type, 
        false, // normalize
        0, // stride
        0 // offset
    );

    gl.drawArrays(gl.TRIANGLES, 
        0, // offset
        6 // count
    );

    requestAnimationFrame(resizeCanvasContinuously);
}

resizeCanvasContinuously();
