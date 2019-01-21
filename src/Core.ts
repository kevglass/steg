// SIMPLE TYPESCRIPT ENGINE FOR GAMES
namespace steg {
    export class Core {
        static soundOn: boolean = true;
        static musicOn: boolean = true;
        static audioReady: boolean = false;

        game: Game;
        timer: any;
        fps: number = 20;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        readyToStart: boolean = false;
        started: boolean = false;
        audioContext: AudioContext;

        constructor(canvas: HTMLCanvasElement, game: Game) {
            this.game = game;
            this.canvas = canvas;
        }

        start(): void {
            this.init();
        }

        init(): void {
            var AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
            if (AudioContext) {
                console.log("Audio Context Being Created");
                this.audioContext = new AudioContext();
            } else {
                console.log("No Audio Context found");
            }

            this.setupMouseHandler();
            this.ctx = this.canvas.getContext("2d");

            this.game.init(this);

            Resources.load(this, () => {
                this.game.loaded(this);
                this.readyToStart = true;
            });
        }

        doStart(): void {
            if (this.readyToStart) {
                if (!this.started) {
                    if (this.audioContext) {
                        this.audioContext.resume();
                    }

                    Core.audioReady = true;
                    if (Music.currentMusic) {
                        Music.currentMusic.play();
                    }

                    this.started = true;

                    this.game.started(this);
                }
            }
        }

        drawLoadingScreen(loaded: number, total: number): void {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;

            this.fillRect(0, 0, this.canvas.width, this.canvas.height, "#000000"); this.ctx.fillStyle = "#FFFFFF";

            this.ctx.font = "20px Helvetica";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Loading " + loaded + "/" + total, this.canvas.width / 2, (this.canvas.height / 2) - 30);

            var barWidth : number = 100;
            this.fillRect((this.canvas.width - barWidth) / 2, this.canvas.height / 2, barWidth, 5, "#555555");
            this.fillRect((this.canvas.width - barWidth) / 2, this.canvas.height / 2, barWidth * (loaded / total), 5, "#00FFFF");

            if (total == loaded) {
                this.timer = setInterval(() => { this.tick() }, 1000 / this.fps);
            }
        }

        setupMouseHandler(): void {
            var hasTouchStartEvent = 'ontouchstart' in document.createElement('div');

            if (!hasTouchStartEvent) {
                this.canvas.onmousedown = (e) => {
                    e.preventDefault();
                    this.invokeMouseDown(1, e.offsetX, e.offsetY);
                }

                this.canvas.onmouseup = (e) => {
                    e.preventDefault();
                    this.invokeMouseUp(1, e.offsetX, e.offsetY);
                }

                this.canvas.onmousemove = (e) => {
                    e.preventDefault();
                    this.invokeMouseMove(1, e.offsetX, e.offsetY);
                }

                document.onkeyup = (e) => {
                    e.preventDefault();
                    this.invokeKeyUp(e.keyCode);
                }

                document.onkeydown = (e) => {
                    e.preventDefault();
                    this.invokeKeyDown(e.keyCode);
                }
            } else {
                this.canvas.ontouchstart = (e) => {
                    e.preventDefault();
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        this.invokeMouseDown(e.changedTouches.item(i).identifier, e.changedTouches.item(i).pageX, e.changedTouches.item(i).pageY);
                    }
                }

                this.canvas.ontouchend = (e) => {
                    e.preventDefault();
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        this.invokeMouseUp(e.changedTouches.item(i).identifier, e.changedTouches.item(i).pageX, e.changedTouches.item(i).pageY);
                    }
                }

                this.canvas.ontouchmove = (e) => {
                    e.preventDefault();
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        this.invokeMouseUp(e.changedTouches.item(i).identifier, e.changedTouches.item(i).pageX, e.changedTouches.item(i).pageY);
                    }
                }

                document.onkeyup = (e) => {
                    e.preventDefault();
                    this.invokeKeyUp(e.keyCode);
                }

                document.onkeydown = (e) => {
                    e.preventDefault();
                    this.invokeKeyDown(e.keyCode);
                }
            }
        }

        setSoundOn(soundOn: boolean): void {
            if (!this.audioContext) {
                return;
            }
            Core.soundOn = soundOn;
        }

        getSoundOn(): boolean {
            if (!this.audioContext) {
                return false;
            }

            return Core.soundOn;
        }

        setMusicOn(musicOn: boolean): void {
            if (!this.audioContext) {
                return;
            }

            Core.musicOn = musicOn;
            if (Music.currentMusic) {
                if (musicOn) {
                    Music.currentMusic.play();
                } else {
                    Music.currentMusic.stop();
                }
            }
        }

        getMusicOn(): boolean {
            if (!this.audioContext) {
                return false;
            }

            return Core.musicOn;
        }

        invokeKeyDown(key: number) {
            this.doStart();

            this.game.keyDown(this, key);
        }

        invokeKeyUp(key: number) {
            this.doStart();

            this.game.keyUp(this, key);
        }

        invokeMouseDown(id: number, x: number, y: number) {
            this.doStart();

            this.game.mouseDown(this, id + 1, x, y);
        }

        invokeMouseUp(id: number, x: number, y: number) {
            this.doStart();

            this.game.mouseUp(this, id + 1, x, y);
        }

        invokeMouseMove(id: number, x: number, y: number) {
            this.doStart();

            this.game.mouseMove(this, id + 1, x, y);
        }

        tick(): void {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;

            if (this.started) {
                this.game.update(this);
                this.game.render(this);
            } else {
                this.game.renderStartPage(this);
            }
        }

        setFontSize(size: number): void {
            this.ctx.font = size + "px Helvetica";
        }

        drawText(txt: string, x: number, y: number, col: string): void {
            this.ctx.fillStyle = col;
            this.ctx.fillText(txt, x, y);
        }

        centerText(txt: string, y: number, col: string): void {
            this.ctx.fillStyle = col;
            this.ctx.textAlign = "center";
            this.ctx.fillText(txt, this.canvas.width / 2, y);
        }

        fillRect(x: number, y: number, width: number, height: number, col: string): void {
            this.ctx.fillStyle = col;
            this.ctx.fillRect(x, y, width, height);
        }

        drawRect(x: number, y: number, width: number, height: number, col: string): void {
            this.ctx.strokeStyle = col;
            this.ctx.strokeRect(x, y, width, height);
        }
    }
}