import Prism from "prismjs";

Prism.languages.latex = {
  comment: {
    pattern: /%.*/,
    greedy: true,
  },
  environment: {
    pattern: /\\(?:begin|end)\{[^}]+\}/,
    alias: "function",
  },
  command: {
    pattern: /\\[a-zA-Z@]+\*?/,
    alias: "keyword",
  },
  bracket: {
    pattern: /[[\]]/,
    alias: "punctuation",
  },
  brace: {
    pattern: /[{}]/,
    alias: "punctuation",
  },
  ampersand: {
    pattern: /&/,
    alias: "operator",
  },
  mathmode: {
    pattern: /\$[^$]*\$/,
    alias: "string",
  },
};

Prism.languages.tex = Prism.languages.latex;

export function highlightLatex(code: string): string {
  return Prism.highlight(code, Prism.languages.latex, "latex");
}
