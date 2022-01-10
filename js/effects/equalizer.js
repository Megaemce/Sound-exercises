import { audioContext } from "../main.js";

export default function equalizer(name, numberOfChangesDeg, volumeChangesDeg) {
	const module = {};
	const frequencies = ["125", "250", "500", "1k", "2k", "4k", "8k"];

	// create inital audioNode with all frequencies sliders
	module.audioNode = {
		inputNode: new GainNode(audioContext),
		outputNode: new GainNode(audioContext),
		_125Node: new BiquadFilterNode(audioContext, {
			type: "lowshelf",
			gain: 0,
			frequency: 125,
		}),
		_250Node: new BiquadFilterNode(audioContext, {
			type: "peaking",
			gain: 0,
			frequency: 250,
			Q: 1 / 3,
		}),
		_500Node: new BiquadFilterNode(audioContext, {
			type: "peaking",
			gain: 0,
			frequency: 500,
			Q: 1 / 3,
		}),
		_1kNode: new BiquadFilterNode(audioContext, {
			type: "peaking",
			gain: 0,
			frequency: 1000,
			Q: 1 / 3,
		}),
		_2kNode: new BiquadFilterNode(audioContext, {
			type: "peaking",
			gain: 0,
			frequency: 2000,
			Q: 1 / 3,
		}),
		_4kNode: new BiquadFilterNode(audioContext, {
			type: "peaking",
			gain: 0,
			frequency: 4000,
			Q: 1 / 3,
		}),
		_8kNode: new BiquadFilterNode(audioContext, {
			type: "highshelf",
			gain: 0,
			frequency: 8000,
		}),
	};
	// handling changes - adding +/- sign, changing audioNode gain, showing value above slider
	module.changeSliderValue = (sliderHz, value) => {
		const sliderValue = document.getElementById(`${name}-slider-${sliderHz}-value`);
		const sliderPlus = document.getElementById(`${name}-slider-${sliderHz}-plus`);

		if (value > 0) sliderPlus.className = "positive";
		else sliderPlus.className = "negative";

		// set value on the audiNode parameter
		if (module.audioNode) module.audioNode[`_${sliderHz}Node`].gain.value = value;

		// show new value above slider
		sliderValue.innerHTML = value;
	};
	// reset all sliders to default (0) position
	module.restartEqualizer = () => {
		frequencies.forEach((Hz) => {
			const hzSlider = document.getElementById(`${name}-slider-${Hz}`);
			hzSlider.value = 0;
			module.changeSliderValue(Hz, 0);
		});
	};
	// add onInput hooks to all sliders
	frequencies.forEach((Hz) => {
		const hzSlider = document.getElementById(`${name}-slider-${Hz}`);
		hzSlider.oninput = function () {
			module.changeSliderValue(Hz, this.value);
		};
	});
	// left equalizer is the one that mix the sliders
	if (name === "equalizerA") {
		let previousFreq = undefined; // keep it to not duplicate changes
		let changesVolume; // value: +8, -8, mixed
		let changesNumber; // value: 1, 2, or unknown

		// set "Volume change" value based on knob degree
		if (volumeChangesDeg == "0") changesVolume = "+8";
		if (volumeChangesDeg == "60") changesVolume = "mixed";
		if (volumeChangesDeg == "-60") changesVolume = "-8";

		// set "Number of changes" value based on knob degree
		if (numberOfChangesDeg == "0") changesNumber = "1";
		if (numberOfChangesDeg == "60") changesNumber = "2";
		if (numberOfChangesDeg == "-60") {
			changesNumber = Math.ceil(Math.random() * 2); // if unknown set 1 or 2
		}

		// shuffle sliders value
		for (let i = 0; i < changesNumber; i++) {
			let randomFreq = frequencies[Math.floor(Math.random() * 7)];

			// don't duplicate changes on the same frequency
			while (randomFreq === previousFreq) {
				randomFreq = frequencies[Math.floor(Math.random() * 7)];
			}

			const randomFreqSliderName = `${name}-slider-${randomFreq}`;
			const randomFreqSlider = document.getElementById(randomFreqSliderName);

			if (changesVolume === "+8") {
				randomFreqSlider.value = 8;
				module.changeSliderValue(randomFreq, 8);
			}
			if (changesVolume === "-8") {
				randomFreqSlider.value = -8;
				module.changeSliderValue(randomFreq, -8);
			}
			if (changesVolume === "mixed") {
				if (Math.round(Math.random()) === 0) {
					randomFreqSlider.value = -8;
					module.changeSliderValue(randomFreq, -8);
				} else {
					randomFreqSlider.value = 8;
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
