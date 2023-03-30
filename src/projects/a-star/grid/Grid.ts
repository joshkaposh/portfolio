export class Grid_Node {
    id: number;
    col: number;
    row: number;
    walkable: boolean;
    neighbours: Grid_Node[];

    constructor(column: number, row: number, index: number, walkable = true) {
        this.id = index;
        this.col = column;
        this.row = row;

        this.walkable = walkable;
        this.neighbours = [];

    }

    toggleWalkable() {
        this.walkable = !this.walkable
    }

    equals(node: Grid_Node) {
        return this.id === node.id;
    }

    addNeighbours(maxCols: number, maxRows: number, getNode: (col: number, row: number) => Grid_Node, diag?: boolean) {
        console.log('GridNode', diag);

        if (this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row));
        if (this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row));
        if (this.row + 1 < maxRows) this.neighbours.push(getNode(this.col, this.row + 1));
        if (this.row - 1 >= 0) this.neighbours.push(getNode(this.col, this.row - 1));
        if (diag) {
            if (this.row - 1 >= 0 && this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row - 1));
            if (this.row - 1 >= 0 && this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row - 1));
            if (this.row + 1 < maxRows && this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row + 1));
            if (this.row + 1 < maxRows && this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row + 1));
        }
    }

}

export default class Grid {
    nodes!: Grid_Node[]
    cols!: number;
    rows!: number;
    width: number;
    height: number;
    tilesizeX: number;
    tilesizeY: number;

    constructor(cols: number, rows: number, tilesizeX: number, tilesizeY: number) {
        this.width = cols * tilesizeX;
        this.height = rows * tilesizeY;
        this.tilesizeX = tilesizeX;
        this.tilesizeY = tilesizeY;
    }

    get first() {
        return this.nodes[0]
    }


    get last() {
        return this.nodes.at(-1)!
    }

    getNode(col: number, row: number) {
        return this.nodes[row * this.cols + col];
    }

    getNodeXY(x: number, y: number) {
        return this.getNode(Math.floor(x / this.tilesizeX), Math.floor(y / this.tilesizeY))
    }

    #addNeighboursToNodes(addDiagonally?: boolean) {
        console.log('AddNeighoursToNodes', addDiagonally);

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].neighbours = [];
            this.nodes[i].addNeighbours(this.cols, this.rows, this.getNode.bind(this), addDiagonally)
        }
    }

    generate(cols: number, rows: number, addDiagonally?: boolean) {
        console.log('Generate', addDiagonally);

        this.nodes = [];
        this.cols = cols;
        this.rows = rows;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                this.nodes.push(new Grid_Node(col, row, index));
            }
        }
        this.#addNeighboursToNodes(addDiagonally);
    }

    toggleDiagonalNeighbours(bool: boolean) {
        console.log('ToggleDiag::', bool);

        this.#addNeighboursToNodes(bool)
    }
}
