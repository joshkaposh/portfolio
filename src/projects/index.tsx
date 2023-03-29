import type { JSXElement } from 'solid-js';
import AStar_EntryPoint from './a-star/EntryPoint';
import TestProject from './TestProject';
import TestProjectImg from '../assets/TestProject.jpg';

export type IProject = {
    title: string;
    description: string,
    image: string
    entry: JSXElement
}


// const EntryPoint: Component<{
//     entry: JSXElement
// }> = (props) => {

//     return props.entry
// }

export default function allProjects() {
    const aStarTitle = 'A* Pathfinding Algorithm'

    return [
        {
            title: aStarTitle,
            description: 'This project should demonstrate A*',
            image: TestProjectImg,
            entry: <AStar_EntryPoint />
        },
        {
            title: 'Second Test Project',
            description: 'This project should demonstrate collision detection',
            image: TestProjectImg,
            entry: <TestProject />
        },
        {
            title: 'Third Test Project',
            description: 'This project should demonstrate collision detection',
            image: TestProjectImg,
            entry: <TestProject />

        }

    ] as IProject[]
}
