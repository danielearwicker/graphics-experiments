export interface FixedLengthArray<L extends number, T> extends ArrayLike<T> {
    length: L
}

export type Matrix<Rows extends number, Columns extends number> = FixedLengthArray<Rows, FixedLengthArray<Columns, number>>;

// https://www.mathsisfun.com/algebra/matrix-multiplying.html

export function matrixMultiplier<
    LeftRows extends number, 
    LeftColumnsAndRightRows extends number,
    RightColumns extends number
>(
    leftRows: LeftRows,
    leftColumnsAndRightRows: LeftColumnsAndRightRows,
    rightColumns: RightColumns    
) {
    return (
        left: Matrix<LeftRows, LeftColumnsAndRightRows>, 
        right: Matrix<LeftColumnsAndRightRows, RightColumns>) =>
    {
        const result: number[][] = [];

        for (let r = 0; r < leftRows; r++) {
            const resultRow: number[] = [];
            
            for (let c = 0; c < rightColumns; c++) {
                let sum = 0;

                for (let i = 0; i < leftColumnsAndRightRows; i++) {
                     sum += (left[r][i] * right[i][c]);
                }

                resultRow[c] = sum;
            }

            result[r] = resultRow;
        }

        return result as any as Matrix<LeftRows, RightColumns>;
    };
}
