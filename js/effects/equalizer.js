import { audioContext } from "../main.js";

export default function equalizer(name) {
    const module = {};
    const frequencies = ["125", "250", "500", "1k", "2k", "4k", "8k"];

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

    module.changeSliderValue = (sliderName, value) => {
        const sliderValue = document.getElementById(`${name}-slider-${sliderName}-value`);
        const sliderPlus = document.getElementById(`${name}-slider-${sliderName}-plus`);

        if (value > 0) sliderPlus.className = "positive";
        else sliderPlus.className = "negative";

        // set value on the audiNode parameter
        if (module.audioNode) module.audioNode[`_${sliderName}Node`].gain.value = value;

        // show new value above slider and in debug
        sliderValue.innerHTML = value;
    };

    module.resetEqualizer = () => {
        frequencies.forEach((Hz) => {
            const hzSlider = document.getElementById(`${name}-slider-${Hz}`);
            hzSlider.value = 0;
            module.changeSliderValue(Hz, 0);
        });
    };

    frequencies.forEach((Hz) => {
        const hzSlider = document.getElementById(`${name}-slider-${Hz}`);
        hzSlider.oninput = function () {
            module.changeSliderValue(Hz, this.value);
        };
    });

    if (name === "equalizerA") {
        const changesVolumeInputs = document.getElementById("changes-volume").childNodes;
        const changesNumberInputs = document.getElementById("changes-number").childNodes;
        let changesVolume; // +8, -8, mixed
        let changesNumber; // 1, 2, or unknown

        changesVolumeInputs.forEach((node) => {
            if (node.localName === "input" && node.checked === true) {
                changesVolume = node.value;
                return;
            }
        });
        changesNumberInputs.forEach((node) => {
            if (node.localName === "input" && node.checked === true) {
                changesNumber = node.value;
                return;
            }
        });

        // if unknown set 1 or 2
        if (changesNumber === "unknown") {
            changesNumber = Math.ceil(Math.random() * 2);
        }

        let previousFreq = undefined;
        for (let i = 0; i < changesNumber; i++) {
            let randomFreq = frequencies[Math.floor(Math.random() * 7)];

            // don't duplicate changes on the same frequency
            while (randomFreq === previousFreq) {
                randomFreq = frequencies[Math.floor(Math.random() * 7)];
            }

            if (changesVolume === "+8") {
                document.getElementById(`${name}-slider-${randomFreq}`).value = 8;
                module.changeSliderValue(randomFreq, 8);
            }
            if (changesVolume === "-8") {
                frequencies[Math.floor(Math.random() * 7)];
                document.getElementById(`${name}-slider-${randomFreq}`).value = -8;
                module.changeSliderValue(randomFreq, -8);
            }
            if (changesVolume === "mixed") {
                if (Math.round(Math.random()) === 0) {
                    document.getElementById(`${name}-slider-${randomFreq}`).value = -8;
                    module.changeSliderValue(randomFreq, -8);
                } else {
                    document.getElementById(`${name}-slider-${randomFreq}`).value = 8;
                    module.changeSliderValue(randomFreq, 8);
                }
            }

            previousFreq = randomFreq;
        }
    }

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
