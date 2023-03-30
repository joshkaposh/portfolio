import { Component } from 'solid-js'
import Menu from './ui/Menu'
import DragDropMenu from './ui/DragDropMenu'
import "./style.css"

const ProjectEntryPoint: Component = () => {
    let cRef: HTMLCanvasElement;

    return <div id='main-container'>
        <canvas ref={cRef!} id='canvas' />
        <DragDropMenu>
            <Menu canvas={cRef!} />
        </DragDropMenu>
    </div>


}

export default ProjectEntryPoint