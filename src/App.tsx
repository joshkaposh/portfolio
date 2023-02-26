import type { Component } from 'solid-js'
import { createSignal, Show } from 'solid-js'
import allProjects, { IProject } from './projects'
import Projects from './components/Projects'
import './style.css'

const ViewProject: Component<{
    exit: () => void;
    info: () => IProject
}> = (props) => {
    const [info, element] = props.info();

    return <div class='view-project'>
        <button type='button' onClick={props.exit}><h1>Exit {info.title}</h1></button>
        <p>{info.description}</p>
        {element}
    </div>
}


const App = () => {
    const [project, _setProject] = createSignal<IProject | undefined>()
    const setProject = (type?: string) => {
        let item: IProject | undefined;
        for (let i = 0; i < allProjects.length; i++) {
            console.log(allProjects[i]);

            if (allProjects[i][0].title === type) {
                item = allProjects[i];
            }
        }
        return _setProject(item);

    }

    return <div id='app'>
        <Show when={project()} fallback={
            <div class='projects-container'>
                <h1>Projects</h1>
                <Projects projects={allProjects} select={(type) => {
                    setProject(type)
                }} />
            </div>

        }>{() => {
            return <ViewProject exit={() => setProject()} info={() => project()!} />
        }}

        </Show>
    </div>
}

export default App;
