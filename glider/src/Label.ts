import { Control } from "./Control";
import { add2d, Vector2d } from "./Vector";

export class Label extends Control {
    
    private cachedImage: HTMLCanvasElement | undefined;
    private cachedText: string | undefined;

    constructor(topLeft: Vector2d, size: Vector2d, public text: string, public align: CanvasTextAlign) {
        super(topLeft, add2d(topLeft, size));
    }

    render(ctx: CanvasRenderingContext2D) {        
        if (this.cachedText !== this.text) {
            this.cachedText = this.text;
            this.cachedImage = undefined;
        }

        if (!this.cachedImage) {
            this.cachedImage = document.createElement("canvas");
            this.cachedImage.width = this.size[0];
            this.cachedImage.height = this.size[1];
            const clc = this.cachedImage.getContext("2d");
            if (clc) {                
                clc.textBaseline = "top";
                clc.font = "20pt Helvetica";
                clc.fillStyle = "white";
                clc.textAlign = this.align;
                clc.fillText(this.text, 0, 0);                
            }
        }

        ctx.drawImage(this.cachedImage, this.topLeft[0], this.topLeft[1], this.size[0], this.size[1]);
    }
}
