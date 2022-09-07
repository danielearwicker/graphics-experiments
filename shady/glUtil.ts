export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    var shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Couldn't create shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    throw new Error(gl.getShaderInfoLog(shader) ?? 
        "Couldn't compile shader");
}

export function createProgram(
    gl: WebGLRenderingContext,
    shaders: WebGLShader[]
) {
    var program = gl.createProgram();
    if (!program) {
        throw new Error("Could not create webgl program");
    }

    for (const shader of shaders) {
        gl.attachShader(program, shader);
    }

    gl.linkProgram(program);
    
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
   
    throw new Error(gl.getProgramInfoLog(program) ?? 
        "Could not link program");
}

export function resizeCanvasToDisplaySize(
    canvas: HTMLCanvasElement
) {
    const dpr = window.devicePixelRatio || 1;

    const displayWidth  = canvas.clientWidth * dpr;
    const displayHeight = canvas.clientHeight * dpr;
   
    const needResize = canvas.width !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}
