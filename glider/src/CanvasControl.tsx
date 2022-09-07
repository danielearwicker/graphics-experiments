import { useEffect } from "react";

import React from "react";
import { Control } from "./Control";

export interface CanvasControlProps {
    className?: string;
    control: Control;
}

export function CanvasControl({ className, control }: CanvasControlProps) {

    let container: HTMLDivElement | null = null;

    useEffect(() => {
        control.element = container;
    });

    return (
        <div className={className || "animation-canvas"}
             style={{overflow: "hidden"}}
             ref={e => container = e} />
    );
}
