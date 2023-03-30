import { createEffect, Index } from 'solid-js'
import { createSignal, Show } from 'solid-js'
import allProjects from './projects'
import './styles/projects.css'

const App = () => {
    const projects = allProjects();
    const [currentProject, setCurrentProject] = createSignal<typeof projects[0]>()
    const [preview, setPreview] = createSignal<number>();

    createEffect(() => {
        console.log('Current Project: ', currentProject());
    })

    return <div id='app'>
        <Show when={currentProject()} fallback={
            <div class='projects-container'>
                <h1>Projects</h1>
                <Show when={typeof preview() === 'number'} fallback={
                    <ul class='projects'>
                        <Index each={projects}>{(p, i) => {
                            const info = p();
                            return <li class='project-container'>
                                <button class='project' onClick={() => setPreview(i)}>
                                    <h2 class='project-title'>{info.title}</h2>
                                    <p class='project-description'>
                                        {info.description}
                                    </p>
                                </button>
                                <button class='project-enter-btn'
                                    textContent='>'
                                    onClick={() => setCurrentProject(info)}
                                />
                            </li>
                        }}
                        </Index>
                    </ul>
                }>{
                        <div id='preview'>
                            <button id='preview-exit-btn' onClick={() => setPreview()}>
                                Go Back
                            </button>
                            <div>
                                <p>{projects[preview() as number].preview.why}</p>
                            </div>
                        </div>
                    }</Show>

            </div>

        }>{
                <div id='project-container'>
                    {currentProject()!.entry}
                    <button id='project-exit-btn'
                        type='button'
                        textContent='Exit'
                        onClick={() => setCurrentProject()}
                    />
                </div>
            }
        </Show>
    </div>
}

export default App;
