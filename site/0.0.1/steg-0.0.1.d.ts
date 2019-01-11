declare namespace steg {
    class Core {
        static soundOn: boolean;
        static musicOn: boolean;
        static audioReady: boolean;
        game: Game;
        timer: any;
        fps: number;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        readyToStart: boolean;
        started: boolean;
        audioContext: AudioContext;
        startImage: Bitmap;
        constructor(canvas: HTMLCanvasElement, game: Game);
        start(): void;
        setStartImage(startImage: Bitmap): void;
        init(): void;
        doStart(): void;
        drawLoadingScreen(loaded: number, total: number): void;
        setupMouseHandler(): void;
        setSoundOn(soundOn: boolean): void;
        getSoundOn(): boolean;
        setMusicOn(musicOn: boolean): void;
        getMusicOn(): boolean;
        invokeMouseDown(id: number, x: number, y: number): void;
        invokeMouseUp(id: number, x: number, y: number): void;
        invokeMouseMove(id: number, x: number, y: number): void;
        tick(): void;
        setFontSize(size: number): void;
        drawText(txt: string, x: number, y: number, col: string): void;
        centerText(txt: string, y: number, col: string): void;
        fillRect(x: number, y: number, width: number, height: number, col: string): void;
    }
}
declare namespace steg {
    interface Game {
        init(core: Core): void;
        loaded(core: Core): void;
        render(core: Core): void;
        update(core: Core): void;
        mouseUp(core: Core, id: number, x: number, y: number): void;
        mouseDown(core: Core, id: number, x: number, y: number): void;
    }
}
declare namespace steg {
    interface Resource {
        load(steg: Core, callback: (res: Resource) => void): void;
        getName(): string;
    }
}
declare namespace steg {
    class Bitmap implements Resource {
        image: HTMLImageElement;
        url: string;
        width: number;
        height: number;
        constructor(url: string);
        load(steg: Core, callback: (res: Resource) => void): void;
        loaded(): void;
        drawScaled(steg: Core, x: number, y: number, width: number, height: number): void;
        draw(steg: Core, x: number, y: number): void;
        getName(): string;
    }
}
declare namespace steg {
    class Tileset extends Bitmap {
        tileWidth: number;
        tileHeight: number;
        scanline: number;
        constructor(url: string, tileWidth: number, tileHeight: number);
        loaded(): void;
        getName(): string;
        drawTile(steg: Core, x: number, y: number, tile: number): void;
        drawTileScaled(steg: Core, x: number, y: number, width: number, height: number, tile: number): void;
        drawTileReverse(steg: Core, x: number, y: number, tile: number): void;
    }
}
declare namespace steg {
    class Music implements Resource {
        static currentMusic: Music;
        audioBuffer: AudioBuffer;
        url: string;
        loaded: boolean;
        audioContext: AudioContext;
        lastSource: AudioBufferSourceNode;
        constructor(url: string);
        load(steg: Core, callback: (res: Resource) => void): void;
        private createSource;
        playImpl(): void;
        play(): void;
        stop(): void;
        getName(): string;
    }
}
declare namespace steg {
    class Sound implements Resource {
        audioBuffer: AudioBuffer;
        url: string;
        loaded: boolean;
        audioContext: AudioContext;
        constructor(url: string);
        load(steg: Core, callback: (res: Resource) => void): void;
        private createSource;
        play(volume: number): void;
        getName(): string;
    }
}
declare namespace steg {
    class Resources {
        static added: Array<Resource>;
        static loaded: Array<Resource>;
        static callback: () => void;
        static steg: Core;
        static loadMusic(url: string): Music;
        static loadSound(url: string): Sound;
        static laodBitmap(url: string): Bitmap;
        static loadTileset(url: string, tileWidth: number, tileHeight: number): Tileset;
        static load(steg: Core, callback: () => void): void;
        static resourceCallback(res: Resource): void;
    }
}
