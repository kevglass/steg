/// <reference path="GameState.ts"/>

namespace steg {
    export abstract class StateBasedGame implements Game {
 
        current: GameState;

        enterState(core: Core, state: GameState) {
            this.current = state;
            this.current.enterState(core);
        }

        render(core: Core): void {
            if (this.current) {
                this.current.render(core);
            }
        }

        update(core: Core): void {
            if (this.current) {
                this.current.update(core);
            }
        }

        mouseUp(core: Core, id: number, x: number, y: number): void {
            if (this.current) {
                this.current.mouseUp(core, id, x, y);
            }
        }

        mouseDown(core: Core, id: number, x: number, y: number): void {
            if (this.current) {
                this.current.mouseDown(core, id, x, y);
            }
        }

        keyDown(core: Core, key: number): void {
            if (this.current) {
                this.current.keyDown(core, key);
            }
        }

        keyUp(core: Core, key: number): void {
            if (this.current) {
                this.current.keyUp(core, key);
            }
        }

        mouseMove(core: Core, id: number, x: number, y: number): void {
            if (this.current) {
                this.current.mouseMove(core, id, x, y);
            }
        }

        abstract init(core: Core): void;
        abstract loaded(core: Core): void;
        abstract started(core: Core): void;
        abstract renderStartPage(core: Core): void;
    }
}