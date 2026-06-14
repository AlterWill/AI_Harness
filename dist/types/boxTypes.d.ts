export type BoxPadding = {
    Xpadding: number;
    Ypadding: number;
};
export type heavySquareBorder = {
    topLeft: "┏";
    topRight: "┓";
    bottomLeft: "┗";
    bottomRight: "┛";
    horizontal: "━";
    vertical: "┃";
};
export type heavySqaureBorder = heavySquareBorder;
export type lightSquareBorder = {
    topLeft: "┌";
    topRight: "┐";
    bottomLeft: "└";
    bottomRight: "┘";
    horizontal: "─";
    vertical: "│";
};
export type roundedBorder = {
    topLeft: "╭";
    topRight: "╮";
    bottomLeft: "╰";
    bottomRight: "╯";
    horizontal: "─";
    vertical: "│";
};
export type doubleBorder = {
    topLeft: "╔";
    topRight: "╗";
    bottomLeft: "╚";
    bottomRight: "╝";
    horizontal: "═";
    vertical: "║";
};
export type classicBorder = {
    topLeft: "+";
    topRight: "+";
    bottomLeft: "+";
    bottomRight: "+";
    horizontal: "-";
    vertical: "|";
};
export type blockBorder = {
    topLeft: "█";
    topRight: "█";
    bottomLeft: "█";
    bottomRight: "█";
    horizontal: "▀";
    vertical: "█";
};
export type starBorder = {
    topLeft: "*";
    topRight: "*";
    bottomLeft: "*";
    bottomRight: "*";
    horizontal: "*";
    vertical: "*";
};
export type borderStyle = {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    horizontal: string;
    vertical: string;
} | heavySquareBorder | lightSquareBorder | roundedBorder | doubleBorder | classicBorder | blockBorder | starBorder;
export declare const BORDER_PRESETS: {
    readonly heavy: {
        readonly topLeft: "┏";
        readonly topRight: "┓";
        readonly bottomLeft: "┗";
        readonly bottomRight: "┛";
        readonly horizontal: "━";
        readonly vertical: "┃";
    };
    readonly light: {
        readonly topLeft: "┌";
        readonly topRight: "┐";
        readonly bottomLeft: "└";
        readonly bottomRight: "┘";
        readonly horizontal: "─";
        readonly vertical: "│";
    };
    readonly rounded: {
        readonly topLeft: "╭";
        readonly topRight: "╮";
        readonly bottomLeft: "╰";
        readonly bottomRight: "╯";
        readonly horizontal: "─";
        readonly vertical: "│";
    };
    readonly double: {
        readonly topLeft: "╔";
        readonly topRight: "╗";
        readonly bottomLeft: "╚";
        readonly bottomRight: "╝";
        readonly horizontal: "═";
        readonly vertical: "║";
    };
    readonly classic: {
        readonly topLeft: "+";
        readonly topRight: "+";
        readonly bottomLeft: "+";
        readonly bottomRight: "+";
        readonly horizontal: "-";
        readonly vertical: "|";
    };
    readonly block: {
        readonly topLeft: "█";
        readonly topRight: "█";
        readonly bottomLeft: "█";
        readonly bottomRight: "█";
        readonly horizontal: "▀";
        readonly vertical: "█";
    };
    readonly star: {
        readonly topLeft: "*";
        readonly topRight: "*";
        readonly bottomLeft: "*";
        readonly bottomRight: "*";
        readonly horizontal: "*";
        readonly vertical: "*";
    };
};
//# sourceMappingURL=boxTypes.d.ts.map