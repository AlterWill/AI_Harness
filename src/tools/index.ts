export const tools = [
  {
    functionDeclarations: [
      {
        name: "readFile",
        description: "Read a file from disk",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING"
            },
            isJSON: {
              type: "BOOLEAN"
            }
          },
          required: ["path"]
        }
      },
      {
        name: "listDirectories",
        description: "List files and directories in a path",
        parameters: {
          type: "OBJECT",
          properties: {
            path: {
              type: "STRING"
            }
          },
          required: ["path"]
        }
      }
    ]
  }
];
