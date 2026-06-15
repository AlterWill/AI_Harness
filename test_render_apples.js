import renderMarkdown from "./dist/utils/markdown.js";

const text = `AI: Sure, here's a small example showcasing a few common Markdown features:

  # My Favorite Fruit 🍎

  Here are a few reasons why I love **apples**:

  *   They're healthy and delicious.
  *   Easy to find in most stores.
  *   Come in many varieties (Granny Smith, Fuji, Gala!).

  You can learn more about apples on [Wikipedia](https://en.wikipedia/wiki/Apple).

  Enjoy your snack!`;

console.log(JSON.stringify(renderMarkdown(text)));
console.log("\n--- Rendered Output ---\n");
console.log(renderMarkdown(text));
