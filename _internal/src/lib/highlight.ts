import type { Highlighter, Lang, Theme } from "shiki";
import { renderToHtml, getHighlighter, loadTheme } from "shiki";

let highlighter: Highlighter;
export async function highlight(code: string, lang: string) {
  if (!highlighter) {
    const theme = await loadTheme("../../src/highlight/one-light.json");
    highlighter = await getHighlighter({
      langs: [
        "ts",
        "yaml",
        "md",
        {
          id: "keel",
          scopeName: "source.keel",
          path: "../../src/highlight/keel.tmGrammar.json",
          aliases: ["keel"],
        },
      ],
      theme: theme,
    });
  }

  const tokens = highlighter.codeToThemedTokens(code, lang, undefined, {
    includeExplanation: false,
  });
  const html = renderToHtml(tokens, { bg: "transparent" });

  return html;
}
