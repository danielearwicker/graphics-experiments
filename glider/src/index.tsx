import React from 'react';
import ReactDOM from 'react-dom';
import { CanvasControl } from './CanvasControl';
import { Curtain } from './Curtain';
import { matrixMultiplier, Matrix } from "./Matrix";

const curtain = new Curtain();

function App() {
    return (
        <CanvasControl control={curtain} />
    );
}

console.log("hobble");

ReactDOM.render(<App />, document.getElementById('root'));

const compose = matrixMultiplier(4, 4, 4);

const identity: Matrix<4, 4> = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
] as const;

console.log(identity);

try {
    const transform = matrixMultiplier(1, 4, 4);

    const t = transform([[8, 2, 3, 7]] as const, identity);

    console.log(JSON.stringify(t, null, 4));
} catch(x) {
    console.log(x);
}