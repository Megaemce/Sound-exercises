class brownNoise extends AudioWorkletProcessor {
    constructor() {
        super();
        this.lastOut = 0.0;
    }
    process(_inputs, outputs, _parameters) {
        const output = outputs[0];
        output.forEach((channel) => {
            for (let i = 0; i < channel.length; i++) {
                const white = Math.random() * 2 - 1;
                channel[i] = (this.lastOut + 0.02 * white) / 1.02;
                this.lastOut = channel[i];
                channel[i] *= 3.5; // (roughly) compensate for gain
            }
        });
        return true;
    }
}

registerProcessor("brownNoise", brownNoise);
