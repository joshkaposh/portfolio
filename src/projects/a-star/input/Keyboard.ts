import PubSub from "../event-delegation/Pubsub"

export type KeyboardEventTypes = 'Keydown' | 'Keyup' | 'Keyheld'

export default class Keyboard extends PubSub<KeyboardEventTypes> {
    #keys = new Map<string, boolean>();
    #lastKey: string | null = null;

    static #instance: Keyboard;
    static instance() {
        if (!Keyboard.#instance) {
            Keyboard.#instance = new Keyboard();
        }
        return Keyboard.#instance;
    }

    private constructor() {
        super(['Keydown', 'Keyup', 'Keyheld',])
        window.addEventListener("keydown", this.#keydown.bind(this));
        window.addEventListener("keyup", this.#keyup.bind(this));
    }

    cleanup() {
        window.removeEventListener("keydown", this.#keydown);
        window.removeEventListener("keyup", this.#keyup);
    }

    onKeydown(key: string, fn: (data: any) => void) {
        return this.subscribe('Keydown', [fn, key])
    }

    onKeyup(key: string, fn: () => void) {
        return this.subscribe('Keyup', [fn, key])

    }

    onKeyheld(key: string, fn: () => void) {
        return this.subscribe('Keyheld', [fn, key])
    }

    // Todo: implement
    // ? whenever user starts typing check to see if keystroke matches keybind
    // ? Ex: If ( key === startOfKeybind )
    // ?        [ keep listening ]
    // ?     Else [ stop listening ]

    // onKeybind(keys:string[] = [keybindStarter, ...],fn:() => void) {
    //* calls fn when all keys are pressed AND match key order for keybind
    // }


    #keydown(e: KeyboardEvent) {
        if (!this.#keys.has(e.code)) {
            this.notify('Keydown', e.code)
        }
        this.#keys.set(e.code, true)
        this.#lastKey = e.code;

        setTimeout(() => {
            if (this.#keys.has(e.code)) {
                this.notify('Keyheld', e.code)
            }
        }, 1)

    }

    #keyup(e: KeyboardEvent) {
        this.#keys.delete(e.code)
        this.notify('Keyup', e.code)
    }

    isPressed(key: string) {
        return this.#keys.has(key)
    }


    get shiftPressed() {
        return this.#keys.has('ShiftLeft') || this.#keys.has('ShiftRight')
    }

    get lastKey() {
        return this.#lastKey;
    }
}
