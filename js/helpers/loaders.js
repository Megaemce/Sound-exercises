import { audioContext } from "../main.js";
import { addOpenFileButtonTo } from "./builders.js";

export function openFileHandler(module) {
    const reader = new FileReader();
    const fileLoaded = module.openFileInput.files[0];
    const openFileButton = document.getElementById("file button");

    // when file is loaded as array buffer
    reader.onload = function () {
        const fileAsArrayBuffer = this.result;
        // when file is decoded as an audio
        audioContext
            .decodeAudioData(fileAsArrayBuffer)
            .then(function (decodedData) {
                // store it as an module buffer
                module.buffer = decodedData;
                // load into buffer array
                audioContext.nameSoundBuffer[fileLoaded.name] = decodedData;

                openFileButton.innerHTML = fileLoaded.name;
                openFileButton.removeAttribute("id"); // not button anymore

                // add another "open file..." button
                addOpenFileButtonTo(module.select);
            })
            .catch((error) => {
                module.select.value = module.select.options[0].text;
                alert("Unable to decode audio data");
            });
    };
    reader.onerror = () => {
        alert("Error: " + reader.error);
    };

    reader.readAsArrayBuffer(fileLoaded);
}
