export type MessagePart = {
    text: string;
} | {
    functionCall: {
        name: string;
        args: any;
    };
} | {
    functionResponse: {
        name: string;
        response: any;
    };
};
export type message = {
    role: "system" | "user" | "model" | "function";
    text?: string;
    parts?: MessagePart[];
};
//# sourceMappingURL=message.d.ts.map