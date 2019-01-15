/// <reference path="../Core.ts"/>
/// <reference path="Resource.ts"/>

namespace steg {

    export class Music implements Resource {
        static currentMusic: Music;

        audioBuffer: AudioBuffer;
        url: string;
        loaded: boolean = false;
        audioContext: AudioContext;
        lastSource: AudioBufferSourceNode;

        constructor(url: string) {
            this.url = url;
        }

        load(core: Core, callback: (res: Resource) => void): void {
            if (!core.audioContext) {
                console.log("No audio context. No Sound");
                callback(this);
            } else {
                this.audioContext = core.audioContext;

                var request = new XMLHttpRequest();
                request.open('GET', this.url, true);
                request.responseType = 'arraybuffer';

                request.onload = () => {
                    core.audioContext.decodeAudioData(request.response, (audioBuffer: AudioBuffer) => {
                        this.audioBuffer = audioBuffer;
                        callback(this);
                    });
                };
                request.onerror = (error) => { console.log(error) };
                request.send();
            }
        }

        private createSource(volume: number): AudioBufferSourceNode {
            var bufferSource: AudioBufferSourceNode = this.audioContext.createBufferSource();
            bufferSource.buffer = this.audioBuffer;
            var gainNode = this.audioContext.createGain()
            gainNode.gain.value = volume;
            gainNode.connect(this.audioContext.destination)
            bufferSource.connect(gainNode);

            this.lastSource = bufferSource;

            return bufferSource;
        }

        playImpl(): void {
            if ((Core.musicOn) && (Core.audioReady)) {
                if (this.audioBuffer) {
                    var source: AudioBufferSourceNode = this.createSource(1.0);
                    source.loop = true;

                    source.start();
                }
            }
        }

        play(): void {
            if (Music.currentMusic) {
                Music.currentMusic.stop();
            }
            Music.currentMusic = this;
            this.playImpl();
        }

        stop(): void {
            if (this.lastSource) {
                this.lastSource.stop();
                this.lastSource = null;
            }
        }

        getName(): string {
            return "Music [" + this.url + "]";
        }

    }
}