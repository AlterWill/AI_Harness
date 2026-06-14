import type { borderStyle, BoxPadding } from "../../types/boxTypes.js";
import { BORDER_PRESETS } from "../../types/boxTypes.js";
export default class Box {
    text: string;
    align: "center" | "left";
    width: number;
    height: number;
    Xpadding: number;
    Ypadding: number;
    borderCharacters: borderStyle;
    constructor(text: string, align: "center" | "left");
    addDimeansions(width: number, height: number): void;
    addPadding(padding: BoxPadding | number, maybeYpadding?: number): void;
    setBorder(style: borderStyle | keyof typeof BORDER_PRESETS): void;
    setBorderCharacters(...chars: string[]): void;
    getCursorOffset(): {
        x: number;
        y: number;
    };
    render(): string[];
}
//# sourceMappingURL=box.d.ts.map