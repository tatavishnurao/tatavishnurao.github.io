import type { ReactNode } from "react";

export function renderMarkdown(markdown: string) {
  const lines = markdown.trim().split("\n");
  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];
  let code: string[] | null = null;
  let codeKey = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    nodes.push(
      <p key={`p-${nodes.length}`}>{renderInline(paragraph.join(" "))}</p>
    );
    paragraph = [];
  };

  lines.forEach((line) => {
    if (line.startsWith("```")) {
      if (code) {
        nodes.push(
          <pre key={`code-${codeKey++}`}>
            <code>{code.join("\n")}</code>
          </pre>
        );
        code = null;
      } else {
        flushParagraph();
        code = [];
      }
      return;
    }

    if (code) {
      code.push(line);
      return;
    }

    if (line.trim() === "") {
      flushParagraph();
      return;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      nodes.push(<h2 key={`h2-${nodes.length}`}>{line.replace("## ", "")}</h2>);
      return;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      nodes.push(<h3 key={`h3-${nodes.length}`}>{line.replace("### ", "")}</h3>);
      return;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      nodes.push(
        <blockquote key={`quote-${nodes.length}`}>
          {renderInline(line.replace("> ", ""))}
        </blockquote>
      );
      return;
    }

    paragraph.push(line.trim());
  });

  flushParagraph();

  return nodes;
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\$[^$]+\$|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    if (part.startsWith("$") && part.endsWith("$")) {
      return (
        <span className="math" key={index}>
          {part.slice(1, -1)}
        </span>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a href={linkMatch[2]} key={index}>
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}
