import type { IProject } from '../projects';
import type { Component } from 'solid-js';
import { Index } from 'solid-js';

const Projects: Component<{
    projects: IProject[]
    select: (type: string) => void;

}> = (props) => {
    return <ul class='projects'>
        <Index each={props.projects}>{(item) => {
            const info = item();
            return <li >
                <button class='project' type='button' onClick={(e) => {
                    e.preventDefault();
                    props.select(info.title)

                }}>
                    <div class='project-image-container'>
                        <img class='project-image' src={info.image} alt="Test Project Image Cover" loading='lazy' />
                    </div>
                    <div class='project-info'>
                        <h2>{info.title}</h2>
                        <p>{info.description}</p>
                    </div>
                </button>
            </li>
        }}</Index>
    </ul>
}

export default Projects;