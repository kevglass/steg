namespace steg {
    export class TiledMap implements Resource {
        url: string;
        width: number;
        height: number;
        tilesetMapping: { [key: string]: Tileset } = {};
        tilesets: Array<TiledMapTileset> = [];
        layers: Array<Array<number>> = [];

        constructor(url: string, tilesetMapping: { [key: string]: Tileset }) {
            this.url = url;
            this.tilesetMapping = tilesetMapping;
        }

        load(steg: Core, callback: (res: Resource) => void): void {
            var request = new XMLHttpRequest();
            request.open('GET', this.url, true);

            request.onload = () => {
                if (request.status == 200) {
                    this.parse(request.responseText);

                    callback(this);
                }
            };
            request.onerror = (error) => { console.log(error) };
            request.send();
        }

        parse(data: string): void {
            var parser: DOMParser = new DOMParser();
            var doc: Document = parser.parseFromString(data, "application/xml");
            var root: Element = doc.documentElement;

            var tilesets = root.getElementsByTagName("tileset");
            for (var i = 0; i < tilesets.length; i++) {
                var fg: number = parseInt(tilesets[i].getAttribute("firstgid"));
                var source: string = tilesets[i].getAttribute("source");
                var tileset: Tileset = this.tilesetMapping[source];
                if (!tileset) {
                    console.log("ERROR: Unable to locate tileset image for: " + source);
                } else {
                    var tData: TiledMapTileset = new TiledMapTileset(fg, tileset);
                    this.tilesets.push(tData);
                }
            }

            this.width = parseInt(root.getAttribute("width"));
            this.height = parseInt(root.getAttribute("height"));


            var layers = root.getElementsByTagName("layer");
            for (var i = 0; i < layers.length; i++) {
                var layerData = layers[i].getElementsByTagName("data")[0].textContent;
                var cells: Array<string> = layerData.split(",");

                var cellData: Array<number> = [];
                for (var k = 0; k < cells.length; k++) {
                    cellData.push(parseInt(cells[k]));
                }

                this.layers.push(cellData);
            }
        }

        getName(): string {
            return "TiledMap [" + this.url + "]";
        }

        getTile(l: number, x: number, y: number) : number {
            var layer : Array<number> = this.layers[l];

            return layer[x+(y * this.width)];
        }

        isValidLocation(x: number, y: number) : boolean {
            return (x >= 0) && (x < this.width) && (y > 0) && (y < this.height);
        }

        draw(core: Core, x: number, y: number, sx: number, sy: number, width: number, height: number): void {
            for (var l: number = 0; l < this.layers.length; l++) {
                var layer: Array<number> = this.layers[l];

                for (var xp: number = 0; xp < width; xp++) {
                    for (var yp: number = 0; yp < height; yp++) {
                        var tx : number = (xp+sx);
                        var ty : number = (yp+sy);

                        if ((tx < 0) || (tx >= this.width) || (ty < 0) || (ty >= this.height)) {
                            continue;
                        }

                        var t: number = layer[tx + (ty * this.width)];
                        if (t != 0) {
                            for (var n = 0; n < this.tilesets.length; n++) {
                                if (t < this.tilesets[n].firstgid) {
                                    break;
                                }
                            }

                            // get to the right tile
                            n--;
                            var tileset: Tileset = this.tilesets[n].tileset;
                            t -= this.tilesets[n].firstgid;

                            tileset.drawTile(core, x + (xp * tileset.tileWidth), y + (yp * tileset.tileHeight), t);
                        }
                    }
                }
            }
        }
    }

    class TiledMapTileset {
        firstgid: number;
        tileset: Tileset;

        constructor(firstgid: number, tileset: Tileset) {
            this.firstgid = firstgid;
            this.tileset = tileset;
        }
    }
}