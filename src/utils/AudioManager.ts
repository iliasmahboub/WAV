class AudioManager {
    ctx: AudioContext | null = null;
    analyser: AnalyserNode | null = null;
    source: MediaElementAudioSourceNode | null = null;
    dataArray: Uint8Array | null = null;
    audioElement: HTMLAudioElement | null = null;
    isInitialized = false;

    // BPM Detection
    private beatHistory: number[] = [];
    private lastBeatTime = 0;
    private bpmValue = 0;
    private beatThreshold = 0.6;
    private lastBass = 0;
    private onBeatCallbacks: (() => void)[] = [];

    async initialize(audioElement: HTMLAudioElement) {
        if (this.isInitialized && this.audioElement === audioElement) return;

        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;

        if (this.source) {
            try { this.source.disconnect(); } catch (e) {}
        }

        try {
            this.source = this.ctx.createMediaElementSource(audioElement);
            this.source.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);
        } catch (e) {
            if (this.source) {
                this.source.connect(this.analyser);
                this.analyser.connect(this.ctx.destination);
            }
        }

        this.audioElement = audioElement;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.isInitialized = true;
        this.beatHistory = [];
        this.bpmValue = 0;
    }

    async resume() {
        if (this.ctx?.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    play() {
        if (this.audioElement) {
            this.resume();
            return this.audioElement.play();
        }
    }

    pause() {
        if (this.audioElement) {
            this.audioElement.pause();
        }
    }

    toggle(): boolean {
        if (!this.audioElement) return false;
        if (this.audioElement.paused) {
            this.play();
            return true;
        } else {
            this.pause();
            return false;
        }
    }

    onBeat(callback: () => void) {
        this.onBeatCallbacks.push(callback);
    }

    offBeat(callback: () => void) {
        this.onBeatCallbacks = this.onBeatCallbacks.filter(cb => cb !== callback);
    }

    getSpectralEnergy() {
        if (!this.analyser || !this.dataArray) return { bass: 0, mid: 0, high: 0, isBeat: false };

        this.analyser.getByteFrequencyData(this.dataArray);

        const getAvg = (start: number, end: number) => {
            let sum = 0;
            for (let i = start; i < end; i++) {
                sum += this.dataArray![i];
            }
            return (sum / (end - start)) / 255.0;
        };

        const bass = Math.pow(getAvg(0, 12), 1.2);
        const mid = getAvg(12, 120);
        const high = getAvg(120, 300);

        // Beat detection
        const now = performance.now();
        const bassJump = bass - this.lastBass;
        let isBeat = false;

        if (bassJump > this.beatThreshold && bass > 0.4 && now - this.lastBeatTime > 200) {
            isBeat = true;

            // Calculate BPM from beat intervals
            if (this.lastBeatTime > 0) {
                const interval = now - this.lastBeatTime;
                if (interval > 250 && interval < 2000) { // Between 30 and 240 BPM range
                    this.beatHistory.push(interval);
                    if (this.beatHistory.length > 12) {
                        this.beatHistory.shift();
                    }

                    if (this.beatHistory.length >= 4) {
                        const avgInterval = this.beatHistory.reduce((a, b) => a + b, 0) / this.beatHistory.length;
                        this.bpmValue = Math.round(60000 / avgInterval);
                    }
                }
            }

            this.lastBeatTime = now;

            // Trigger beat callbacks
            this.onBeatCallbacks.forEach(cb => cb());
        }

        this.lastBass = bass;

        return { bass, mid, high, isBeat };
    }

    getBPM(): number {
        return this.bpmValue;
    }

    isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.paused : false;
    }
}

export const audioManager = new AudioManager();
