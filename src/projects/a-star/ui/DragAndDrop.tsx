import { children, JSX, ParentComponent } from "solid-js"

export type DragEventType = DragEvent & {
    currentTarget: HTMLDivElement;
    target: Element;
}

const Droppable: ParentComponent<{
    class?: string
    style?: JSX.HTMLAttributes<HTMLDivElement>['style']
    onDragOver?: (e: DragEventType) => void;
    onDragLeave?: (e: DragEventType) => void;
    onDrop?: (e: DragEventType, source: HTMLElement) => void
    shouldDrop?: (nodes: Element[], source: HTMLElement) => boolean;
}> = (props) => {
    const c = children(() => props.children)

    return <div style={props.style} class={props.class}

        onDragOver={e => {
            if (props.onDragOver) props.onDragOver(e)
            console.log('ONDRAGOVER');

            e.preventDefault();
        }}
        onDragLeave={e => {
            if (props.onDragLeave) props.onDragLeave(e)
            console.log('LEAVING');

            e.preventDefault();
        }}
        onDrop={e => {
            console.log('DROPPING');

            const id = e.dataTransfer?.getData('text')!;
            const source = document.getElementById(id)!
            if (props.onDrop) props.onDrop(e, source)

            // TODO: do not append if source 'Draggable' is already in target 'Droppable'
            const nodes = Array.from(e.target.children)
            if (props.shouldDrop) {
                const shouldDrop = props.shouldDrop(nodes, source)
                if (shouldDrop) {
                    e.target.appendChild(source);
                }
            } else {
                e.target.appendChild(source);
            }

            e.preventDefault();

        }}
    >
        {c}
    </div>
}

const Draggable: ParentComponent<{ id: string }> = (props) => {
    const c = children(() => props.children);
    return <div
        id={props.id}
        draggable={true}
        onDragStart={(e) => {

            e.dataTransfer?.clearData();
            e.dataTransfer?.setData('text/plain', e.target.id)
        }}
    >
        {c}
    </div>
}

export default {
    Draggable,
    Droppable
}
