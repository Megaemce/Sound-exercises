import { audioContext } from "../main.js";

export default function equalizer(name) {
    const module = {};
    module.audioNode = {
        inputNode: new GainNode(audioContext),
        outputNode: new GainNode(audioContext),
        _125Node: new BiquadFilterNode(audioContext, { type: "lowshelf", gain: 0, frequency: 125 }),
        _250Node: new BiquadFilterNode(audioContext, { type: "peaking", gain: 0, frequency: 250, Q: 1 / 3 }),
        _500Node: new BiquadFilterNode(audioContext, { type: "peaking", gain: 0, frequency: 500, Q: 1 / 3 }),
        _1kNode: new BiquadFilterNode(audioContext, { type: "peaking", gain: 0, frequency: 1000, Q: 1 / 3 }),
        _2kNode: new BiquadFilterNode(audioContext, { type: "peaking", gain: 0, frequency: 2000, Q: 1 / 3 }),
        _4kNode: new BiquadFilterNode(audioContext, { type: "peaking", gain: 0, frequency: 4000, Q: 1 / 3 }),
        _8kNode: new BiquadFilterNode(audioContext, { type: "highshelf", gain: 0, frequency: 8000 }),
    };

    ["125", "250", "500", "1k", "2k", "4k", "8k"].forEach((Hz) => {
        const hzSlider = document.getElementById(`${name}-slider-${Hz}`);
        hzSlider.oninput = function () {
            const sliderValue = document.getElementById(`${name}-slider-${Hz}-value`);
            const sliderPlus = document.getElementById(`${name}-slider-${Hz}-plus`);

            if (this.value > 0) sliderPlus.className = "positive";
            else sliderPlus.className = "negative";

            // set value on the audiNode parameter
            if (module.audioNode) module.audioNode[`_${Hz}Node`].gain.value = this.value;

            // show new value above slider and in debug
            sliderValue.innerHTML = this.value;
        };
    });

    module.audioNode.inputNode.connect(module.audioNode._8kNode);
    module.audioNode._8kNode.connect(module.audioNode._4kNode);
    module.audioNode._4kNode.connect(module.audioNode._2kNode);
    module.audioNode._2kNode.connect(module.audioNode._1kNode);
    module.audioNode._1kNode.connect(module.audioNode._500Node);
    module.audioNode._500Node.connect(module.audioNode._250Node);
    module.audioNode._250Node.connect(module.audioNode._125Node);
    module.audioNode._125Node.connect(module.audioNode.outputNode);

    return module;
}
