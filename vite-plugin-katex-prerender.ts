import type { Plugin } from "vite";
import katex from "katex";

// Matches both orderings:
//   <Math tex="..." />
//   <Math display tex="..." />
//   <Math tex="..." display />
const MATH_RE =
  /<Math\s+(?:(display)\s+)?tex="([^"]+)"(?:\s+(display))?\s*\/>/g;

// Matches the Math-only import line from any math component path
const IMPORT_RE =
  /^import\s*\{\s*Math\s*\}\s*from\s*["'][^"']*math[^"']*["'];?\r?\n?/gm;

export function katexPrerender(): Plugin {
  let totalCount = 0;

  return {
    name: "vite-plugin-katex-prerender",
    enforce: "pre",

    transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return null;
      if (!code.includes("<Math")) return null;

      let fileCount = 0;

      const transformed = code.replace(
        MATH_RE,
        (_, displayBefore, tex, displayAfter) => {
          const displayMode = !!(displayBefore || displayAfter);
          let html: string;
          try {
            html = katex.renderToString(tex, {
              displayMode,
              throwOnError: false,
              output: "html",
            });
          } catch {
            // Fallback: show raw tex so nothing silently disappears
            html = `<span class="katex-error" title="${tex}">[math error]</span>`;
          }
          fileCount++;
          const cls = displayMode ? "katex-display-block" : "katex-inline";
          return `<span class="${cls}" dangerouslySetInnerHTML={${JSON.stringify(html)}} />`;
        },
      );

      if (fileCount === 0) return null;

      totalCount += fileCount;

      // Drop the now-unused Math import
      const result = transformed.replace(IMPORT_RE, "");

      return { code: result, map: null };
    },

    buildEnd() {
      if (totalCount > 0) {
        console.log(
          `[katex-prerender] Pre-rendered ${totalCount} math expressions across all pages`,
        );
      }
    },
  };
}
