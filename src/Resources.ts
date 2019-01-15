/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
/// <reference path="resources/SpriteSheet.ts"/>

namespace steg {
    export class Resources {
        static added: Array<Resource> = [];
        static loaded: Array<Resource> = [];
        static lookup: any = {};

        static callback: () => void;
        static core: Core;

        static loadSpriteSheet(ref: string): SpriteSheet {
            var sheet: SpriteSheet = new SpriteSheet(ref);
            this.added.push(sheet);
            this.lookup[ref] = sheet;

            return sheet;
        }
        static loadMusic(url: string): Music {
            var music: Music = new Music(url);
            this.added.push(music);
            this.lookup[url] = music;

            return music;
        }

        static loadSound(url: string): Sound {
            var sound: Sound = new Sound(url);
            this.added.push(sound);
            this.lookup[url] = sound;

            return sound;
        }

        static laodBitmap(url: string): Bitmap {
            var bitmap: Bitmap = new Bitmap(url);
            this.added.push(bitmap);
            this.lookup[url] = bitmap;

            return bitmap;
        }

        static loadTileset(url: string, tileWidth: number, tileHeight: number): Tileset {
            var tileset: Tileset = new Tileset(url, tileWidth, tileHeight);
            this.added.push(tileset);
            this.lookup[url] = tileset;

            return tileset;
        }

        static load(core: Core, callback: () => void): void {
            this.callback = callback;
            this.core = core;

            for (var i = 0; i < this.added.length; i++) {
                this.added[i].load(this.core, (res: Resource) => { this.resourceCallback(res); });
            }
            core.drawLoadingScreen(this.loaded.length, this.added.length);

            if (this.loaded.length == this.added.length) {
                this.callback();
            }
        }

        static resourceCallback(res: Resource): void {
            console.log("Loaded: " + res.getName());
            this.loaded.push(res);

            this.core.drawLoadingScreen(this.loaded.length, this.added.length);
            if (this.loaded.length == this.added.length) {
                this.callback();
            }

        }
    }
}