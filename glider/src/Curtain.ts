import { Container } from "./Container";
import { Label } from "./Label";
import { Slider } from "./Silder";
import { lengthSquared3d, scale2d, scale3d, subtract3d, Vector2d, Vector3d } from "./Vector";

function rotateXZ(v: Vector3d, angle: number): Vector3d {
    const xR = v[0] * Math.cos(angle) - v[2] * Math.sin(angle);
    const zR = v[0] * Math.sin(angle) + v[2] * Math.cos(angle);
    return [xR, v[1], zR];
}

function rotateYZ(v: Vector3d, angle: number): Vector3d {
    const yR = v[1] * Math.cos(angle) - v[2] * Math.sin(angle);
    const zR = v[1] * Math.sin(angle) + v[2] * Math.cos(angle);
    return [v[0], yR, zR];
}

function compareDistances(
    [x1, x2, distance1]: [unknown, string, number],
    [x3, x4, distance2]: [unknown, string, number]
) {
    return distance2 - distance1;
}

export class Curtain extends Container {

    counter = 0;
    frames = 0;
    timer = new Date().getSeconds();
    
    cells = new Slider([50, 10], "cells", 0, 1, 100, 20);
    edge = new Slider([50, 110], "edge", 2, 0.05, 0.5, 0.1);
    distance = new Slider([50, 210], "distance", 2, 0.05, 5, 2.5);
    perspective = new Slider([50, 310], "perspective", 2, 0.1, 2, 1);
    angleXZ = new Slider([50, 410], "angle x-z", 1, 0, 360, 0);
    angleYZ = new Slider([50, 510], "angle y-z", 1, 0, 360, 0);
    fps = new Label([50, 610], [200, 30], "", "left");

    constructor() {
        super();

        this.contents.push(
            this.cells, 
            this.edge, 
            this.distance, 
            this.perspective, 
            this.angleXZ, 
            this.angleYZ, 
            this.fps);
    }

    constrainAngle(a: number) {
        while (a < 0) {
            a += 360;
        }
        while (a >= 360) {
            a -= 360;
        }
        return a;
    }

    override mouseChanged(by: Vector2d) {
        if (this.mouseDown) {
            this.angleXZ.value = this.constrainAngle(this.angleXZ.value + (by[0] / 10));
            this.angleYZ.value = this.constrainAngle(this.angleYZ.value - (by[1] / 10));
        }
    }

    override render(ctx: CanvasRenderingContext2D) {

        const newTimer = new Date().getSeconds();
        if (newTimer !== this.timer) {
            this.timer = newTimer;
            this.fps.text = (this.counter - this.frames).toFixed(1) + " fps";
            this.frames = this.counter;
        }

        const canvasSize: Vector2d = [ctx.canvas.width, ctx.canvas.height];
        const halfCanvasSize = scale2d(canvasSize, 0.5);

        ctx.save();
        ctx.translate(halfCanvasSize[0], halfCanvasSize[1]);
        ctx.scale(500, -500);

        ctx.strokeStyle = "gray";
        ctx.lineWidth = 0.003;

        const counter = this.counter++;
        const landscape: number[][] = [];
        const cells = this.cells.value;
        
        for (let x = 0; x < cells; x++) {
            landscape[x] = [];
            for (let y = 0; y < cells; y++) {
                landscape[x][y] = (Math.cos((x + (counter/10))/3) * 2) + (Math.sin((y + (counter/7))/5) * 2);
            }
        }

        const polygons: [points: Vector3d[], colour: string, distance: number][] = [];
    
        const eye: Vector3d = [0, 0, -this.distance.value];

        const angleXZ = 2 * Math.PI * (this.angleXZ.value / 360);
        const angleYZ = 2 * Math.PI * (this.angleYZ.value / 360);

        const rotate = (v: Vector3d) => {
            v = rotateXZ(v, angleXZ);
            v = rotateYZ(v, angleYZ);
            return v;
        }

        const edge = this.edge.value;

        for (let z = cells-1; z > 0; z--) {
            for (let x = 1; x < cells; x++) {

                const corners = [
                    rotate(scale3d([x-(cells/2), landscape[x-1][z-1], z-(cells/2)], edge)),
                    rotate(scale3d([x-(cells/2)+1, landscape[x][z-1], z-(cells/2)], edge)),
                    rotate(scale3d([x-(cells/2)+1, landscape[x][z], z-(cells/2)+1], edge)),
                    rotate(scale3d([x-(cells/2), landscape[x-1][z], z-(cells/2)+1], edge))
                ];

                polygons.push([
                    corners, 
                    `rgb(${250*z/cells}, ${250*x/cells}, 100)`, 
                    lengthSquared3d(subtract3d(corners[0], eye))
                ]);            
            }
        }

        polygons.sort(compareDistances);

        const perspective = this.perspective.value;

        const project = (v: Vector3d): Vector2d => {

            const scale = (v[2]*perspective) - eye[2];
            if (scale <= 0) {
                return [NaN, NaN];
            }
            return [v[0] / scale, v[1] / scale];
        }

        for (const p of polygons) {

            const [points, colour, _] = p;

            const projected = points.map(project);
            const count = projected.length;

            if (isNaN(projected[0][0]) || isNaN(projected[count - 1][0])) {
                break;
            }

            ctx.beginPath();
            const last = projected[count - 1];
            ctx.moveTo(last[0], last[1]);

            for (let n = 0; n < count; n++) {
                const p2d = projected[n];
                ctx.lineTo(p2d[0], p2d[1]);
            }
            
            ctx.fillStyle = colour;
            ctx.fill();
        }

        ctx.restore();

        super.render(ctx);
    }
}
