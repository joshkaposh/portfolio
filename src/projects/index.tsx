import type { JSXElement } from 'solid-js';
import TestProject from './TestProject';
import TestProjectImg from '../assets/TestProject.jpg';
export type IProject = [{ title: string; description: string, image: string }, JSXElement]

export default [
    [{
        title: 'TestProject',
        description: 'This project should demonstrate A*',
        image: TestProjectImg
    }, <TestProject />
    ],
    [{
        title: 'Second Test Project',
        description: 'This project should demonstrate collision detection',
        image: TestProjectImg
    }, <TestProject />
    ],
    [{
        title: 'Third Test Project',
        description: 'This project should demonstrate collision detection',
        image: TestProjectImg
    }, <TestProject />
    ]
] as IProject[]
