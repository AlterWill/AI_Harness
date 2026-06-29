export type MessagePart =
  | { text: string }
  | { functionCall: { name: string; args: any; id?: string | undefined }; thoughtSignature?: string | undefined }
  | { functionResponse: { name: string; response: any; id?: string | undefined } };

export type message = {
  role: "system" | "user" | "model" | "function";
  text?: string;
  parts?: MessagePart[];
};


