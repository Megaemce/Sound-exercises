import { audioContext, activeAllCables } from "../main.js";

export default function output() {
    const module = {};

    module.switch = document.getElementById("switch-controllers-switch");
    module.track = "A";
    module.audioNode = {
        leftNode: new GainNode(audioContext),
        rightNode: new GainNode(audioContext),
        outputNode: new GainNode(audioContext),
        switchTo(track) {
            if (track === "B") {
                module.switch.classList.remove("left");
                module.switch.classList.add("right");

                this.leftNode.disconnect();
                this.rightNode.connect(module.audioNode.outputNode);

                module.track = "B";

                activeAllCables();
            } else {
                module.switch.classList.remove("right");
                module.switch.classList.add("left");

                this.rightNode.disconnect();
                this.leftNode.connect(module.audioNode.outputNode);

                module.track = "A";

                activeAllCables();
            }
        },
    };

    module.switch.onclick = () => {
        if (module.track === "A") {
            module.audioNode.switchTo("B");
        } else {
            module.audioNode.switchTo("A");
        }
    };

    module.audioNode.leftNode.connect(module.audioNode.outputNode);

    return module;
}
