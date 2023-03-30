
export function gridToScreen(worldX: number, screenW: number, gridW: number) {
    return Math.floor(worldX * (screenW / gridW))
}

export function screenToGrid(screenX: number, screenW: number, gridW: number) {
    return screenX / (screenW / gridW)
}

export function index(col: number, row: number, cols: number) {
    return row * cols + col
}

export function indexToCol(index: number, columns: number) {
    return index % columns
}

export function indexToRow(index: number, columns: number) {
    return Math.trunc(index / columns)
}

const outOfBoundsMessage = "If this wasn't intentional, consider adding boundaries to catch lower/greater than indexing"

// TODO: implement add/remove col, row
// TODO: implement toggleDiagonalNeighbours
// TODO: refactor A* to use this grid

export default class Grid {
    #nodes!: number[]
    #nodeNeighbours!: number[][];
    #cols!: number;
    #rows!: number;
    #width: number;
    #height: number;
    #cellW: number;
    #cellH: number;

    constructor(cols = 10, rows = 10, cellW = 1, cellH = 1, addDiagonally = false) {
        this.#cols = cols;
        this.#rows = rows;
        this.#width = cols * cellW;
        this.#height = rows * cellH;
        this.#cellW = cellW;
        this.#cellH = cellH;
        this.generate(cols, rows, cellW, cellH, addDiagonally)
    }

    get cols() {
        return this.#cols;
    }

    get rows() {
        return this.#rows;
    }

    get cellW() {
        return this.#cellW;
    }

    get cellH() {
        return this.#cellH;
    }

    get width() {
        return this.#width
    }

    get height() {
        return this.#height
    }

    get first() {
        return this.#nodes[0]
    }

    get last() {
        return this.#nodes[this.#nodes.length - 1]
    }

    getNeighbours(nodeIndex: number) {
        if (nodeIndex < 0) throw new Error(`Array out of bounds: index "${nodeIndex}" is lesser than min index "0"`)
        if (nodeIndex >= this.#nodes.length) throw new Error(`Array out of bounds: index "${nodeIndex}" is greater than max index "${this.#nodes.length - 1}"`)

        return this.#nodeNeighbours[nodeIndex];
    }

    setNodeValue_ByIndex(nodeIndex: number, value: number) {
        if (nodeIndex < 0) throw new Error(`Array out of bounds: index "${nodeIndex}" is lesser than min index "0"`)
        if (nodeIndex >= this.#nodes.length) throw new Error(`Array out of bounds: index "${nodeIndex}" is greater than max index "${this.#nodes.length - 1}"`)

        this.#nodes[nodeIndex] = value;
    }

    setNodeValue(col: number, row: number, value: number) {
        if (col < 0) throw new Error(`Array out of bounds: column "${col}" is lesser than min column "0". ` + outOfBoundsMessage)
        if (row < 0) throw new Error(`Array out of bounds: row "${row}" is lesser than min row "0". ` + outOfBoundsMessage)
        if (col >= this.cols) throw new Error(`Array out of bounds: column "${col}" is greater than max column "${this.cols - 1}". ` + outOfBoundsMessage)
        if (row >= this.rows) throw new Error(`Array out of bounds: row "${row}" is greater than max row "${this.rows - 1}". ` + outOfBoundsMessage)

        this.#nodes[row * this.cols + col] = value;
    }

    getNode(col: number, row: number) {
        if (col < 0) throw new Error(`Array out of bounds: column "${col}" is lesser than min column "0". ` + outOfBoundsMessage)
        if (row < 0) throw new Error(`Array out of bounds: row "${row}" is lesser than min row "0". ` + outOfBoundsMessage)
        if (col >= this.cols) throw new Error(`Array out of bounds: column "${col}" is greater than max column "${this.cols - 1}". ` + outOfBoundsMessage)
        if (row >= this.rows) throw new Error(`Array out of bounds: row "${row}" is greater than max row "${this.rows - 1}". ` + outOfBoundsMessage)

        return this.#nodes[row * this.cols + col];
    }

    getNodeIndex(col: number, row: number) {
        if (col < 0) throw new Error(`Array out of bounds: column "${col}" is lesser than min column "0". ` + outOfBoundsMessage)
        if (row < 0) throw new Error(`Array out of bounds: row "${row}" is lesser than min row "0". ` + outOfBoundsMessage)
        if (col >= this.cols) throw new Error(`Array out of bounds: column "${col}" is greater than max column "${this.cols - 1}". ` + outOfBoundsMessage)
        if (row >= this.rows) throw new Error(`Array out of bounds: row "${row}" is greater than max row "${this.rows - 1}". ` + outOfBoundsMessage)

        return row * this.cols + col
    }

    getNode_XY(x: number, y: number) {
        return this.getNode(Math.floor(x / this.cellW), Math.floor(y / this.cellH))
    }

    getNodeIndex_XY(x: number, y: number) {
        return this.getNodeIndex(Math.floor(x / this.cellW), Math.floor(y / this.cellH))
    }

    #addNeighboursToNodes(addDiagonally: boolean) {
        this.#nodeNeighbours = [];
        for (let i = 0; i < this.#nodes.length; i++) {
            const col = indexToCol(i, this.cols);
            const row = indexToRow(i, this.cols)
            this.#nodeNeighbours[i] = [];
            if (row - 1 >= 0) this.#nodeNeighbours[i].push(i - this.rows);
            if (col + 1 < this.cols) this.#nodeNeighbours[i].push(i + 1);
            if (row + 1 < this.rows) this.#nodeNeighbours[i].push(i + this.rows);
            if (col - 1 >= 0) this.#nodeNeighbours[i].push(i - 1);

            if (addDiagonally) {
                if (row - 1 >= 0 && col - 1 >= 0) this.#nodeNeighbours[i].push(i - this.rows - 1);
                if (row - 1 >= 0 && col + 1 < this.cols) this.#nodeNeighbours[i].push(i - this.rows + 1);
                if (row + 1 < this.rows && col - 1 >= 0) this.#nodeNeighbours[i].push(i + this.rows - 1);
                if (row + 1 < this.rows && col + 1 < this.cols) this.#nodeNeighbours[i].push(i + this.rows + 1);
            }
        }
    }

    generate(cols = this.cols, rows = this.rows, cellW = this.cellW, cellH = this.cellH, addDiagonally = false) {
        this.#nodes = [];

        if (typeof cellW === 'number' && cellW !== this.#cellW) {
            this.#cellW = cellW
        }
        if (typeof cellH === 'number' && cellH !== this.#cellH) {
            this.#cellH = cellH
        }
        if (typeof cols === 'number' && cols !== this.#cols) {
            this.#cols = cols;
            this.#width = cellW * cols;
        }
        if (typeof rows === 'number' && rows !== this.#rows) {
            this.#rows = rows;
            this.#height = cellH * rows;
        }
        const length = rows * cols;

        for (let i = 0; i < length; i++) {
            this.#nodes.push(0)
        }

        this.#addNeighboursToNodes(addDiagonally)
    }

    toggleDiagonalNeighbours(bool: boolean) {
        this.#addNeighboursToNodes(bool)
    }
}
