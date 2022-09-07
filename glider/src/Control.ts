import { subtract2d, Vector2d } from "./Vector";

export abstract class Control {
    private _mousePosition: Vector2d | undefined = undefined;
    private _mouseDown = false;

    private _element: HTMLElement | undefined;
    private _canvas: HTMLCanvasElement | undefined;

    constructor(public topLeft: Vector2d, public bottomRight: Vector2d) {}

    contains(at: Vector2d) {
        return (
            at[0] >= this.topLeft[0] && 
            at[1] >= this.topLeft[1] &&
            at[0] < this.bottomRight[0] && 
            at[1] < this.bottomRight[1]
        );
    }

    get size() {
        return subtract2d(this.bottomRight, this.topLeft);
    }

    get mousePosition() {
        return this._mousePosition;
    }

    get mouseDown() {
        return this._mouseDown;
    }

    setMouse(at: Vector2d | undefined, down: boolean) {
        const rel = at && subtract2d(at, this.topLeft);
        const by = (rel && this._mousePosition && subtract2d(rel, this._mousePosition)) ?? [0, 0];
        this._mousePosition = rel;
        this._mouseDown = down;
        this.mouseChanged(by);
    }

    mouseChanged(by: Vector2d | undefined) {}

    abstract render(ctx: CanvasRenderingContext2D): void;

    set element(element: HTMLElement | undefined | null) {
        if (element === this._element) {
            return;
        }

        if (this._canvas) {
            this._canvas.removeEventListener("mousemove", this.onMouseMove);
            this._canvas.removeEventListener("mouseleave", this.onMouseLeave);
            this._canvas.removeEventListener("mousedown", this.onMouseMove);
            this._canvas.removeEventListener("mouseup", this.onMouseMove);

            this._canvas.remove();
            this._canvas = undefined;
        }

        this._element = element ?? undefined;

        if (element) {
            const canvas = document.createElement("canvas");
            element.appendChild(canvas);
            this._canvas = canvas;

            canvas.addEventListener("mousemove", this.onMouseMove);
            canvas.addEventListener("mouseleave", this.onMouseLeave);
            canvas.addEventListener("mousedown", this.onMouseMove);
            canvas.addEventListener("mouseup", this.onMouseMove);

            this.animationLoop(element);
        }
    }

    private onMouseMove = (e: MouseEvent) => {
        const dpr = window.devicePixelRatio || 1;
        this.setMouse([e.offsetX * dpr, e.offsetY * dpr], (e.buttons & 1) === 1);
    }

    private onMouseLeave = () => {
        this.setMouse(undefined, false);
    }

    private animationLoop(element: HTMLElement) {        
        const ctx = this._canvas?.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        requestAnimationFrame(() => {
            if (this._element !== element || !this._element || !this._canvas) {
                return;
            }
            
            const lw = this._element.clientWidth, lh = (this._element.clientHeight - 1);
            const pw = lw * dpr, ph = lh * dpr;
            const canvas = this._canvas;

            if (canvas.width !== pw) canvas.width = pw;
            if (canvas.height !== ph) canvas.height = ph;

            const ws = `${lw}px`, hs = `${lh}px`;
            if (canvas.style.width !== ws) canvas.style.width = ws;
            if (canvas.style.height !== hs) canvas.style.height = hs;

            ctx.clearRect(0, 0, pw, ph);
            this.bottomRight = [pw, ph];
            ctx.save();
            try {
                this.render(ctx);
            } finally {
                ctx.restore();
            }
            this.animationLoop(element);
        });
    }
}
