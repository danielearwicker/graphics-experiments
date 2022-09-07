import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

type MatrixSource = {
    readonly [index: number]: string | number;
}

class Matrix {
    public readonly values: number[] = [];

    constructor(
        public readonly columns: number, 
        public readonly rows: number, 
        source: MatrixSource = {}) {

        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                const value = source[this.index(c, r)];
                const parsed = typeof value === "number" ? value : parseFloat(value);
                const final = (typeof parsed !== "number" || isNaN(parsed)) ? (r == c ? 1 : 0) : parsed;
                this.set(c, r, final);
            }
        }
    }

    index(column: number, row: number) {
        return (column * this.rows) + row;
    }

    get(column: number, row: number) {
        return this.values[this.index(column, row)];
    }

    set(column: number, row: number, value: number) {
        this.values[this.index(column, row)] = value;
    }

    multiply(right: Matrix): Matrix {
        if (this.columns !== right.rows) {
            throw new Error("The number of columns of the left must equal the number of rows of the right");
        }
    
        const result = new Matrix(right.columns, this.rows);
    
        for (let c = 0; c < right.columns; c++) {
            for (let r = 0; r < this.rows; r++) {
                
                let sum = 0;
    
                for (let i = 0; i < this.columns; i++) {
                     sum += this.get(i, r) * right.get(c, i);
                }
    
                result.set(c, r, sum);
            }
        }
    
        return result;
    }
}

interface MatrixFocusProps {
    rowFocused?: number;
    columnFocused?: number;
    setRowFocused?(row: number): void;
    setColumnFocused?(row: number): void;
}

interface MatrixEditorProps extends MatrixFocusProps {
    columns: number;
    rows: number;
    state: MatrixSource;
    setState(state: MatrixSource): void;    
}

function range(length: number) {
    return [...Array(length).keys()];
}

function MatrixEditor({ columns, rows, state, setState, rowFocused, columnFocused, setRowFocused, setColumnFocused }: MatrixEditorProps) {

    const matrix = new Matrix(columns, rows, state);

    function update(column: number, row: number, value: string) {
        const ns = { 
            ...state,
            [matrix.index(column, row)]: value
        };
        console.log(ns);
        setState(ns);
    }

    return (
        <table>
            <tbody>
            {
                range(rows).map(r => (
                    <tr key={r}>
                        {
                            range(columns).map(c => (
                                <td key={c}>
                                    <input
                                        value={state[matrix.index(c, r)] ?? ("" + matrix.get(c, r))}
                                        className={
                                            (setRowFocused && rowFocused === r) ||
                                            (setColumnFocused && columnFocused === c)
                                            ? "focused" : undefined
                                        }
                                        onChange={e => update(c, r, e.target.value)}
                                        onFocus={() => {
                                            setRowFocused?.(r);
                                            setColumnFocused?.(c);
                                        }} />
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
}

interface MatrixDisplayProps extends MatrixFocusProps {
    matrix: Matrix;
}

function MatrixDisplay({ matrix, rowFocused, columnFocused, setRowFocused, setColumnFocused }: MatrixDisplayProps) {
    return (
        <table>
            <tbody>
            {
                range(matrix.rows).map(r => (
                    <tr key={r}>
                        {
                            range(matrix.columns).map(c => (
                                <td key={c}>
                                    <input
                                        type="number" 
                                        value={"" + matrix.get(c, r)}
                                        className={
                                            (rowFocused === r && columnFocused === c)
                                            ? "focused" : undefined
                                        }
                                        onFocus={e => {
                                            setRowFocused?.(r);
                                            setColumnFocused?.(c);
                                        }}                                   
                                        readOnly />
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
            </tbody>
        </table>
    );
}

const fSize = 40;

const fShape: [x: number, y: number][] = [    
    [-0.3, -0.5],
    [0.3, -0.5],
    [0.3, -0.4],
    [-0.2, -0.4],
    [-0.2, -0.1],
    [0.1, -0.1],
    [0.1, -0.0],
    [-0.2, 0.0],
    [-0.2, 0.5],
    [-0.3, 0.5]
].map(([x, y]) => [x * fSize, y * fSize]);

interface DemoCanvasProps {
    matrix: Matrix;
}

function DemoCanvas({ matrix }: DemoCanvasProps) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = canvas.current?.getContext("2d")!;
        if (!ctx) return;

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        ctx.save();
        ctx.scale(ctx.canvas.width / (fSize * 2), ctx.canvas.height / (fSize * 2));
        ctx.translate(fSize, fSize);

        function transform([x, y]: [x: number, y: number]): [x: number, y: number] {
            const input = new Matrix(1, 4, [x, y, 0, 1]);

            const transformed = matrix.multiply(input);

            return [transformed.values[0] / transformed.values[3], transformed.values[1] / transformed.values[3]];
        }

        function drawPath(color: string, points: [x: number, y: number][]) {
            ctx.beginPath();
        
            const last = points[points.length - 1];
            ctx.moveTo(...transform(last));

            for (const p of points) {
                ctx.lineTo(...transform(p));
            }

            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        
        drawPath("cornflowerblue", fShape);

        drawPath("red", [
            [-30, -30],
            [30, -30],
            [30, 30],
            [-30, 30]
        ]);

        ctx.restore();

    }, [canvas.current, matrix]);

    return (
        <canvas ref={canvas} />
    );
}

function App() {
    const [rowsA, setRowsA] = useState(4);
    const [columnsA, setColumnsA] = useState(4);
    const [columnsB, setColumnsB] = useState(1);

    const [sourceA, setSourceA] = useState<MatrixSource>({});
    const [sourceB, setSourceB] = useState<MatrixSource>({});

    const matrixA = new Matrix(columnsA, rowsA, sourceA);
    const matrixB = new Matrix(columnsB, columnsA, sourceB);

    const output = matrixA.multiply(matrixB);

    const [columnFocused, setColumnFocused] = useState(0);
    const [rowFocused, setRowFocused] = useState(0);

    const enableDemo = matrixA.rows === 4 && matrixA.columns === 4;
    const transform = enableDemo ? `matrix3d(${matrixA.values.join(",")})` : "";

    function parseTransform(text: string) {
        const open = text.indexOf("(");        
        if (open !== -1) {
            text = text.substr(open + 1);
            
            const close = text.indexOf(")");
            if (close !== -1) {
                text = text.substr(0, close);
            }

            const parts = text.split(",");
            if (parts.length === 16) {
                setSourceA(parts);
            }
        }
    }

    return (
        <div>
            <div className="configuration">
                <h2>Configuration</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>A rows:</td>
                            <td><input type="number" value={rowsA} style={{ width: 40 }}
                                onChange={e => setRowsA(parseInt(e.target.value))}/></td>
                        </tr>
                        <tr>
                            <td>A columns:</td>
                            <td><input type="number" value={columnsA} style={{ width: 40 }}
                                onChange={e => setColumnsA(parseInt(e.target.value))}/></td>
                        </tr>
                        <tr>
                            <td>B columns:</td>
                            <td><input type="number" value={columnsB} style={{ width: 40 }}
                                onChange={e => setColumnsB(parseInt(e.target.value))}/></td>
                        </tr>
                    </tbody>
                </table>                
            </div>
            <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <th>B</th>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>
                            <MatrixEditor 
                                rows={columnsA} columns={columnsB} 
                                state={sourceB} setState={setSourceB} 
                                columnFocused={columnFocused} setColumnFocused={setColumnFocused} 
                            />
                            
                        </td>
                    </tr>
                    <tr>
                        <th>A</th>
                        <td>
                            <MatrixEditor 
                                rows={rowsA} columns={columnsA} 
                                state={sourceA} setState={setSourceA}
                                rowFocused={rowFocused} setRowFocused={setRowFocused} 
                            />
                        </td>
                        <td>
                            <MatrixDisplay 
                                matrix={output}
                                rowFocused={rowFocused} setRowFocused={setRowFocused}
                                columnFocused={columnFocused} setColumnFocused={setColumnFocused}
                             />
                        </td>
                    </tr>
                </tbody>
            </table>
            
            {enableDemo && (
                <>                    
                    <div className="demos">                            
                        <div className="demo">
                            <div className="demo-content" style={{ transform }}>F</div>                        
                        </div>
                        <div className="demo">
                            <DemoCanvas matrix={matrixA} />
                        </div>
                    </div>
                    <div className="css">
                        <input type="text" value={transform} onChange={e => parseTransform(e.target.value)} />
                    </div>
                </>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

