import { Control } from "./Control";
import { subtract2d, Vector2d } from "./Vector";

export class Container extends Control {
    readonly contents: Control[] = [];
    private over: Control | undefined;
    
    constructor(topLeft: Vector2d = [0, 0], bottomRight: Vector2d = [0, 0]) {
        super(topLeft, bottomRight);
    }

    setMouse(at: Vector2d | undefined, down: boolean) {
        const atRelative = at && subtract2d(at, this.topLeft);
        const overNow = atRelative && this.contents.find(x => x.contains(atRelative));

        if (this.over !== overNow) {
            if (this.over) {
                this.over.setMouse(undefined, false);
                this.over = undefined;
            } else {
                super.setMouse(undefined, false);
            }
            this.over = overNow;
        }

        this.over = overNow;

        if (this.over) {
            this.over.setMouse(atRelative, down);
        } else {
            super.setMouse(at, down);
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        for (const c of this.contents) {
            ctx.save();            
            ctx.translate(this.topLeft[0], this.topLeft[1]);
            try {
                c.render(ctx);

                // if (this.over) {
                //     ctx.strokeStyle = "red";
                //     ctx.strokeRect(this.over.topLeft[0], this.over.topLeft[1], this.over.size[0], this.over.size[1]);
                // }

            } finally {
                ctx.restore();
            }
        }
    }
}
