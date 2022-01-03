import { audioContext } from "../main.js";
import { openFileHandler } from "../helpers/loaders.js";

export default function audioSource(leftEqInput, rightEqInput) {
    const module = {};
    const pinkNoise = new AudioWorkletNode(audioContext, "pinkNoise");
    const brownNoise = new AudioWorkletNode(audioContext, "brownNoise");
    const whiteNoise = new AudioWorkletNode(audioContext, "whiteNoise");

    module.select = document.getElementsByClassName("module-1-content-options-select")[0];
    module.playButton = document.getElementById("module-1-controllers-switch");
    module.openFileInput = document.getElementsByClassName("module-1-content-options-select-open-file-input")[0];

    module.loop = false;
    module.audioNode = undefined;
    module.isTransmitting = false;

    module.playSound = () => {
        module.isTransmitting = true;
        module.playButton.classList.add("switch-on");

        // stop old audioNode (if there is any)
        if (module.audioNode) {
            module.audioNode.disconnect();
        }

        if (module.select.value === "white noise") {
            module.audioNode = whiteNoise;
        } else if (module.select.value === "pink noise") {
            module.audioNode = pinkNoise;
        } else if (module.select.value === "brown noise") {
            module.audioNode = brownNoise;
        } else {
            //  create a new audio buffer source with selected buffer
            const bufferName = audioContext.nameSoundBuffer[module.select.value];

            module.audioNode = new AudioBufferSourceNode(audioContext, {
                loop: true,
                buffer: bufferName,
            });

            module.audioNode.start();
        }

        module.audioNode.connect(leftEqInput);
        module.audioNode.connect(rightEqInput);
    };
    module.stopSound = () => {
        module.isTransmitting = false;
        module.playButton.classList.remove("switch-on");

        if (module.audioNode) {
            module.audioNode.disconnect();
        }
    };
    // when select changes
    module.select.onchange = function (event) {
        // when new option is added (eg. after new file loaded) this onchange event get trigger too
        // srcElement.id is only defined when if it was triggered by file button (eg. loading file)
        if (!event.target.id) {
            // when selected option is an file button start openFileHandler
            if (this[this.selectedIndex].id === "file button") {
                // add hooker to the fileButton and then start it by click event
                module.openFileInput.onchange = () => {
                    openFileHandler(module);
                };
                module.openFileInput.click();
                // stop the sound as select.value is still "open file..." thus causing issue in loading audio buffer
                module.stopSound();
            } else {
                // if something is playing stop it and play the new one
                if (module.isTransmitting) module.playSound();
            }
        }
    };

    module.playButton.onclick = () => {
        module.isTransmitting ? module.stopSound() : module.playSound();
    };

    return module;
}
