import { Particle2D } from "./Particle2D";

export class Spring2D {
    constructor(
        public readonly particle1: Particle2D,
        public readonly particle2: Particle2D,
        public readonly length: number
    ) {}
}
