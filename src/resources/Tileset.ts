/// <reference path="Bitmap.ts"/>

namespace steg {

    export class Tileset extends Bitmap {
        tileWidth: number;
        tileHeight: number;
        scanline: number;

        constructor(url: string, tileWidth: number, tileHeight: number) {
            super(url);

            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
        }

        loaded(): void {
            this.scanline = Math.floor(this.image.width / this.tileWidth);
        }

        getName(): string {
            return "Tileset [" + this.url + "]";
        }

        drawTile(steg: Core, x: number, y: number, tile: number) {
            var xp: number = Math.floor(tile % this.scanline);
            var yp: number = Math.floor(tile / this.scanline);

            xp *= this.tileWidth;
            yp *= this.tileHeight;

            steg.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
        }

        drawTileScaled(steg: Core, x: number, y: number, width: number, height: number, tile: number) {
            var xp: number = Math.floor(tile % this.scanline);
            var yp: number = Math.floor(tile / this.scanline);

            xp *= this.tileWidth;
            yp *= this.tileHeight;

            steg.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, x, y, width, height);
        }

        drawTileReverse(steg: Core, x: number, y: number, tile: number) {
            var xp: number = Math.floor(tile % this.scanline);
            var yp: number = Math.floor(tile / this.scanline);

            xp *= this.tileWidth;
            yp *= this.tileHeight;

            steg.ctx.scale(-1, 1);
            steg.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, -(x + this.tileWidth), y, this.tileWidth, this.tileHeight);
            steg.ctx.scale(-1, 1);
        }
    }
}