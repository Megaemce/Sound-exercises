/* add button "open file..." that allows user to add file into the select */
export function addOpenFileButtonTo(selectDiv) {
    const input = document.createElement("input");
    const button = document.createElement("button");
    const fileButton = document.createElement("option");

    input.style = "display: none;";
    input.type = "file";

    button.innerText = "Open file...";

    fileButton.id = "file button";
    fileButton.appendChild(button);
    fileButton.appendChild(input);
    // module.content.options.select.fileButton.input
    fileButton.input = input;

    // module.content.options.select.fileButton
    selectDiv.appendChild(fileButton);
    selectDiv.fileButton = fileButton;
}
