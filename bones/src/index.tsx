import React from 'react';
import ReactDOM from 'react-dom';
import { AnimationCanvas } from './AnimationCanvas';
import { bonesModel } from './bonesModel';

const model = bonesModel();

function App() {
    return (
        <AnimationCanvas render={model.render}></AnimationCanvas>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
