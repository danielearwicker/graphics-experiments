import { Vector2D } from "./Vector2D";

export class Particle2D {
    constructor(
        public position: Vector2D,
        public velocity: Vector2D
    ) {}

    move() {
        this.position = this.position.add(this.velocity);
    }
}