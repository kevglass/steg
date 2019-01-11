/// <reference path="../Core.ts"/>

namespace steg {
    export class Bitmap implements Resource {
        image: HTMLImageElement;
        url: string;
        width: number;
        height: number;

        constructor(url: string) {
            this.url = url;
        }

        load(steg: Core, callback: (res: Resource) => void) {
            this.image = new Image();
            this.image.onload = () => {
                this.loaded();
                callback(this);
            };

            this.image.src = this.url;
        }

        loaded(): void {
            this.width = this.image.width;
            this.height = this.image.height;
        }

        drawScaled(steg: Core, x: number, y: number, width: number, height: number) {
            var ctx: CanvasRenderingContext2D = steg.ctx;

            ctx.drawImage(this.image, x, y, width, height);
        }

        draw(steg: Core, x: number, y: number) {
            var ctx: CanvasRenderingContext2D = steg.ctx;

            ctx.drawImage(this.image, x, y);
        }

        getName(): string {
            return "Bitmap [" + this.url + "]";
        }
    }
}