import { component$ } from "@builder.io/qwik";
import katex from "katex";

interface MathProps {
  tex: string;
  display?: boolean;
}

export const Math = component$<MathProps>(({ tex, display = false }) => {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    output: "html",
  });

  return (
    <span
      class={display ? "katex-display-block" : "katex-inline"}
      dangerouslySetInnerHTML={html}
    />
  );
});
