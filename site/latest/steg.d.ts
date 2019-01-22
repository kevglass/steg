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
        fontSize: number;
        constructor(canvas: HTMLCanvasElement, game: Game);
        start(): void;
        init(): void;
        doStart(): boolean;
        drawLoadingScreen(loaded: number, total: number): void;
        setupMouseHandler(): void;
        setSoundOn(soundOn: boolean): void;
        getSoundOn(): boolean;
        setMusicOn(musicOn: boolean): void;
        getMusicOn(): boolean;
        invokeKeyDown(key: number): void;
        invokeKeyUp(key: number): void;
        invokeMouseDown(id: number, x: number, y: number): void;
        invokeMouseUp(id: number, x: number, y: number): void;
        invokeMouseMove(id: number, x: number, y: number): void;
        tick(): void;
        setFontSize(size: number): void;
        drawText(txt: string, x: number, y: number, col: string): void;
        centerText(txt: string, y: number, col: string): void;
        wrapTextLimited(txt: string, x: number, y: number, width: number, limit: number, col: string): void;
        wrapText(txt: string, x: number, y: number, width: number, col: string): void;
        getStringWidth(str: string): number;
        fillRect(x: number, y: number, width: number, height: number, col: string): void;
        drawRect(x: number, y: number, width: number, height: number, col: string): void;
    }
}
declare namespace steg {
    interface Game {
        init(core: Core): void;
        loaded(core: Core): void;
        started(core: Core): void;
        render(core: Core): void;
        renderStartPage(core: Core): void;
        update(core: Core): void;
        mouseUp(core: Core, id: number, x: number, y: number): void;
        mouseDown(core: Core, id: number, x: number, y: number): void;
        mouseMove(core: Core, id: number, x: number, y: number): void;
        keyDown(core: Core, key: number): void;
        keyUp(core: Core, key: number): void;
    }
}
declare namespace steg {
    class Keys {
        static LEFT: number;
        static UP: number;
        static RIGHT: number;
        static DOWN: number;
        static SPACE: number;
        static CTRL: number;
        static ALT: number;
        static CMD: number;
        static ENTER: number;
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
        margin: number;
        spacing: number;
        constructor(url: string, tileWidth: number, tileHeight: number, margin: number, spacing: number);
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
    class TiledMap implements Resource {
        url: string;
        width: number;
        height: number;
        tilesetMapping: {
            [key: string]: Tileset;
        };
        tilesets: Array<TiledMapTileset>;
        layers: Array<Array<number>>;
        constructor(url: string, tilesetMapping: {
            [key: string]: Tileset;
        });
        load(steg: Core, callback: (res: Resource) => void): void;
        parse(data: string): void;
        getName(): string;
        getTile(l: number, x: number, y: number): number;
        isValidLocation(x: number, y: number): boolean;
        draw(core: Core, x: number, y: number, sx: number, sy: number, width: number, height: number): void;
    }
    class TiledMapTileset {
        firstgid: number;
        tileset: Tileset;
        constructor(firstgid: number, tileset: Tileset);
    }
}
declare namespace steg {
    class Resources {
        static added: Array<Resource>;
        static loaded: Array<Resource>;
        static lookup: any;
        static callback: () => void;
        static core: Core;
        static loadTiledMap(url: string, tilesetMapping: {
            [key: string]: Tileset;
        }): TiledMap;
        static loadSpriteSheet(ref: string): SpriteSheet;
        static loadMusic(url: string): Music;
        static loadSound(url: string): Sound;
        static addResource(key: string, res: Resource): void;
        static laodBitmap(url: string): Bitmap;
        static loadTileset(url: string, tileWidth: number, tileHeight: number, margin: number, spacing: number): Tileset;
        static load(core: Core, callback: () => void): void;
        static resourceCallback(res: Resource): void;
    }
}
