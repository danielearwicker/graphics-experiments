export type MatrixSource = {
    readonly [index: number]: string | number;
}

export class Matrix<Columns extends number, Rows extends number> {
    public readonly values: number[] = [];

    constructor(
        public readonly columns: Columns,
        public readonly rows: Rows,
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

    multiply<RightColumns extends number>(right: Matrix<RightColumns, Columns>): Matrix<RightColumns, Rows> {        
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

export const projection = (fudgeFactor: number) => new Matrix(4, 4, [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, fudgeFactor,
    0, 0, 0, 1,
]);

const rotate = (a: number, matrix: (s: number, c: number) => number[]) => 
    new Matrix(4, 4, matrix(Math.sin(a), Math.cos(a)));

export const rotateX = (a: number) => rotate(a, (s, c) => [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
]);

export const rotateY = (a: number) => rotate(a, (s, c) => [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1,
]);

export const rotateZ = (a: number) => rotate(a, (s, c) => [
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
]);

export const scale = (x: number, y: number, z: number) => new Matrix(4, 4, [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
]);

export const translate = (x: number, y: number, z: number) => new Matrix(4, 4, [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
]);
