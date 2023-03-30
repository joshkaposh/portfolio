import AStar_EntryPoint from './a-star/ProjectEntryPoint';
import TestProject from './ProjectPlaceholder';
import TestProjectImg from '../assets/TestProject.jpg';

const WHY = 'this should explain why I decided to code this particular project: Use cases, what I learned, etc'

export default function allProjects() {
    const aStarTitle = 'A* Pathfinding Algorithm'

    return [
        {
            title: aStarTitle,
            description: 'Demonstrates A* Pathfinding algorithm',
            preview: {
                why: WHY
            },
            image: TestProjectImg,
            entry: <AStar_EntryPoint />
        },
        {
            title: 'Aspect Ratio / Resolution',
            description: 'Preserves aspect ratio across different screen sizes',
            preview: {
                why: WHY
            },
            image: TestProjectImg,
            entry: <TestProject />
        },
        {
            title: 'Grid',
            description: 'A grid that can be used for tilemaps, A* traversal, or other grid operations ',
            preview: {
                why: WHY
            },
            image: TestProjectImg,
            entry: <TestProject />
        },
        {
            title: 'Collision detection',
            description: 'General-purpose AABB collision detection',
            preview: {
                why: WHY
            },
            image: TestProjectImg,
            entry: <TestProject />
        }

    ]
}
