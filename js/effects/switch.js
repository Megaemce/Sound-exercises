import { audioContext } from "../main.js";

export default function outputSwitch() {
    const module = {};

    module.switch = document.getElementById("switch-controllers-switch");
    module.track = "right";
    module.audioNode = {
        leftNode: new GainNode(audioContext),
        rightNode: new GainNode(audioContext),
        outputNode: new GainNode(audioContext),
        switchTo(track) {
            if (track === "right") {
                this.leftNode.disconnect();
                this.rightNode.connect(module.audioNode.outputNode);
                module.track = "right";
            } else {
                this.rightNode.disconnect();
                this.leftNode.connect(module.audioNode.outputNode);
                module.track = "left";
            }
        },
    };

    module.switch.onclick = () => {
        if (module.track === "left") {
            module.audioNode.switchTo("right");
            module.switch.classList.remove("left");
            module.switch.classList.add("right");
        } else {
            module.audioNode.switchTo("left");
            module.switch.classList.remove("right");
            module.switch.classList.add("left");
        }
    };

    module.audioNode.rightNode.connect(module.audioNode.outputNode);

    return module;
}
