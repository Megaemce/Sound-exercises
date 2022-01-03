class whiteNoise extends AudioWorkletProcessor {
    process(_inputs, outputs, _parameters) {
        const output = outputs[0];
        output.forEach((channel) => {
            for (let i = 0; i < channel.length; i++) {
                channel[i] = Math.random() * 2 - 1;
            }
        });
        return true;
    }
}

registerProcessor("whiteNoise", whiteNoise);
