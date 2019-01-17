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
        constructor(canvas: HTMLCanvasElement, game: Game);
        start(): void;
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
        renderStartPage(core: Core): void;
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
        load(core: Core, callback: (res: Resource) => void): void;
        loaded(): void;
        drawSection(core: Core, x: number, y: number, sx: number, sy: number, width: number, height: number): void;
        drawSectionReversed(core: Core, x: number, y: number, sx: number, sy: number, width: number, height: number): void;
        drawScaled(core: Core, x: number, y: number, width: number, height: number): void;
        draw(core: Core, x: number, y: number): void;
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
        drawTile(core: Core, x: number, y: number, tile: number): void;
        drawTileScaled(core: Core, x: number, y: number, width: number, height: number, tile: number): void;
        drawTileReverse(core: Core, x: number, y: number, tile: number): void;
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
        load(core: Core, callback: (res: Resource) => void): void;
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
        load(core: Core, callback: (res: Resource) => void): void;
        private createSource;
        play(volume: number): void;
        getName(): string;
    }
}
declare namespace steg {
    class Sprite {
        bitmap: Bitmap;
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(bitmap: Bitmap, x: number, y: number, width: number, height: number);
        draw(core: Core, x: number, y: number): void;
        drawReversed(core: Core, x: number, y: number): void;
    }
}
declare namespace steg {
    class SpriteSheet implements Resource {
        ref: string;
        bitmap: Bitmap;
        sprites: any;
        constructor(ref: string);
        load(core: Core, callback: (res: Resource) => void): void;
        getSprite(name: string): Sprite;
        createSprites(data: any): void;
        getName(): string;
    }
}
declare namespace steg {
    class Resources {
        static added: Array<Resource>;
        static loaded: Array<Resource>;
        static lookup: any;
        static callback: () => void;
        static core: Core;
        static loadSpriteSheet(ref: string): SpriteSheet;
        static loadMusic(url: string): Music;
        static loadSound(url: string): Sound;
        static addResource(key: string, res: Resource): void;
        static laodBitmap(url: string): Bitmap;
        static loadTileset(url: string, tileWidth: number, tileHeight: number): Tileset;
        static load(core: Core, callback: () => void): void;
        static resourceCallback(res: Resource): void;
    }
}
