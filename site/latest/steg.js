var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// SIMPLE TYPESCRIPT ENGINE FOR GAMES
var steg;
// SIMPLE TYPESCRIPT ENGINE FOR GAMES
(function (steg) {
    var Core = /** @class */ (function () {
        function Core(canvas, game) {
            this.fps = 20;
            this.readyToStart = false;
            this.started = false;
            this.fontSize = 16;
            this.game = game;
            this.canvas = canvas;
        }
        Core.prototype.start = function () {
            this.init();
        };
        Core.prototype.init = function () {
            var _this = this;
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                console.log("Audio Context Being Created");
                this.audioContext = new AudioContext();
            }
            else {
                console.log("No Audio Context found");
            }
            this.setupMouseHandler();
            this.ctx = this.canvas.getContext("2d");
            this.game.init(this);
            steg.Resources.load(this, function () {
                _this.game.loaded(_this);
                _this.readyToStart = true;
            });
        };
        Core.prototype.doStart = function () {
            if (this.readyToStart) {
                if (!this.started) {
                    if (this.audioContext) {
                        this.audioContext.resume();
                    }
                    Core.audioReady = true;
                    if (steg.Music.currentMusic) {
                        steg.Music.currentMusic.play();
                    }
                    this.started = true;
                    this.game.started(this);
                    return true;
                }
            }
            return false;
        };
        Core.prototype.drawLoadingScreen = function (loaded, total) {
            var _this = this;
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.fillRect(0, 0, this.canvas.width, this.canvas.height, "#000000");
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.font = "20px Helvetica";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Loading " + loaded + "/" + total, this.canvas.width / 2, (this.canvas.height / 2) - 30);
            var barWidth = 100;
            this.fillRect((this.canvas.width - barWidth) / 2, this.canvas.height / 2, barWidth, 5, "#555555");
            this.fillRect((this.canvas.width - barWidth) / 2, this.canvas.height / 2, barWidth * (loaded / total), 5, "#00FFFF");
            if (total == loaded) {
                this.timer = setInterval(function () { _this.tick(); }, 1000 / this.fps);
            }
        };
        Core.prototype.setupMouseHandler = function () {
            var _this = this;
            var hasTouchStartEvent = 'ontouchstart' in document.createElement('div');
            if (!hasTouchStartEvent) {
                this.canvas.onmousedown = function (e) {
                    e.preventDefault();
                    _this.invokeMouseDown(1, e.offsetX, e.offsetY);
                };
                this.canvas.onmouseup = function (e) {
                    e.preventDefault();
                    _this.invokeMouseUp(1, e.offsetX, e.offsetY);
                };
                this.canvas.onmousemove = function (e) {
                    e.preventDefault();
                    _this.invokeMouseMove(1, e.offsetX, e.offsetY);
                };
                document.onkeyup = function (e) {
                    e.preventDefault();
                    _this.invokeKeyUp(e.keyCode);
                };
                document.onkeydown = function (e) {
                    e.preventDefault();
                    _this.invokeKeyDown(e.keyCode);
                };
            }
            else {
                this.canvas.ontouchstart = function (e) {
                    e.preventDefault();
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        _this.invokeMouseDown(e.changedTouches.item(i).identifier, e.changedTouches.item(i).pageX, e.changedTouches.item(i).pageY);
                    }
                };
                this.canvas.ontouchend = function (e) {
                    e.preventDefault();
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        _this.invokeMouseUp(e.changedTouches.item(i).identifier, e.changedTouches.item(i).pageX, e.changedTouches.item(i).pageY);
                    }
                };
                this.canvas.ontouchmove = function (e) {
                    e.preventDefault();
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        _this.invokeMouseUp(e.changedTouches.item(i).identifier, e.changedTouches.item(i).pageX, e.changedTouches.item(i).pageY);
                    }
                };
                document.onkeyup = function (e) {
                    e.preventDefault();
                    _this.invokeKeyUp(e.keyCode);
                };
                document.onkeydown = function (e) {
                    e.preventDefault();
                    _this.invokeKeyDown(e.keyCode);
                };
            }
        };
        Core.prototype.setSoundOn = function (soundOn) {
            if (!this.audioContext) {
                return;
            }
            Core.soundOn = soundOn;
        };
        Core.prototype.getSoundOn = function () {
            if (!this.audioContext) {
                return false;
            }
            return Core.soundOn;
        };
        Core.prototype.setMusicOn = function (musicOn) {
            if (!this.audioContext) {
                return;
            }
            Core.musicOn = musicOn;
            if (steg.Music.currentMusic) {
                if (musicOn) {
                    steg.Music.currentMusic.play();
                }
                else {
                    steg.Music.currentMusic.stop();
                }
            }
        };
        Core.prototype.getMusicOn = function () {
            if (!this.audioContext) {
                return false;
            }
            return Core.musicOn;
        };
        Core.prototype.invokeKeyDown = function (key) {
            if (this.doStart()) {
                return;
            }
            this.game.keyDown(this, key);
        };
        Core.prototype.invokeKeyUp = function (key) {
            if (this.doStart()) {
                return;
            }
            this.game.keyUp(this, key);
        };
        Core.prototype.invokeMouseDown = function (id, x, y) {
            if (this.doStart()) {
                return;
            }
            this.game.mouseDown(this, id + 1, x, y);
        };
        Core.prototype.invokeMouseUp = function (id, x, y) {
            if (this.doStart()) {
                return;
            }
            this.game.mouseUp(this, id + 1, x, y);
        };
        Core.prototype.invokeMouseMove = function (id, x, y) {
            this.game.mouseMove(this, id + 1, x, y);
        };
        Core.prototype.tick = function () {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            if (this.started) {
                this.game.update(this);
                this.game.render(this);
            }
            else {
                this.game.renderStartPage(this);
            }
        };
        Core.prototype.setFontSize = function (size) {
            this.ctx.font = size + "px Helvetica";
            this.fontSize = size;
        };
        Core.prototype.drawText = function (txt, x, y, col) {
            this.ctx.fillStyle = col;
            this.ctx.fillText(txt, x, y);
        };
        Core.prototype.centerText = function (txt, y, col) {
            this.ctx.fillStyle = col;
            this.ctx.textAlign = "center";
            this.ctx.fillText(txt, this.canvas.width / 2, y);
        };
        Core.prototype.wrapTextLimited = function (txt, x, y, width, limit, col) {
            var words = txt.split(" ");
            var line = "";
            var yp = 0;
            var total = 0;
            for (var i = 0; i < words.length; i++) {
                if (this.getStringWidth(line + " " + words[i]) > width) {
                    var str = line;
                    if (total + str.length > limit) {
                        var remaining = (limit - total) + 1;
                        str = str.substring(0, remaining);
                    }
                    this.drawText(str, x, y + yp, col);
                    yp += this.fontSize + 4;
                    total += line.length;
                    if (total > limit) {
                        break;
                    }
                    line = "";
                }
                line += " " + words[i];
            }
            if (total < limit) {
                var str = line;
                if (total + str.length > limit) {
                    var remaining = (limit - total + 1);
                    str = str.substring(0, remaining);
                }
                this.drawText(str, x, y + yp, col);
            }
        };
        Core.prototype.wrapText = function (txt, x, y, width, col) {
            var words = txt.split(" ");
            var line = "";
            var yp = 0;
            for (var i = 0; i < words.length; i++) {
                if (this.getStringWidth(line + " " + words[i]) > width) {
                    this.drawText(line, x, y + yp, col);
                    yp += this.fontSize + 4;
                    line = "";
                }
                line += " " + words[i];
            }
            this.drawText(line, x, y + yp, col);
        };
        Core.prototype.getStringWidth = function (str) {
            return this.ctx.measureText(str).width;
        };
        Core.prototype.fillRect = function (x, y, width, height, col) {
            this.ctx.fillStyle = col;
            this.ctx.fillRect(x, y, width, height);
        };
        Core.prototype.drawRect = function (x, y, width, height, col) {
            this.ctx.strokeStyle = col;
            this.ctx.strokeRect(x, y, width, height);
        };
        Core.soundOn = true;
        Core.musicOn = true;
        Core.audioReady = false;
        return Core;
    }());
    steg.Core = Core;
})(steg || (steg = {}));
/// <reference path="Core.ts"/>
var steg;
(function (steg) {
    var Keys = /** @class */ (function () {
        function Keys() {
        }
        Keys.LEFT = 37;
        Keys.UP = 38;
        Keys.RIGHT = 39;
        Keys.DOWN = 40;
        Keys.SPACE = 32;
        Keys.CTRL = 17;
        Keys.ALT = 18;
        Keys.CMD = 91;
        Keys.ENTER = 13;
        return Keys;
    }());
    steg.Keys = Keys;
})(steg || (steg = {}));
/// <reference path="../Core.ts"/>
var steg;
/// <reference path="../Core.ts"/>
(function (steg) {
    var Bitmap = /** @class */ (function () {
        function Bitmap(url) {
            this.url = url;
        }
        Bitmap.prototype.load = function (core, callback) {
            var _this = this;
            this.image = new Image();
            this.image.onload = function () {
                _this.loaded();
                callback(_this);
            };
            this.image.onerror = function () {
                console.log("Failed to load: " + _this.getName());
            };
            this.image.src = this.url;
        };
        Bitmap.prototype.loaded = function () {
            this.width = this.image.width;
            this.height = this.image.height;
        };
        Bitmap.prototype.drawSection = function (core, x, y, sx, sy, width, height) {
            var ctx = core.ctx;
            ctx.drawImage(this.image, sx, sy, width, height, x, y, width, height);
        };
        Bitmap.prototype.drawSectionReversed = function (core, x, y, sx, sy, width, height) {
            var ctx = core.ctx;
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sx, sy, width, height, -x - width, y, width, height);
            ctx.scale(-1, 1);
        };
        Bitmap.prototype.drawScaled = function (core, x, y, width, height) {
            var ctx = core.ctx;
            ctx.drawImage(this.image, x, y, width, height);
        };
        Bitmap.prototype.draw = function (core, x, y) {
            var ctx = core.ctx;
            ctx.drawImage(this.image, x, y);
        };
        Bitmap.prototype.getName = function () {
            return "Bitmap [" + this.url + "]";
        };
        return Bitmap;
    }());
    steg.Bitmap = Bitmap;
})(steg || (steg = {}));
/// <reference path="Bitmap.ts"/>
var steg;
/// <reference path="Bitmap.ts"/>
(function (steg) {
    var Tileset = /** @class */ (function (_super) {
        __extends(Tileset, _super);
        function Tileset(url, tileWidth, tileHeight, margin, spacing) {
            var _this = _super.call(this, url) || this;
            _this.margin = 0;
            _this.spacing = 0;
            _this.tileWidth = tileWidth;
            _this.tileHeight = tileHeight;
            _this.margin = margin;
            _this.spacing = spacing;
            return _this;
        }
        Tileset.prototype.loaded = function () {
            this.scanline = Math.floor(this.image.width) / (this.tileWidth + this.spacing);
        };
        Tileset.prototype.getName = function () {
            return "Tileset [" + this.url + "]";
        };
        Tileset.prototype.drawTile = function (core, x, y, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth + this.spacing;
            yp *= this.tileHeight + this.spacing;
            core.ctx.drawImage(this.image, xp + this.margin, yp + this.margin, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
        };
        Tileset.prototype.drawTileScaled = function (core, x, y, width, height, tile, alpha) {
            if (alpha === void 0) { alpha = 1; }
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth + this.spacing;
            yp *= this.tileHeight + this.spacing;
            if (alpha != 1) {
                core.ctx.globalAlpha = alpha;
            }
            core.ctx.drawImage(this.image, xp + this.margin, yp + this.margin, this.tileWidth, this.tileHeight, x, y, width, height);
            if (alpha != 1) {
                core.ctx.globalAlpha = 1;
            }
        };
        Tileset.prototype.drawTileReverse = function (core, x, y, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth;
            yp *= this.tileHeight;
            core.ctx.scale(-1, 1);
            core.ctx.drawImage(this.image, xp + this.margin, yp + this.margin, this.tileWidth, this.tileHeight, -(x + this.tileWidth), y, this.tileWidth, this.tileHeight);
            core.ctx.scale(-1, 1);
        };
        return Tileset;
    }(steg.Bitmap));
    steg.Tileset = Tileset;
})(steg || (steg = {}));
/// <reference path="../Core.ts"/>
/// <reference path="Resource.ts"/>
var steg;
/// <reference path="../Core.ts"/>
/// <reference path="Resource.ts"/>
(function (steg) {
    var Music = /** @class */ (function () {
        function Music(url) {
            this.loaded = false;
            this.url = url;
        }
        Music.prototype.load = function (core, callback) {
            var _this = this;
            if (!core.audioContext) {
                console.log("No audio context. No Sound");
                callback(this);
            }
            else {
                this.audioContext = core.audioContext;
                var request = new XMLHttpRequest();
                request.open('GET', this.url, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    core.audioContext.decodeAudioData(request.response, function (audioBuffer) {
                        _this.audioBuffer = audioBuffer;
                        callback(_this);
                    });
                };
                request.onerror = function (error) { console.log(error); };
                request.send();
            }
        };
        Music.prototype.createSource = function (volume) {
            var bufferSource = this.audioContext.createBufferSource();
            bufferSource.buffer = this.audioBuffer;
            var gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume;
            gainNode.connect(this.audioContext.destination);
            bufferSource.connect(gainNode);
            this.lastSource = bufferSource;
            return bufferSource;
        };
        Music.prototype.playImpl = function () {
            if ((steg.Core.musicOn) && (steg.Core.audioReady)) {
                if (this.audioBuffer) {
                    var source = this.createSource(1.0);
                    source.loop = true;
                    source.start();
                }
            }
        };
        Music.prototype.play = function () {
            if (Music.currentMusic) {
                Music.currentMusic.stop();
            }
            Music.currentMusic = this;
            this.playImpl();
        };
        Music.prototype.stop = function () {
            if (this.lastSource) {
                this.lastSource.stop();
                this.lastSource = null;
            }
        };
        Music.prototype.getName = function () {
            return "Music [" + this.url + "]";
        };
        return Music;
    }());
    steg.Music = Music;
})(steg || (steg = {}));
/// <reference path="Resource.ts"/>
var steg;
/// <reference path="Resource.ts"/>
(function (steg) {
    var Sound = /** @class */ (function () {
        function Sound(url) {
            this.loaded = false;
            this.url = url;
        }
        Sound.prototype.load = function (core, callback) {
            var _this = this;
            if (!core.audioContext) {
                console.log("No audio context. No Sound");
                callback(this);
            }
            else {
                this.audioContext = core.audioContext;
                var request = new XMLHttpRequest();
                request.open('GET', this.url, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    core.audioContext.decodeAudioData(request.response, function (audioBuffer) {
                        _this.audioBuffer = audioBuffer;
                        callback(_this);
                    });
                };
                request.onerror = function (error) { console.log(error); };
                request.send();
            }
        };
        Sound.prototype.createSource = function (volume) {
            var bufferSource = this.audioContext.createBufferSource();
            bufferSource.buffer = this.audioBuffer;
            var gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume;
            gainNode.connect(this.audioContext.destination);
            bufferSource.connect(gainNode);
            return bufferSource;
        };
        Sound.prototype.play = function (volume) {
            if ((steg.Core.soundOn) && (steg.Core.audioReady)) {
                if (this.audioBuffer) {
                    var source = this.createSource(volume);
                    source.loop = false;
                    source.start();
                }
            }
        };
        Sound.prototype.getName = function () {
            return "Sound [" + this.url + "]";
        };
        return Sound;
    }());
    steg.Sound = Sound;
})(steg || (steg = {}));
/// <reference path="resources/Bitmap.ts"/>
var steg;
/// <reference path="resources/Bitmap.ts"/>
(function (steg) {
    var Sprite = /** @class */ (function () {
        function Sprite(bitmap, x, y, width, height) {
            this.bitmap = bitmap;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Sprite.prototype.draw = function (core, x, y) {
            this.bitmap.drawSection(core, x, y, this.x, this.y, this.width, this.height);
        };
        Sprite.prototype.drawReversed = function (core, x, y) {
            this.bitmap.drawSectionReversed(core, x, y, this.x, this.y, this.width, this.height);
        };
        return Sprite;
    }());
    steg.Sprite = Sprite;
})(steg || (steg = {}));
/// <reference path="Resource.ts"/>
/// <reference path="../Resources.ts"/>
/// <reference path="../Sprite.ts"/>
var steg;
/// <reference path="Resource.ts"/>
/// <reference path="../Resources.ts"/>
/// <reference path="../Sprite.ts"/>
(function (steg) {
    var SpriteSheet = /** @class */ (function () {
        function SpriteSheet(ref) {
            this.sprites = {};
            this.ref = ref;
            this.bitmap = steg.Resources.laodBitmap(ref + ".png");
        }
        SpriteSheet.prototype.load = function (core, callback) {
            var _this = this;
            var request = new XMLHttpRequest();
            request.open('GET', this.ref + ".json", true);
            request.onload = function () {
                if (request.status == 200) {
                    var data = JSON.parse(request.responseText);
                    _this.createSprites(data);
                    callback(_this);
                }
            };
            request.onerror = function (error) { console.log(error); };
            request.send();
        };
        SpriteSheet.prototype.getSprite = function (name) {
            return this.sprites[name];
        };
        SpriteSheet.prototype.createSprites = function (data) {
            for (var name in data.frames) {
                var frameData = data.frames[name];
                var frame = frameData.frame;
                var sprite = new steg.Sprite(this.bitmap, frame.x, frame.y, frame.w, frame.h);
                this.sprites[name] = sprite;
            }
        };
        SpriteSheet.prototype.getName = function () {
            return "SpriteSheet [" + this.ref + "]";
        };
        return SpriteSheet;
    }());
    steg.SpriteSheet = SpriteSheet;
})(steg || (steg = {}));
var steg;
(function (steg_1) {
    var TiledMap = /** @class */ (function () {
        function TiledMap(url, tilesetMapping) {
            this.tilesetMapping = {};
            this.tilesets = [];
            this.layers = [];
            this.url = url;
            this.tilesetMapping = tilesetMapping;
        }
        TiledMap.prototype.load = function (steg, callback) {
            var _this = this;
            var request = new XMLHttpRequest();
            request.open('GET', this.url, true);
            request.onload = function () {
                if (request.status == 200) {
                    _this.parse(request.responseText);
                    callback(_this);
                }
            };
            request.onerror = function (error) { console.log(error); };
            request.send();
        };
        TiledMap.prototype.parse = function (data) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "application/xml");
            var root = doc.documentElement;
            var tilesets = root.getElementsByTagName("tileset");
            for (var i = 0; i < tilesets.length; i++) {
                var fg = parseInt(tilesets[i].getAttribute("firstgid"));
                var source = tilesets[i].getAttribute("source");
                var tileset = this.tilesetMapping[source];
                if (!tileset) {
                    console.log("ERROR: Unable to locate tileset image for: " + source);
                }
                else {
                    var tData = new TiledMapTileset(fg, tileset);
                    this.tilesets.push(tData);
                }
            }
            this.width = parseInt(root.getAttribute("width"));
            this.height = parseInt(root.getAttribute("height"));
            var layers = root.getElementsByTagName("layer");
            for (var i = 0; i < layers.length; i++) {
                var layerData = layers[i].getElementsByTagName("data")[0].textContent;
                var cells = layerData.split(",");
                var cellData = [];
                for (var k = 0; k < cells.length; k++) {
                    cellData.push(parseInt(cells[k]));
                }
                this.layers.push(cellData);
            }
        };
        TiledMap.prototype.getName = function () {
            return "TiledMap [" + this.url + "]";
        };
        TiledMap.prototype.getTile = function (l, x, y) {
            var layer = this.layers[l];
            return layer[x + (y * this.width)];
        };
        TiledMap.prototype.isValidLocation = function (x, y) {
            return (x >= 0) && (x < this.width) && (y > 0) && (y < this.height);
        };
        TiledMap.prototype.draw = function (core, x, y, sx, sy, width, height) {
            for (var l = 0; l < this.layers.length; l++) {
                var layer = this.layers[l];
                for (var xp = 0; xp < width; xp++) {
                    for (var yp = 0; yp < height; yp++) {
                        var tx = (xp + sx);
                        var ty = (yp + sy);
                        if ((tx < 0) || (tx >= this.width) || (ty < 0) || (ty >= this.height)) {
                            continue;
                        }
                        var t = layer[tx + (ty * this.width)];
                        if (t != 0) {
                            for (var n = 0; n < this.tilesets.length; n++) {
                                if (t < this.tilesets[n].firstgid) {
                                    break;
                                }
                            }
                            // get to the right tile
                            n--;
                            var tileset = this.tilesets[n].tileset;
                            t -= this.tilesets[n].firstgid;
                            tileset.drawTile(core, x + (xp * tileset.tileWidth), y + (yp * tileset.tileHeight), t);
                        }
                    }
                }
            }
        };
        return TiledMap;
    }());
    steg_1.TiledMap = TiledMap;
    var TiledMapTileset = /** @class */ (function () {
        function TiledMapTileset(firstgid, tileset) {
            this.firstgid = firstgid;
            this.tileset = tileset;
        }
        return TiledMapTileset;
    }());
})(steg || (steg = {}));
/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
/// <reference path="resources/SpriteSheet.ts"/>
/// <reference path="resources/TiledMap.ts"/>
var steg;
/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
/// <reference path="resources/SpriteSheet.ts"/>
/// <reference path="resources/TiledMap.ts"/>
(function (steg) {
    var Resources = /** @class */ (function () {
        function Resources() {
        }
        Resources.loadTiledMap = function (url, tilesetMapping) {
            var map = new steg.TiledMap(url, tilesetMapping);
            this.addResource(url, map);
            return map;
        };
        Resources.loadSpriteSheet = function (ref) {
            var sheet = new steg.SpriteSheet(ref);
            this.addResource(ref, sheet);
            return sheet;
        };
        Resources.loadMusic = function (url) {
            var music = new steg.Music(url);
            this.addResource(url, music);
            return music;
        };
        Resources.loadSound = function (url) {
            var sound = new steg.Sound(url);
            this.addResource(url, sound);
            return sound;
        };
        Resources.addResource = function (key, res) {
            this.added.push(res);
            this.lookup[key] = res;
        };
        Resources.laodBitmap = function (url) {
            var bitmap = new steg.Bitmap(url);
            this.addResource(url, bitmap);
            return bitmap;
        };
        Resources.loadTileset = function (url, tileWidth, tileHeight, margin, spacing) {
            var tileset = new steg.Tileset(url, tileWidth, tileHeight, margin, spacing);
            this.addResource(url, tileset);
            return tileset;
        };
        Resources.load = function (core, callback) {
            var _this = this;
            this.callback = callback;
            this.core = core;
            for (var i = 0; i < this.added.length; i++) {
                this.added[i].load(this.core, function (res) { _this.resourceCallback(res); });
            }
            core.drawLoadingScreen(this.loaded.length, this.added.length);
            if (this.loaded.length == this.added.length) {
                this.callback();
            }
        };
        Resources.resourceCallback = function (res) {
            console.log("Loaded: " + res.getName());
            this.loaded.push(res);
            this.core.drawLoadingScreen(this.loaded.length, this.added.length);
            if (this.loaded.length == this.added.length) {
                this.callback();
            }
        };
        Resources.added = [];
        Resources.loaded = [];
        Resources.lookup = {};
        return Resources;
    }());
    steg.Resources = Resources;
})(steg || (steg = {}));
//# sourceMappingURL=steg.js.map