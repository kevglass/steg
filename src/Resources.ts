/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
/// <reference path="resources/SpriteSheet.ts"/>
/// <reference path="resources/TiledMap.ts"/>

namespace steg {
    export class Resources {
        static added: Array<Resource> = [];
        static loaded: Array<Resource> = [];
        static lookup: any = {};

        static callback: () => void;
        static core: Core;

        static loadTiledMap(url: string, tilesetMapping: { [key: string]: Tileset }): TiledMap {
            var map: TiledMap = new TiledMap(url, tilesetMapping);
            this.addResource(url, map);

            return map;
        }

        static loadSpriteSheet(ref: string): SpriteSheet {
            var sheet: SpriteSheet = new SpriteSheet(ref);
            this.addResource(ref, sheet);

            return sheet;
        }

        static loadMusic(url: string): Music {
            var music: Music = new Music(url);
            this.addResource(url, music);

            return music;
        }

        static loadSound(url: string): Sound {
            var sound: Sound = new Sound(url);
            this.addResource(url, sound);

            return sound;
        }

        static addResource(key: string, res: Resource) {
            this.added.push(res);
            this.lookup[key] = res;
        }

        static laodBitmap(url: string): Bitmap {
            var bitmap: Bitmap = new Bitmap(url);
            this.addResource(url, bitmap);

            return bitmap;
        }

        static loadTileset(url: string, tileWidth: number, tileHeight: number, margin: number, spacing: number): Tileset {
            var tileset: Tileset = new Tileset(url, tileWidth, tileHeight, margin, spacing);
            this.addResource(url, tileset);

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