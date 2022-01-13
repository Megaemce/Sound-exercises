import equalizer from "./effects/equalizer.js";
import input from "./effects/input.js";
import output from "./effects/output.js";

const startButton = document.getElementById("start-button");
let inputNode;
let outputNode;
let equalizerANode;
let equalizerBNode;
let inputPrevState;
let mainLevel; // keeping gain level from output
export let playing; // general bool to know if something is playing
export let audioContext;
export function changeMainLevel(value) {
	mainLevel = value;
}

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
	outputOutput.gain.value = mainLevel ? mainLevel : 0;
	equalizerAOutput.connect(outputLeft);
	equalizerBOutput.connect(outputRight);

	outputNode.audioNode.switchTo("left");

	// if something was playing before don't stop it
	if (inputPrevState) {
		inputNode.playSound();
	}
}

function destroyConnection() {
	const equalizerADiv = document.getElementById("equalizerA");

	inputPrevState = inputNode.isTransmitting;

	inputNode.stopSound();
	outputNode.audioNode.outputNode.disconnect();
	equalizerANode.audioNode.outputNode.disconnect();
	equalizerBNode.audioNode.outputNode.disconnect();

	equalizerANode.restartEqualizer();
	equalizerBNode.restartEqualizer();

	equalizerADiv.classList.add("question");
}

export function deactiveAllCables() {
	const cables = document.getElementById("cables").contentWindow.document;
	const cableAOuput = cables.getElementById("cable_A_to_output");
	const cableBOutput = cables.getElementById("cable_B_to_output");
	const cableInputA = cables.getElementById("cable_input_to_A");
	const cableInputB = cables.getElementById("cable_input_to_B");

	cableAOuput.setAttribute("stroke", "black");
	cableBOutput.setAttribute("stroke", "black");
	cableInputA.setAttribute("stroke", "black");
	cableInputB.setAttribute("stroke", "black");
}

export function activeAllCables() {
	if (inputNode.isTransmitting) {
		const cables = document.getElementById("cables").contentWindow.document;
		const cableAOuput = cables.getElementById("cable_A_to_output");
		const cableBOutput = cables.getElementById("cable_B_to_output");
		const cableInputA = cables.getElementById("cable_input_to_A");
		const cableInputB = cables.getElementById("cable_input_to_B");

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
	const equalizerADiv = document.getElementById("equalizerA");
	const eqAContent = equalizerADiv.querySelector(".content");
	const applyButton = document.getElementById("apply-button");
	const configButton = document.getElementById("config-button");
	const restartButton = document.getElementById("restart-button");
	const startScreen = document.getElementById("start_screen");

	// placed here as sometimes it takes longer to load <object> data
	const volChangesTextA = document.getElementById("knob_volumeChanges").contentWindow.document.getElementById("textA");
	const volChangesTextB = document.getElementById("knob_volumeChanges").contentWindow.document.getElementById("textB");
	const volChangesTextC = document.getElementById("knob_volumeChanges").contentWindow.document.getElementById("textC");
	const numOfChangesTextA = document.getElementById("knob_numberOfChanges").contentWindow.document.getElementById("textA");
	const numOfChangesTextB = document.getElementById("knob_numberOfChanges").contentWindow.document.getElementById("textB");
	const numOfChangesTextC = document.getElementById("knob_numberOfChanges").contentWindow.document.getElementById("textC");

	// change default ABC values above knobs
	volChangesTextA.innerHTML = "MIX";
	volChangesTextB.innerHTML = "+8";
	volChangesTextC.innerHTML = "-8";
	volChangesTextB.setAttribute("x", "32");
	volChangesTextC.setAttribute("x", "59");
	numOfChangesTextA.innerHTML = "1 or 2";
	numOfChangesTextB.innerHTML = "1";
	numOfChangesTextC.innerHTML = "2";

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

	// apply button handler - get knobs angle and build stuff based on it
	applyButton.onclick = () => {
		const equalizerADiv = document.getElementById("equalizerA");
		const numberOfChangesDeg = document
			.getElementById("knob_numberOfChanges")
			.contentWindow.document.getElementById("mainSVG")
			.getAttribute("deg");
		const volumeChangesDeg = document
			.getElementById("knob_volumeChanges")
			.contentWindow.document.getElementById("mainSVG")
			.getAttribute("deg");

		equalizerADiv.classList.remove("show-config");

		destroyConnection();
		buildConnection(numberOfChangesDeg, volumeChangesDeg);
	};

	// restart button handler - make effect on question mark and restart the config
	restartButton.onclick = () => {
		applyButton.click();
		const equalizerADiv = document.getElementById("equalizerA");

		equalizerADiv.classList.add("question-next");
		setTimeout(() => {
			equalizerADiv.classList.remove("question-next");
		}, 2000);
	};

	// eqA body handler - remove question mark hower
	eqAContent.onclick = () => {
		const equalizerADiv = document.getElementById("equalizerA");

		equalizerADiv.classList.contains("question")
			? equalizerADiv.classList.remove("question")
			: equalizerADiv.classList.add("question");
	};

	// config button handler - show the configuration menu
	configButton.onclick = () => {
		const equalizerADiv = document.getElementById("equalizerA");

		equalizerADiv.classList.contains("show-config")
			? equalizerADiv.classList.remove("show-config")
			: equalizerADiv.classList.add("show-config");
	};

	document.onmousemove = undefined;
};
