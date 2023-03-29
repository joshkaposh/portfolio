import { Component, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import A_Star from '../grid/A_star'
import Grid from '../grid/Grid'
import initialize_renderer from '../render/Render'
import Keyboard from '../input/Keyboard'
import Mouse from '../input/Mouse'

// type KeyBindTypes = "KeyW" | 'KeyS' | "KeyE" | 'KeyF';
type GridNode = Grid['first']

function render_path(ctx: CanvasRenderingContext2D, result: ReturnType<A_Star['find_path']>, sX: number, sY: number) {
    if (result) {
        ctx.fillStyle = 'lightgreen';

        for (let i = 0; i < result.length; i++) {
            const node = result[i];
            ctx.fillRect(node.col * sX, node.row * sY, sX, sY)

        }
    }
}
function render_start_end(ctx: CanvasRenderingContext2D, start_node: GridNode, end_node: GridNode, sX: number, sY: number) {
    ctx.fillStyle = 'green';
    ctx.fillRect(start_node.col * sX, start_node.row * sY, sX, sY)

    ctx.fillStyle = 'red';
    ctx.fillRect(end_node.col * sX, end_node.row * sY, sX, sY)
}


function render_nodes(ctx: CanvasRenderingContext2D, grid: Grid, sX: number, sY: number) {
    const { nodes } = grid;

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        ctx.beginPath();
        ctx.rect(node.col * sX, node.row * sY, sX, sY)
        if (!node.walkable) {
            ctx.fillStyle = 'black'
            ctx.fill()
        }
        ctx.stroke();
        ctx.closePath();
    }
}

const Menu: Component<{
    canvas: HTMLCanvasElement
}> = (props) => {

    const defaultCols = 10, defaultRows = 10;
    const keyboard = Keyboard.instance();
    const mouse = Mouse.instance();
    const modes = ['none', 'obstacle', 'start', 'end', 'path'] as const;
    const colors = ['none', 'grey', 'green', 'red', 'lightgreen'] as const;
    let color: string;

    const [mode, set_mode] = createSignal<keyof typeof modes>(0)

    const switchMode = (m: keyof typeof modes) => {
        if (m === mode()) {
            set_mode(0)
            return;
        }
        set_mode(m);
        color = colors[m] as string
    }

    const [context, set_context] = createSignal<CanvasRenderingContext2D>()

    const [cols, set_cols] = createSignal(defaultCols)
    const [rows, set_rows] = createSignal(defaultRows)

    const [width, set_width] = createSignal(Math.floor(window.innerWidth))
    const [height, set_height] = createSignal(Math.floor(window.innerHeight))
    const [tilesize_x, set_tilesize_x] = createSignal(width() / cols())
    const [tilesize_y, set_tilesize_y] = createSignal(height() / cols())

    const setWidth = (num: number) => {
        set_width(num);
        set_tilesize_x(num / cols())
    }
    const setHeight = (num: number) => {
        set_height(num);
        set_tilesize_y(num / rows())
    }

    const grid = new Grid(cols(), rows(), tilesize_x(), tilesize_y())
    const [diagonal, set_diagonal] = createSignal(false)

    const generate = () => {
        grid.generate(cols(), rows(), diagonal())
        console.log('generate::', diagonal(), grid.nodes);
    }

    const a_star = new A_Star();
    const [result, set_result] = createSignal<ReturnType<A_Star['find_path']>>()
    const [positions, set_positions] = createStore<{ start_node: Grid['first'] | null; end_node: Grid['first'] | null }>({
        start_node: null,
        end_node: null
    })
    const findPath = () => set_result(a_star.find_path(positions.start_node!, positions.end_node!))

    const [selected_node, set_selected_node] = createSignal<ReturnType<Grid['getNode']>>()

    const draw = initialize_renderer(() => {
        const ctx = context()!
        const tX = tilesize_x();
        const tY = tilesize_y();
        const path = result();

        ctx.clearRect(0, 0, width(), height())

        if (path) {
            render_path(ctx, path, tX, tY)
        }
        render_start_end(ctx, positions.start_node!, positions.end_node!, tX, tY)

        const sNode = selected_node()
        if (sNode && mode() !== 0 && mode() !== 4) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(sNode.col * tX, sNode.row * tY, tX, tY)
        }
        // const rect = ctx.canvas.getBoundingClientRect();

        // ctx.fillRect(mouse.x - rect.left, mouse.y - rect.top, 10, 10)

        // const node = grid.getNodeXY(mouse.x, mouse.y)
        // ctx.fillRect(node.col * tilesize_x(), node.row * tilesize_y(), tilesize_x(), tilesize_y())

        render_nodes(ctx, grid, tilesize_x(), tilesize_y())
    })

    onMount(() => {
        window.addEventListener('resize', resize_canvas)
        window.addEventListener('mousemove', mousemove)
        window.addEventListener('keydown', keydown)
        window.addEventListener('mousedown', mousedown)
        console.log('onMount::', props.canvas);

        resize_canvas();
        generate();
        set_positions('start_node', grid.first)
        set_positions('end_node', grid.last)

        draw.start();
    })

    onCleanup(() => {
        window.removeEventListener('resize', resize_canvas)
        window.removeEventListener('mousemove', mousemove)
        window.removeEventListener('keydown', keydown)
        window.removeEventListener('mousedown', mousedown)

        keyboard.cleanup();
    })

    createEffect(on(diagonal, (b) => {
        grid.toggleDiagonalNeighbours(b)
    }, { defer: true }))

    createEffect((firstRun) => {
        if (cols() || rows()) {
            if (firstRun !== true) {
                resize_canvas()
                generate()
            }
        }

    }, true)

    createEffect(() => {
        if (height() || width()) {
            resize_canvas()
            grid.generate(cols(), rows(), diagonal())
        }
    })


    function withinCanvas(x: number, y: number) {

        return x >= 0 && y >= 0 && x <= width() && y <= height()
    }

    const getNodeFromMousePos = () => {
        const rect = props.canvas.getBoundingClientRect();
        const new_x = mouse.x - rect.left;
        const new_y = mouse.y - rect.top;

        if (
            !withinCanvas(new_x, new_y)
        ) {
            set_selected_node()
            return;
        }
        set_selected_node(grid.getNodeXY(mouse.x, mouse.y))

    }

    function resize_canvas() {
        const c = props.canvas
        setWidth(Math.floor(window.innerWidth));
        setHeight(Math.floor(window.innerHeight));
        c.width = width();
        c.height = height();
        console.log(width(), c.width);

        c.style.width = `${width()}px`;
        c.style.height = `${height()}px`;
        set_context(c.getContext('2d')!)
    }

    function keydown() {
        if (keyboard.lastKey === 'Escape') {
            switchMode(0);
            return;
        }

        if (keyboard.shiftPressed) {
            if (keyboard.lastKey === 'KeyW') {
                switchMode(1)
            }
            if (keyboard.lastKey === 'KeyS') {
                switchMode(2)
            }
            if (keyboard.lastKey === 'KeyE') {
                switchMode(3)
            }
        }

    }

    function mousemove(e: MouseEvent) {
        // console.log(mouse.x, mouse.y);

        getNodeFromMousePos();
    }

    function mousedown() {
        let n = selected_node()!
        if (n) {
            switch (mode()) {
                case 1:
                    n.toggleWalkable()
                    break;
                case 2:
                    set_positions('start_node', n)
                    break;
                case 3:
                    set_positions('end_node', n)
                    break;

                    break;
                default:
                    break;
            }

        }
    }

    return <div id='menu'>
        <div>
            <button onClick={() => switchMode(1)}>
                Obstacles
            </button>
            <button onClick={() => switchMode(2)}>
                Start Position
            </button>
            <button onClick={() => switchMode(3)}>
                End Position
            </button>
        </div>
        <div>
            <button onClick={() => set_diagonal(!diagonal())}>
                Travel Diagonal
            </button>
            <button onClick={findPath}>
                Reset Path
            </button>

        </div>
        <div class='menu-input'>
            <label>Columns:</label>
            <input type="number" min={1} value={defaultCols} onChange={(e) => {
                set_cols(parseInt(e.currentTarget.value))
            }} />

        </div>
        <div class='menu-input'>
            <label>Rows:</label>
            <input type="number" min={1} value={defaultRows} onChange={(e) => {
                set_rows(parseInt(e.currentTarget.value))
            }} />
        </div>
    </div>
}

export default Menu