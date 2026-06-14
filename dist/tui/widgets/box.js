import { BORDER_PRESETS } from "../../types/boxTypes.js";
import splitByWords from "../../utils/splitByWords.js";
export default class Box {
    text;
    align;
    width;
    height;
    Xpadding;
    Ypadding;
    borderCharacters;
    constructor(text, align) {
        this.text = text;
        this.align = align;
        this.height = 0;
        this.width = 0;
        this.Xpadding = 0;
        this.Ypadding = 0;
        this.borderCharacters = BORDER_PRESETS.heavy;
    }
    addDimeansions(width, height) {
        this.width = width;
        this.height = height;
    }
    addPadding(padding, maybeYpadding) {
        let Xpadding;
        let Ypadding;
        if (typeof padding === "object" && padding !== null) {
            Xpadding = padding.Xpadding;
            Ypadding = padding.Ypadding;
        }
        else if (typeof padding === "number") {
            Xpadding = padding;
            Ypadding = maybeYpadding ?? 0;
        }
        else {
            throw new Error("Expected BoxPadding object or Xpadding and Ypadding as numbers");
        }
        if (Xpadding * 2 > this.width - (2 * this.borderCharacters.vertical.length)) {
            throw new Error("The X-axis padding can't be more than half of the Box's width and vertical border combined");
        }
        if (Ypadding * 2 > this.height - 2) {
            throw new Error("The Y-axis padding can't be more than half of the Box's height and horizontal border combined");
        }
        this.Xpadding = Xpadding;
        this.Ypadding = Ypadding;
    }
    setBorder(style) {
        if (typeof style === "string") {
            const preset = BORDER_PRESETS[style];
            if (preset) {
                this.borderCharacters = preset;
            }
            else {
                throw new Error(`Unknown border preset: ${style}`);
            }
        }
        else {
            this.borderCharacters = style;
        }
    }
    setBorderCharacters(...chars) {
        const getChar = (idx) => chars[idx] ?? "";
        switch (chars.length) {
            case 1:
                this.borderCharacters = {
                    topLeft: getChar(0),
                    topRight: getChar(0),
                    bottomLeft: getChar(0),
                    bottomRight: getChar(0),
                    horizontal: getChar(0),
                    vertical: getChar(0),
                };
                break;
            case 2:
                this.borderCharacters = {
                    topLeft: getChar(0),
                    topRight: getChar(0),
                    bottomLeft: getChar(0),
                    bottomRight: getChar(0),
                    horizontal: getChar(1),
                    vertical: getChar(0),
                };
                break;
            case 3:
                this.borderCharacters = {
                    topLeft: getChar(2),
                    topRight: getChar(2),
                    bottomLeft: getChar(2),
                    bottomRight: getChar(2),
                    horizontal: getChar(1),
                    vertical: getChar(0),
                };
                break;
            case 6:
                this.borderCharacters = {
                    topLeft: getChar(2),
                    topRight: getChar(3),
                    bottomLeft: getChar(4),
                    bottomRight: getChar(5),
                    horizontal: getChar(1),
                    vertical: getChar(0),
                };
                break;
            default:
                throw new Error("Expected 1,2,3 or 6 characters");
        }
    }
    getCursorOffset() {
        let splitWidth = this.width - (2 * this.Xpadding) - (2 * this.borderCharacters.vertical.length);
        let lines = splitByWords(this.text, splitWidth);
        let lastLine = lines[lines.length - 1] ?? "";
        return {
            x: this.borderCharacters.vertical.length + this.Xpadding + lastLine.length + 1,
            y: Math.max(lines.length, 1)
        };
    }
    render() {
        let result = [];
        let outputText = splitByWords(this.text, this.width - (2 * this.Xpadding) - (2 * this.borderCharacters.vertical.length));
        let textCounter = 0;
        for (let i = 0; i < this.height; i++) {
            if (i == 0) {
                result.push(this.borderCharacters.topLeft +
                    this.borderCharacters.horizontal.repeat(this.width - this.borderCharacters.topLeft.length - this.borderCharacters.topRight.length) +
                    this.borderCharacters.topRight);
            }
            else if (i == this.height - 1) {
                result.push(this.borderCharacters.bottomLeft +
                    this.borderCharacters.horizontal.repeat(this.width - this.borderCharacters.bottomLeft.length - this.borderCharacters.bottomRight.length) +
                    this.borderCharacters.bottomRight);
            }
            else if (i <= this.Ypadding || i + 1 > this.height - this.Ypadding - 1) {
                result.push(this.borderCharacters.vertical +
                    " ".repeat(this.width - (2 * this.borderCharacters.vertical.length)) +
                    this.borderCharacters.vertical);
            }
            else {
                const textLine = outputText[textCounter];
                if (textLine === undefined) {
                    result.push(this.borderCharacters.vertical +
                        " ".repeat(this.width - (2 * this.borderCharacters.vertical.length)) +
                        this.borderCharacters.vertical);
                }
                else {
                    result.push(this.borderCharacters.vertical +
                        " ".repeat(this.Xpadding) +
                        textLine +
                        " ".repeat(this.width - textLine.length - (2 * this.Xpadding) - (2 * this.borderCharacters.vertical.length)) +
                        " ".repeat(this.Xpadding) +
                        this.borderCharacters.vertical);
                    textCounter++;
                }
            }
        }
        return result;
    }
}
//# sourceMappingURL=box.js.map