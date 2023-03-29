import { children, Component, ParentComponent } from "solid-js";
import DragAndDrop, { DragEventType } from "./DragAndDrop";

const EditorDroppable: Component<{
    class: string,
    onDragLeave: (e: DragEventType) => void;
    onDragOver: (e: DragEventType) => void;
    onDrop: (e: DragEventType) => void;
    shouldDrop: (nodes: Element[], source: HTMLElement) => boolean;

}> = (props) => {
    return <DragAndDrop.Droppable class={props.class}
        onDragLeave={props.onDragLeave}
        onDragOver={props.onDragOver}
        onDrop={props.onDrop}
        shouldDrop={props.shouldDrop}
    />
}

const DragDropMenu: ParentComponent = (props) => {
    const { Draggable, Droppable } = DragAndDrop;

    const c = children(() => props.children)

    function onDragOver(e: DragEventType) {
        e.target.classList.add('drag-over')
    }
    function onDragLeave(e: DragEventType) {
        e.target.classList.remove('drag-over')
    }

    function onDrop(e: DragEventType) {
        e.target.classList.remove('drag-over')
    }

    function shouldDrop(nodes: Element[]) {
        return nodes.length === 0
    }

    // TODO: fix shouldDrop

    function defaultDroppable() {
        return <Droppable class='droppable top-left'
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            shouldDrop={shouldDrop}
        >
            <Draggable id='draggable'>
                {c}
            </Draggable>
        </Droppable>
    }


    return <div id='droppable-container'>
        {defaultDroppable()}
        <EditorDroppable
            class='droppable top-right'
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            shouldDrop={shouldDrop}
        />
        <EditorDroppable
            class='droppable bottom-left'
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            shouldDrop={shouldDrop}
        />
        <EditorDroppable
            class='droppable bottom-right'
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            shouldDrop={shouldDrop}
        />

    </div>
}

export default DragDropMenu