export type keyboardCallBack = {
    onText: (text: string) => void;
    onBackspace: () => void;
    onCtrlC: () => void;
    onEnter: () => void;
    onUp?: () => void;
    onDown?: () => void;
};
export default function setupKeyboard(cb: keyboardCallBack): void;
//# sourceMappingURL=keyboard.d.ts.map