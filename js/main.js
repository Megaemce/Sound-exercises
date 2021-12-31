import output from "./effects/output.js";
import crossfade from "./effects/crossfade.js";
import equalizer from "./effects/equalizer.js";
import audioSource from "./effects/audioSource.js";
import { loadFilesIntoAudioContext } from "./helpers/loaders.js";

// set all the initial variables
export let cables = {}; // keep all cables
export let modules = {}; // keep all modules
export let audioContext;

const sounds = ["white-noise.wav", "pink-noise.wav"];

// start audio with user interaction (chrome policy)
document.onmousemove = () => {
    try {
        audioContext = new AudioContext();
    } catch (e) {
        alert("The Web Audio API is not supported in this browser.");
    }

    loadFilesIntoAudioContext(sounds, true);

    document.onmousemove = undefined;
};

document.getElementById("output").onmousedown = output;
document.getElementById("crossfade").onmousedown = crossfade;
document.getElementById("equalizer").onmousedown = equalizer;
document.getElementById("audioSource").onmousedown = audioSource;

// preventing enter key from adding space in name/parameter edition
document.onkeydown = (event) => {
    event.key === "Enter" && event.preventDefault();
};
