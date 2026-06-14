export type BoxPadding = {
  Xpadding: number
  Ypadding: number
}

export type heavySquareBorder = {
  topLeft: "┏",
  topRight: "┓",
  bottomLeft: "┗",
  bottomRight: "┛",
  horizontal: "━";
  vertical: "┃";
}

// Keep the old name as alias just in case, but spell it correctly for our new code
export type heavySqaureBorder = heavySquareBorder;

export type lightSquareBorder = {
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  horizontal: "─";
  vertical: "│";
}

export type roundedBorder = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─";
  vertical: "│";
}

export type doubleBorder = {
  topLeft: "╔",
  topRight: "╗",
  bottomLeft: "╚",
  bottomRight: "╝",
  horizontal: "═";
  vertical: "║";
}

export type classicBorder = {
  topLeft: "+",
  topRight: "+",
  bottomLeft: "+",
  bottomRight: "+",
  horizontal: "-";
  vertical: "|";
}

export type blockBorder = {
  topLeft: "█",
  topRight: "█",
  bottomLeft: "█",
  bottomRight: "█",
  horizontal: "▀";
  vertical: "█";
}

export type starBorder = {
  topLeft: "*",
  topRight: "*",
  bottomLeft: "*",
  bottomRight: "*",
  horizontal: "*";
  vertical: "*";
}

export type borderStyle = {
  topLeft: string,
  topRight: string,
  bottomLeft: string,
  bottomRight: string,
  horizontal: string;
  vertical: string;
} | heavySquareBorder | lightSquareBorder | roundedBorder | doubleBorder | classicBorder | blockBorder | starBorder;

export const BORDER_PRESETS = {
  heavy: {
    topLeft: "┏",
    topRight: "┓",
    bottomLeft: "┗",
    bottomRight: "┛",
    horizontal: "━",
    vertical: "┃",
  },
  light: {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│",
  },
  rounded: {
    topLeft: "╭",
    topRight: "╮",
    bottomLeft: "╰",
    bottomRight: "╯",
    horizontal: "─",
    vertical: "│",
  },
  double: {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    horizontal: "═",
    vertical: "║",
  },
  classic: {
    topLeft: "+",
    topRight: "+",
    bottomLeft: "+",
    bottomRight: "+",
    horizontal: "-",
    vertical: "|",
  },
  block: {
    topLeft: "█",
    topRight: "█",
    bottomLeft: "█",
    bottomRight: "█",
    horizontal: "▀",
    vertical: "█",
  },
  star: {
    topLeft: "*",
    topRight: "*",
    bottomLeft: "*",
    bottomRight: "*",
    horizontal: "*",
    vertical: "*",
  }
} as const;
