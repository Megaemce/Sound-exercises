import { audioContext } from "../main.js";

export default function output() {
    const module = {};

    module.switch = document.getElementById("switch-controllers-switch");
    module.track = "left";
    module.audioNode = {
        leftNode: new GainNode(audioContext),
        rightNode: new GainNode(audioContext),
        outputNode: new GainNode(audioContext),
        switchTo(track) {
            if (track === "right") {
                module.switch.classList.remove("left");
                module.switch.classList.add("right");

                this.leftNode.disconnect();
                this.rightNode.connect(module.audioNode.outputNode);

                module.track = "right";
            } else {
                module.switch.classList.remove("right");
                module.switch.classList.add("left");

                this.rightNode.disconnect();
                this.leftNode.connect(module.audioNode.outputNode);

                module.track = "left";
            }
        },
    };

    module.switch.onclick = () => {
        if (module.track === "left") {
            module.audioNode.switchTo("right");
        } else {
            module.audioNode.switchTo("left");
        }
    };

    module.audioNode.leftNode.connect(module.audioNode.outputNode);

    return module;
}
