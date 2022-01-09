import equalizer from "./effects/equalizer.js";
import input from "./effects/input.js";
import output from "./effects/output.js";

export let audioContext;

export function setPlayingVariable(state) {
	playing = state;
}

export let playing; // general bool to know if something is playing
let inputNode;
let outputNode;
let equalizerANode;
let equalizerBNode;
let inputPrevState;

const cables = document.getElementById("cables").contentWindow.document;
const cableAOuput = cables.getElementById("cable_A_to_output");
const cableBOutput = cables.getElementById("cable_B_to_output");
const cableInputA = cables.getElementById("cable_input_to_A");
const cableInputB = cables.getElementById("cable_input_to_B");
const equalizerADiv = document.getElementById("equalizerA");
const startButton = document.getElementById("start_button");
const startScreen = document.getElementById("start_screen");

const numOfChangesTextA = document.getElementById("knob_numberOfChanges").contentWindow.document.getElementById("textA");
const numOfChangesTextB = document.getElementById("knob_numberOfChanges").contentWindow.document.getElementById("textB");
const numOfChangesTextC = document.getElementById("knob_numberOfChanges").contentWindow.document.getElementById("textC");
const volChangesTextA = document.getElementById("knob_volumeChanges").contentWindow.document.getElementById("textA");
const volChangesTextB = document.getElementById("knob_volumeChanges").contentWindow.document.getElementById("textB");
const volChangesTextC = document.getElementById("knob_volumeChanges").contentWindow.document.getElementById("textC");

// change default ABC values above knobs
numOfChangesTextA.innerHTML = "1 or 2";
numOfChangesTextB.innerHTML = "1";
numOfChangesTextC.innerHTML = "2";
volChangesTextA.innerHTML = "MIX";
volChangesTextB.innerHTML = "+8";
volChangesTextB.setAttribute("x", "32");
volChangesTextC.innerHTML = "-8";
volChangesTextC.setAttribute("x", "59");

function buildConnection(numberOfChangesDeg, volumeChangesDeg) {
	outputNode = output();
	equalizerANode = equalizer("equalizerA", numberOfChangesDeg, volumeChangesDeg);
	equalizerBNode = equalizer("equalizerB");

	const outputLeft = outputNode.audioNode.leftNode;
	const outputRight = outputNode.audioNode.rightNode;
	const outputOutput = outputNode.audioNode.outputNode;
	const equalizerAInput = equalizerANode.audioNode.inputNode;
	const equalizerAOutput = equalizerANode.audioNode.outputNode;
	const equalizerBInput = equalizerBNode.audioNode.inputNode;
	const equalizerBOutput = equalizerBNode.audioNode.outputNode;

	inputNode = input(equalizerAInput, equalizerBInput);

	outputOutput.connect(audioContext.destination);
	equalizerAOutput.connect(outputLeft);
	equalizerBOutput.connect(outputRight);

	outputNode.audioNode.switchTo("left");

	// if something was playing before don't stop it
	if (inputPrevState) {
		inputNode.playSound();
	}

	equalizerADiv.querySelector(".content").onclick = () => {
		equalizerADiv.classList.remove("question");
	};
	equalizerADiv.querySelector(".head .reset").onclick = () => {
		equalizerADiv.classList.add("question-next");
		setTimeout(() => {
			equalizerADiv.classList.remove("question-next");
		}, 2000);
	};
	equalizerADiv.querySelector(".head .config").onclick = () => {
		equalizerADiv.classList.contains("show-config")
			? equalizerADiv.classList.remove("show-config")
			: equalizerADiv.classList.add("show-config");
	};
}

function destroyConnection() {
	inputPrevState = inputNode.isTransmitting;

	inputNode.stopSound();
	outputNode.audioNode.outputNode.disconnect();
	equalizerANode.audioNode.outputNode.disconnect();
	equalizerBNode.audioNode.outputNode.disconnect();

	equalizerANode.resetEqualizer();
	equalizerBNode.resetEqualizer();

	equalizerADiv.classList.add("question");
}

export function deactiveAllCables() {
	cableAOuput.setAttribute("stroke", "black");
	cableBOutput.setAttribute("stroke", "black");
	cableInputA.setAttribute("stroke", "black");
	cableInputB.setAttribute("stroke", "black");
}

export function activeAllCables() {
	if (inputNode.isTransmitting) {
		if (outputNode.track === "B") {
			cableInputB.setAttribute("stroke", "url(#grad-right-to-left)");
			cableBOutput.setAttribute("stroke", "url(#grad-right-to-left)");
			cableAOuput.setAttribute("stroke", "black");
			cableInputA.setAttribute("stroke", "black");
		}
		if (outputNode.track === "A") {
			cableInputA.setAttribute("stroke", "url(#grad-top-to-bottom)");
			cableAOuput.setAttribute("stroke", "url(#grad-left-to-right)");
			cableBOutput.setAttribute("stroke", "black");
			cableInputB.setAttribute("stroke", "black");
		}
	}
}

// start audio with user interaction (chrome policy)
startButton.onclick = () => {
	try {
		audioContext = new AudioContext();
	} catch (e) {
		alert("The Web Audio API is not supported in this browser.");
	}

	startScreen.classList.add("hidden");

	audioContext.nameSoundBuffer = new Object();

	// build everything when all the noise are loaded
	audioContext.audioWorklet.addModule("js/effects/whiteNoise.js").then(() => {
		audioContext.audioWorklet.addModule("js/effects/pinkNoise.js").then(() => {
			audioContext.audioWorklet.addModule("js/effects/brownNoise.js").then(() => {
				buildConnection(0, 0);
			});
		});
	});

	document.getElementById("apply-button").onclick = () => {
		const numberOfChangesDeg = document
			.getElementById("knob_numberOfChanges")
			.contentWindow.document.getElementById("mainSVG")
			.getAttribute("deg");
		const volumeChangesDeg = document
			.getElementById("knob_volumeChanges")
			.contentWindow.document.getElementById("mainSVG")
			.getAttribute("deg");

		destroyConnection();
		buildConnection(numberOfChangesDeg, volumeChangesDeg);
	};

	document.onmousemove = undefined;
};
