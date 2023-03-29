import { createEffect, Index } from 'solid-js'
import { createSignal, Show } from 'solid-js'
import allProjects from './projects'
import './style.css'

const App = () => {
    const [selectedProjectTitle, setSelectedProjectTitle] = createSignal<string>()
    const projects = allProjects();
    const getProject = () => {
        let item;
        if (!selectedProjectTitle()) {
            setSelectedProjectTitle()
            return;
        }
        for (let i = 0; i < projects.length; i++) {
            if (selectedProjectTitle() === projects[i].title) {
                item = projects[i]
            }
        }
        return item;
    }

    createEffect(() => {
        console.log('Current Project: ', selectedProjectTitle());
    })

    return <div id='app'>
        <Show when={selectedProjectTitle()} fallback={
            <div class='projects-container'>
                <h1>Projects</h1>
                <ul class='projects'>
                    <Index each={projects}>{(p) => {
                        const info = p();
                        return <li class='project'>
                            <button
                                textContent={info.title}
                                onClick={() => setSelectedProjectTitle(info.title)}
                            />
                        </li>
                    }}
                    </Index>
                </ul>
            </div>

        }>{
                <div id='project-container'>
                    {getProject()!.entry}
                    <button id='project-exit-btn'
                        type='button'
                        textContent='Exit'
                        onClick={() => setSelectedProjectTitle()}
                    />
                </div>
            }
        </Show>
    </div>
}

export default App;
