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

        load(core: Core, callback: (res: Resource) => void) {
            this.image = new Image();
            this.image.onload = () => {
                this.loaded();
                callback(this);
            };
            this.image.onerror = () => {
                console.log("Failed to load: "+this.getName());
            }

            this.image.src = this.url;
        }

        loaded(): void {
            this.width = this.image.width;
            this.height = this.image.height;
        }

        drawSection(core: Core, x: number, y: number, sx: number, sy: number, width: number, height: number) {
            var ctx: CanvasRenderingContext2D = core.ctx;

            ctx.drawImage(this.image, sx, sy, width, height, x, y, width, height);
        }

        drawSectionReversed(core: Core, x: number, y: number, sx: number, sy: number, width: number, height: number) {
            var ctx: CanvasRenderingContext2D = core.ctx;

            ctx.scale(-1,1);
            ctx.drawImage(this.image, sx, sy, width, height, -x-width, y, width, height);
            ctx.scale(-1,1);
        }

        drawScaled(core: Core, x: number, y: number, width: number, height: number) {
            var ctx: CanvasRenderingContext2D = core.ctx;

            ctx.drawImage(this.image, x, y, width, height);
        }

        draw(core: Core, x: number, y: number) {
            var ctx: CanvasRenderingContext2D = core.ctx;

            ctx.drawImage(this.image, x, y);
        }

        getName(): string {
            return "Bitmap [" + this.url + "]";
        }
    }
}