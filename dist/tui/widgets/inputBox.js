import Box from "./box.js";
import splitByWords from "../../utils/splitByWords.js";
import { BORDER_PRESETS } from "../../types/boxTypes.js";
export default class InputBox extends Box {
    constructor(text, align = "left") {
        super(text, align);
        // Default to heavy border characters
        this.borderCharacters = BORDER_PRESETS.heavy;
    }
}
export function renderInputBox(inputBoxText, inputBoxWidth, inputBoxTextXAxisPadding, inputBoxTextXAxisMargin) {
    const inputLines = splitByWords(inputBoxText, inputBoxWidth);
    const boxHeight = Math.max(inputLines.length, 1) + 2;
    const boxWidth = inputBoxWidth + 2 * inputBoxTextXAxisPadding + 2;
    const inputBox = new InputBox(inputBoxText, "left");
    inputBox.addDimeansions(boxWidth, boxHeight);
    inputBox.addPadding(inputBoxTextXAxisPadding);
    const margin = " ".repeat(inputBoxTextXAxisMargin);
    return inputBox.render().map(line => margin + line + margin).join("\n");
}
//# sourceMappingURL=inputBox.js.map