import equalizer from "./effects/equalizer.js";
import audioSource from "./effects/audioSource.js";
import output from "./effects/output.js";

export let audioContext;

let inputNode;
let outputNode;
let leftEqNode;
let rightEqNode;
let inputPrevState;

function buildConnection() {
    outputNode = output();
    leftEqNode = equalizer("leftEQ");
    rightEqNode = equalizer("rightEQ");

    const outputLeft = outputNode.audioNode.leftNode;
    const outputRight = outputNode.audioNode.rightNode;
    const outputOutput = outputNode.audioNode.outputNode;
    const leftEqInput = leftEqNode.audioNode.inputNode;
    const leftEqOutput = leftEqNode.audioNode.outputNode;
    const rightEqInput = rightEqNode.audioNode.inputNode;
    const rightEqOutput = rightEqNode.audioNode.outputNode;

    inputNode = audioSource(leftEqInput, rightEqInput);

    outputOutput.connect(audioContext.destination);
    leftEqOutput.connect(outputLeft);
    rightEqOutput.connect(outputRight);

    outputNode.audioNode.switchTo("left");

    // if something was playing before don't stop it
    if (inputPrevState) inputNode.playSound();
}

function destroyConnection() {
    inputPrevState = inputNode.isTransmitting;

    inputNode.stopSound();
    outputNode.audioNode.outputNode.disconnect();
    leftEqNode.audioNode.outputNode.disconnect();
    rightEqNode.audioNode.outputNode.disconnect();

    leftEqNode.resetEqualizer();
    rightEqNode.resetEqualizer();
}

// start audio with user interaction (chrome policy)
document.onmousemove = () => {
    try {
        audioContext = new AudioContext();
    } catch (e) {
        alert("The Web Audio API is not supported in this browser.");
    }

    audioContext.nameSoundBuffer = new Object();

    // build everything when all the noise are loaded
    audioContext.audioWorklet.addModule("js/effects/whiteNoise.js").then(() => {
        audioContext.audioWorklet.addModule("js/effects/pinkNoise.js").then(() => {
            audioContext.audioWorklet.addModule("js/effects/brownNoise.js").then(() => {
                buildConnection();
            });
        });
    });

    document.getElementById("apply-button").onclick = () => {
        destroyConnection();
        buildConnection();
    };

    document.onmousemove = undefined;
};
