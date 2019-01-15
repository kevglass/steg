/// <reference path="Resource.ts"/>
/// <reference path="../Resources.ts"/>
/// <reference path="../Sprite.ts"/>

namespace steg {
    export class SpriteSheet implements Resource {
        ref: string;
        bitmap: Bitmap;
        sprites: any = {};

        constructor(ref: string) {
            this.ref = ref;

            this.bitmap = Resources.laodBitmap(ref+".png");
        }

        load(core: Core, callback: (res: Resource) => void): void {
            var request = new XMLHttpRequest();
            request.open('GET', this.ref+".json", true);

            request.onload = () => {
                if (request.status == 200) {
                    var data = JSON.parse(request.responseText);
                
                    this.createSprites(data);

                    callback(this);
                }
            };
            request.onerror = (error) => { console.log(error) };
            request.send();
        }       

        getSprite(name: string) : Sprite {
            return this.sprites[name];
        }

        createSprites(data: any) : void {
            for (var name in data.frames) {
                var frameData : any = data.frames[name];
                var frame : any = frameData.frame;

                var sprite: Sprite = new Sprite(this.bitmap, frame.x, frame.y, frame.w, frame.h);
                this.sprites[name] = sprite;
            }
        }
        
        getName(): string {
            return "SpriteSheet [" + this.ref + "]";
        }


    }
}