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
(function (steg_1) {
    var Bitmap = /** @class */ (function () {
        function Bitmap(url) {
            this.url = url;
        }
        Bitmap.prototype.load = function (steg, callback) {
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
        Bitmap.prototype.drawScaled = function (steg, x, y, width, height) {
            var ctx = steg.ctx;
            ctx.drawImage(this.image, x, y, width, height);
        };
        Bitmap.prototype.draw = function (steg, x, y) {
            var ctx = steg.ctx;
            ctx.drawImage(this.image, x, y);
        };
        Bitmap.prototype.getName = function () {
            return "Bitmap [" + this.url + "]";
        };
        return Bitmap;
    }());
    steg_1.Bitmap = Bitmap;
})(steg || (steg = {}));
/// <reference path="Bitmap.ts"/>
var steg;
/// <reference path="Bitmap.ts"/>
(function (steg_2) {
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
        Tileset.prototype.drawTile = function (steg, x, y, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth;
            yp *= this.tileHeight;
            steg.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
        };
        Tileset.prototype.drawTileScaled = function (steg, x, y, width, height, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth;
            yp *= this.tileHeight;
            steg.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, x, y, width, height);
        };
        Tileset.prototype.drawTileReverse = function (steg, x, y, tile) {
            var xp = Math.floor(tile % this.scanline);
            var yp = Math.floor(tile / this.scanline);
            xp *= this.tileWidth;
            yp *= this.tileHeight;
            steg.ctx.scale(-1, 1);
            steg.ctx.drawImage(this.image, xp, yp, this.tileWidth, this.tileHeight, -(x + this.tileWidth), y, this.tileWidth, this.tileHeight);
            steg.ctx.scale(-1, 1);
        };
        return Tileset;
    }(steg_2.Bitmap));
    steg_2.Tileset = Tileset;
})(steg || (steg = {}));
/// <reference path="../Core.ts"/>
/// <reference path="Resource.ts"/>
var steg;
/// <reference path="../Core.ts"/>
/// <reference path="Resource.ts"/>
(function (steg_3) {
    var Music = /** @class */ (function () {
        function Music(url) {
            this.loaded = false;
            this.url = url;
        }
        Music.prototype.load = function (steg, callback) {
            var _this = this;
            if (!steg.audioContext) {
                console.log("No audio context. No Sound");
                callback(this);
            }
            else {
                this.audioContext = steg.audioContext;
                var request = new XMLHttpRequest();
                request.open('GET', this.url, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    steg.audioContext.decodeAudioData(request.response, function (audioBuffer) {
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
            if ((steg_3.Core.musicOn) && (steg_3.Core.audioReady)) {
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
    steg_3.Music = Music;
})(steg || (steg = {}));
/// <reference path="Resource.ts"/>
var steg;
/// <reference path="Resource.ts"/>
(function (steg_4) {
    var Sound = /** @class */ (function () {
        function Sound(url) {
            this.loaded = false;
            this.url = url;
        }
        Sound.prototype.load = function (steg, callback) {
            var _this = this;
            if (!steg.audioContext) {
                console.log("No audio context. No Sound");
                callback(this);
            }
            else {
                this.audioContext = steg.audioContext;
                var request = new XMLHttpRequest();
                request.open('GET', this.url, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    steg.audioContext.decodeAudioData(request.response, function (audioBuffer) {
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
            if ((steg_4.Core.soundOn) && (steg_4.Core.audioReady)) {
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
    steg_4.Sound = Sound;
})(steg || (steg = {}));
/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
var steg;
/// <reference path="resources/Resource.ts"/>
/// <reference path="resources/Bitmap.ts"/>
/// <reference path="resources/Tileset.ts"/>
/// <reference path="resources/Music.ts"/>
/// <reference path="resources/Sound.ts"/>
(function (steg_5) {
    var Resources = /** @class */ (function () {
        function Resources() {
        }
        Resources.loadMusic = function (url) {
            var music = new steg_5.Music(url);
            this.added.push(music);
            return music;
        };
        Resources.loadSound = function (url) {
            var sound = new steg_5.Sound(url);
            this.added.push(sound);
            return sound;
        };
        Resources.laodBitmap = function (url) {
            var bitmap = new steg_5.Bitmap(url);
            this.added.push(bitmap);
            return bitmap;
        };
        Resources.loadTileset = function (url, tileWidth, tileHeight) {
            var tileset = new steg_5.Tileset(url, tileWidth, tileHeight);
            this.added.push(tileset);
            return tileset;
        };
        Resources.load = function (steg, callback) {
            var _this = this;
            this.callback = callback;
            this.steg = steg;
            for (var i = 0; i < this.added.length; i++) {
                this.added[i].load(this.steg, function (res) { _this.resourceCallback(res); });
            }
            steg.drawLoadingScreen(this.loaded.length, this.added.length);
            if (this.loaded.length == this.added.length) {
                this.callback();
            }
        };
        Resources.resourceCallback = function (res) {
            console.log("Loaded: " + res.getName());
            this.loaded.push(res);
            this.steg.drawLoadingScreen(this.loaded.length, this.added.length);
            if (this.loaded.length == this.added.length) {
                this.callback();
            }
        };
        Resources.added = [];
        Resources.loaded = [];
        return Resources;
    }());
    steg_5.Resources = Resources;
})(steg || (steg = {}));
//# sourceMappingURL=steg.js.map