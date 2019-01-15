var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
            this.game = game;
            this.canvas = canvas;
        }
        Core.prototype.start = function () {
            this.init();
        };
        Core.prototype.setStartImage = function (startImage) {
            this.startImage = startImage;
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
                }
            }
        };
        Core.prototype.drawLoadingScreen = function (loaded, total) {
            var _this = this;
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.fillRect(0, 0, this.canvas.width, this.canvas.height, "#000000");
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.font = "20px Helvetica";
            this.ctx.fillText("Loading " + loaded + "/" + total, 50, 50);
            this.fillRect(50, 60, (this.canvas.width - 100), 20, "#555555");
            this.fillRect(50, 60, (this.canvas.width - 100) * (loaded / total), 20, "#0000FF");
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
        Core.prototype.invokeMouseDown = function (id, x, y) {
            this.doStart();
            this.game.mouseDown(this, id + 1, x, y);
        };
        Core.prototype.invokeMouseUp = function (id, x, y) {
            this.doStart();
            this.game.mouseUp(this, id + 1, x, y);
        };
        Core.prototype.invokeMouseMove = function (id, x, y) {
        };
        Core.prototype.tick = function () {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            if (this.started) {
                this.game.update(this);
                this.game.render(this);
            }
            else {
                this.fillRect(0, 0, this.canvas.width, this.canvas.height, "#000000");
                if (this.startImage) {
                    this.startImage.draw(this, (this.canvas.width - this.startImage.width) / 2, (this.canvas.height - this.startImage.height) / 2);
                }
                else {
                    this.ctx.fillStyle = "#FFFFFF";
                    this.ctx.font = "20px Helvetica";
                    this.ctx.fillText("Tap or Click to Start", 50, 50);
                }
            }
        };
        Core.prototype.setFontSize = function (size) {
            this.ctx.font = size + "px Helvetica";
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
        Core.prototype.fillRect = function (x, y, width, height, col) {
            this.ctx.fillStyle = col;
            this.ctx.fillRect(x, y, width, height);
        };
        Core.soundOn = true;
        Core.musicOn = true;
        Core.audioReady = false;
        return Core;
    }());
    steg.Core = Core;
})(steg || (steg = {}));
/// <reference path="Core.ts"/>
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
        function Tileset(url, tileWidth, tileHeight) {
            var _this = _super.call(this, url) || this;
            _this.tileWidth = tileWidth;
            _this.tileHeight = tileHeight;
            return _this;
        }
        Tileset.prototype.loaded = function () {
            this.scanline = Math.floor(this.image.width / this.tileWidth);
        };
        Tileset.prototype.getName = function () {
            return "Tileset [" + this.url + "]";
        };
        Tileset.prototype.drawTile = function (core, x, y, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth;
            yp *= this.tileHeight;
            core.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
        };
        Tileset.prototype.drawTileScaled = function (core, x, y, width, height, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth;
            yp *= this.tileHeight;
            core.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, x, y, width, height);
        };
        Tileset.prototype.drawTileReverse = function (core, x, y, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth;
            yp *= this.tileHeight;
            core.ctx.scale(-1, 1);
            core.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, -(x + this.tileWidth), y, this.tileWidth, this.tileHeight);
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
/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
/// <reference path="resources/SpriteSheet.ts"/>
var steg;
/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
/// <reference path="resources/SpriteSheet.ts"/>
(function (steg) {
    var Resources = /** @class */ (function () {
        function Resources() {
        }
        Resources.loadSpriteSheet = function (ref) {
            var sheet = new steg.SpriteSheet(ref);
            this.added.push(sheet);
            this.lookup[ref] = sheet;
            return sheet;
        };
        Resources.loadMusic = function (url) {
            var music = new steg.Music(url);
            this.added.push(music);
            this.lookup[url] = music;
            return music;
        };
        Resources.loadSound = function (url) {
            var sound = new steg.Sound(url);
            this.added.push(sound);
            this.lookup[url] = sound;
            return sound;
        };
        Resources.laodBitmap = function (url) {
            var bitmap = new steg.Bitmap(url);
            this.added.push(bitmap);
            this.lookup[url] = bitmap;
            return bitmap;
        };
        Resources.loadTileset = function (url, tileWidth, tileHeight) {
            var tileset = new steg.Tileset(url, tileWidth, tileHeight);
            this.added.push(tileset);
            this.lookup[url] = tileset;
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