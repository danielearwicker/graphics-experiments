import { Control } from "./Control";
import { add2d, Vector2d } from "./Vector";

export class Slider extends Control {
    
    private cachedLabel: HTMLCanvasElement | undefined;
    private cachedValue: number | undefined;

    constructor(topLeft: Vector2d, 
        private readonly label: string, 
        private readonly scale: number, 
        private readonly min: number, 
        private readonly max: number, 
        private _value: number) {
        super(topLeft, add2d(topLeft, [500, 60]));
    }

    get value() {
        return this._value;
    }

    set value(v: number) {
        v = parseFloat(v.toFixed(this.scale));        
        this._value = Math.max(this.min, Math.min(this.max, v));
    }

    override mouseChanged(_: Vector2d) {
        if (!this.mousePosition || !this.mouseDown) {
            return;
        }

        this.value = this.min + ((this.mousePosition[0] / this.size[0]) * (this.max - this.min));
    }

    render(ctx: CanvasRenderingContext2D) {        
        const baseline = this.size[1] / 2;

        ctx.fillStyle = "white";
        ctx.fillRect(this.topLeft[0], this.topLeft[1] + baseline + 8, this.size[0], 1);

        ctx.fillStyle = "#0DF";
        const pos = ((this._value - this.min) / (this.max - this.min)) * this.size[0];
        ctx.fillRect(this.topLeft[0] + pos - 2, this.topLeft[1] + baseline, 16, 16);

        if (this.cachedValue !== this.value) {
            this.cachedValue = this.value;
            this.cachedLabel = undefined;
        }

        if (!this.cachedLabel) {
            this.cachedLabel = document.createElement("canvas");
            this.cachedLabel.width = this.size[0];
            this.cachedLabel.height = this.size[1];
            const clc = this.cachedLabel.getContext("2d");
            if (clc) {                
                clc.textBaseline = "bottom";
                clc.font = "20pt Helvetica";
                clc.fillStyle = "white";
                clc.textAlign = "left";
                clc.fillText(this.label, 0, baseline);
                clc.textAlign = "right";
                clc.fillText(this.value.toFixed(this.scale), this.size[0]-4, baseline);
            }
        }

        ctx.drawImage(this.cachedLabel, this.topLeft[0], this.topLeft[1], this.size[0], this.size[1]); 
    }
}
