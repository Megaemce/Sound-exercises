import equalizer from "./effects/equalizer.js";
import audioSource from "./effects/audioSource.js";
import outputSwitch from "./effects/switch.js";

export let audioContext;

// start audio with user interaction (chrome policy)
document.onmousemove = () => {
    try {
        audioContext = new AudioContext();
    } catch (e) {
        alert("The Web Audio API is not supported in this browser.");
    }

    audioContext.nameSoundBuffer = new Object();

    const cross = outputSwitch().audioNode;
    const leftEq = equalizer("leftEQ").audioNode;
    const rightEq = equalizer("rightEQ").audioNode;

    const crossLeft = cross.leftNode;
    const crossRight = cross.rightNode;
    const crossOutput = cross.outputNode;
    const leftEqInput = leftEq.inputNode;
    const leftEqOutput = leftEq.outputNode;
    const rightEqInput = rightEq.inputNode;
    const rightEqOutput = rightEq.outputNode;

    // don't start till all noises are loaded
    audioContext.audioWorklet.addModule("js/effects/whiteNoise.js").then(() => {
        audioContext.audioWorklet.addModule("js/effects/pinkNoise.js").then(() => {
            audioContext.audioWorklet.addModule("js/effects/brownNoise.js").then(() => {
                audioSource(leftEqInput, rightEqInput);
            });
        });
    });

    crossOutput.connect(audioContext.destination);
    leftEqOutput.connect(crossLeft);
    rightEqOutput.connect(crossRight);

    document.onmousemove = undefined;
};
