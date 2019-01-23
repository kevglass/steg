namespace steg {
    export interface GameState {

        init(core: Core): void;

        enterState(core: Core): void;

        leaveState(core: Core): void;
        
        render(core: Core): void;

        update(core: Core): void;

        mouseUp(core: Core, id: number, x: number, y: number): void;

        mouseDown(core: Core, id: number, x: number, y: number): void;

        keyDown(core: Core, key: number): void;

        keyUp(core: Core, key: number): void;

        mouseMove(core: Core, id: number, x: number, y: number): void;
    }
}