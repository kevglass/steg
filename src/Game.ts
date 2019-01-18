/// <reference path="Core.ts"/>

// STEG GAME INTERFACE
namespace steg {
    export interface Game {

        init(core: Core): void;

        loaded(core: Core): void;

        started(core: Core) : void;

        render(core: Core): void;

        renderStartPage(core: Core): void;

        update(core: Core): void;

        mouseUp(core: Core, id: number, x: number, y: number): void;

        mouseDown(core: Core, id: number, x: number, y: number): void;
    }
}