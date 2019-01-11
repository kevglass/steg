/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>

namespace steg {
    export class Resources {
        static added: Array<Resource> = [];
        static loaded: Array<Resource> = [];
        static callback: () => void;
        static steg: Core;

        static loadMusic(url: string): Music {
            var music: Music = new Music(url);
            this.added.push(music);

            return music;
        }

        static loadSound(url: string): Sound {
            var sound: Sound = new Sound(url);
            this.added.push(sound);

            return sound;
        }

        static laodBitmap(url: string): Bitmap {
            var bitmap: Bitmap = new Bitmap(url);
            this.added.push(bitmap);

            return bitmap;
        }

        static loadTileset(url: string, tileWidth: number, tileHeight: number): Tileset {
            var tileset: Tileset = new Tileset(url, tileWidth, tileHeight);
            this.added.push(tileset);

            return tileset;
        }

        static load(steg: Core, callback: () => void): void {
            this.callback = callback;
            this.steg = steg;

            for (var i = 0; i < this.added.length; i++) {
                this.added[i].load(this.steg, (res: Resource) => { this.resourceCallback(res); });
            }
            steg.drawLoadingScreen(this.loaded.length, this.added.length);

            if (this.loaded.length == this.added.length) {
                this.callback();
            }
        }

        static resourceCallback(res: Resource): void {
            console.log("Loaded: " + res.getName());
            this.loaded.push(res);

            this.steg.drawLoadingScreen(this.loaded.length, this.added.length);
            if (this.loaded.length == this.added.length) {
                this.callback();
            }

        }
    }
}