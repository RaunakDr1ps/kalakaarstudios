// Tiny, dependency-free markdown renderer tuned for blog bodies.
// Everything is HTML-escaped first, so user content cannot inject markup.

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  return /^(https?:\/\/|mailto:)/i.test(trimmed);
}

function renderInline(text: string): string {
  let out = escapeHtml(text);

  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");

  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_match, label: string, href: string) => {
      if (!isSafeHref(href)) return `[${label}](${href})`;
      const safeHref = escapeHtml(href.trim());
      return `<a href="${safeHref}" target="_blank" rel="nofollow ugc noopener noreferrer">${label}</a>`;
    }
  );

  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return out;
}

function renderBlock(block: string): string {
  const trimmed = block.split("\n")[0].trim() ?? "";

  if (trimmed.startsWith("```")) {
    const lines = block.split("\n");
    lines.shift();
    if (lines[lines.length - 1]?.trim() === "```") lines.pop();
    const code = lines
      .map((line) => escapeHtml(line))
      .join("\n");
    return `<pre><code>${code}</code></pre>`;
  }

  if (/^#{1,6}\s/.test(trimmed)) {
    const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
    const level = match![1]!.length;
    return `<h${level}>${renderInline(match![2] ?? "")}</h${level}>`;
  }

  if (trimmed.startsWith(">")) {
    const quote = block
      .split("\n")
      .map((line) => line.replace(/^\s*>\s?/, ""))
      .join(" ");
    return `<blockquote>${renderInline(quote)}</blockquote>`;
  }

  if (/^\s*(---+|\*\*\*+)\s*$/.test(trimmed)) {
    return "<hr />";
  }

  const unordered = block
    .split("\n")
    .filter((line) => /^\s*[-*+]\s+/.test(line));
  if (unordered.length === block.split("\n").length && unordered.length > 0) {
    const items = unordered
      .map((line) => {
        const content = line.replace(/^\s*[-*+]\s+/, "");
        return `<li>${renderInline(content)}</li>`;
      })
      .join("");
    return `<ul>${items}</ul>`;
  }

  const ordered = block
    .split("\n")
    .filter((line) => /^\s*\d+[.)]\s+/.test(line));
  if (ordered.length === block.split("\n").length && ordered.length > 0) {
    const items = ordered
      .map((line) => {
        const content = line.replace(/^\s*\d+[.)]\s+/, "");
        return `<li>${renderInline(content)}</li>`;
      })
      .join("");
    return `<ol>${items}</ol>`;
  }

  const paragraph = block.split("\n").join(" ");
  return `<p>${renderInline(paragraph)}</p>`;
}

export function renderMarkdown(markdown: string): string {
  const raw = (markdown || "").replace(/\r\n/g, "\n").trim();

  const blocks: string[] = [];
  const lines = raw.split("\n");
  let current = "";
  let inFence = false;

  const flush = () => {
    if (current.trim()) blocks.push(current.trim());
    current = "";
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inFence) {
        current += `${line}\n`;
        flush();
        inFence = false;
      } else {
        flush();
        current = `${line}\n`;
        inFence = true;
      }
      continue;
    }
    if (line.trim() === "" && !inFence) {
      flush();
      continue;
    }
    current += `${line}\n`;
  }
  flush();

  return blocks.map(renderBlock).join("\n");
}