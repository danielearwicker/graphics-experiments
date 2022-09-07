import {
  createShader,
  createProgram,
  resizeCanvasToDisplaySize,
} from "./glUtil";
import { projection, rotateX, rotateY, rotateZ } from "./Matrix";

import { vertex, fragment } from "./shaders";

const canvas = document.querySelector("canvas")!;

let mouse = [0, 0];
let angle = [0, 0];

canvas.addEventListener("mousemove", (e) => {
  if (e.buttons & 1) {
    angle[0] += (e.clientY - mouse[1]) / 100;
    angle[1] += (e.clientX - mouse[0]) / 100;
  }

  mouse = [e.clientX, e.clientY];
});

const gl = canvas.getContext("webgl")!;
if (!gl) {
  throw new Error("No webgl support");
}

const program = createProgram(gl, [
  createShader(gl, gl.VERTEX_SHADER, vertex),
  createShader(gl, gl.FRAGMENT_SHADER, fragment),
]);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const cells = 1000;

const positions: number[] = [];

const sheetSize = 1.2;
const offset = sheetSize / 2;
const cellEdge = sheetSize / cells;
const step = 1.2;

for (let x = 0; x < cells; x++) {
  for (let y = 0; y < cells; y++) {
    positions.push(
      x * cellEdge - offset,
      y * cellEdge - offset,
      x * cellEdge - offset,
      (y + step) * cellEdge - offset,
      (x + step) * cellEdge - offset,
      (y + step) * cellEdge - offset,
      x * cellEdge - offset,
      y * cellEdge - offset,
      (x + step) * cellEdge - offset,
      y * cellEdge - offset,
      (x + step) * cellEdge - offset,
      (y + step) * cellEdge - offset
    );
  }
}

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

var matrixLocation = gl.getUniformLocation(program, "u_matrix");

const frameCounterLocation = gl.getUniformLocation(program, "u_frame");
let frameCounter = 0;

function resizeCanvasContinuously() {
  if (resizeCanvasToDisplaySize(canvas)) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);

  gl.uniform1i(frameCounterLocation, frameCounter++);

  const matrix = projection(0.5)
    .multiply(rotateX(angle[0]))
    .multiply(rotateY(angle[1]));

  gl.uniformMatrix4fv(matrixLocation, false, matrix.values);

  // locations
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(
    positionAttributeLocation,
    2, // size
    gl.FLOAT, // type,
    false, // normalize
    0, // stride
    0 // offset
  );

  gl.drawArrays(
    gl.TRIANGLES,
    0, // offset
    positions.length / 2
  );

  requestAnimationFrame(resizeCanvasContinuously);
}

resizeCanvasContinuously();
