/// <reference path="resources/Bitmap.ts"/>

namespace steg {

    export class Sprite {
        bitmap: Bitmap;
        x: number;
        y: number;
        width: number;
        height: number;

        constructor(bitmap: Bitmap, x: number, y: number, width: number, height: number) {
            this.bitmap = bitmap;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        draw(core: Core, x: number, y: number) {
            this.bitmap.drawSection(core, x, y, this.x, this.y, this.width, this.height);
        }
    }
}