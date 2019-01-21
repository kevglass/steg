/// <reference path="Bitmap.ts"/>

namespace steg {

    export class Tileset extends Bitmap {
        tileWidth: number;
        tileHeight: number;
        scanline: number;
        margin: number = 0;
        spacing: number = 0;

        constructor(url: string, tileWidth: number, tileHeight: number, margin: number, spacing: number) {
            super(url);

            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.margin = margin;
            this.spacing = spacing;
        }

        loaded(): void {
            this.scanline = Math.floor(this.image.width) / (this.tileWidth + this.spacing);
        }

        getName(): string {
            return "Tileset [" + this.url + "]";
        }

        drawTile(core: Core, x: number, y: number, tile: number) {
            var xp: number = Math.floor(tile % this.scanline);
            var yp: number = Math.floor(tile / this.scanline);

            xp *= this.tileWidth + this.spacing;
            yp *= this.tileHeight + this.spacing;

            core.ctx.drawImage(this.image, xp + this.margin, yp + this.margin, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
        }

        drawTileScaled(core: Core, x: number, y: number, width: number, height: number, tile: number) {
            var xp: number = Math.floor(tile % this.scanline);
            var yp: number = Math.floor(tile / this.scanline);

            xp *= this.tileWidth + this.spacing;
            yp *= this.tileHeight + this.spacing;

            core.ctx.drawImage(this.image, xp + this.margin, yp + this.margin, this.tileWidth, this.tileHeight, x, y, width, height);
        }

        drawTileReverse(core: Core, x: number, y: number, tile: number) {
            var xp: number = Math.floor(tile % this.scanline);
            var yp: number = Math.floor(tile / this.scanline);

            xp *= this.tileWidth;
            yp *= this.tileHeight;

            core.ctx.scale(-1, 1);
            core.ctx.drawImage(this.image, xp + this.margin, yp + this.margin, this.tileWidth, this.tileHeight, -(x + this.tileWidth), y, this.tileWidth, this.tileHeight);
            core.ctx.scale(-1, 1);
        }
    }
}