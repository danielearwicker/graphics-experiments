import React, { useEffect, useRef } from "react";
import { setup } from "../stuff";

export function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            setup(canvasRef.current);
        }
    }, [canvasRef.current]);

    return (
        <div className="canvas">
            <canvas ref={canvasRef} />
        </div>        
    );
}
