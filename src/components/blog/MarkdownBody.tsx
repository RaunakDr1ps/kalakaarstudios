"use client";

import type { AnchorHTMLAttributes, ClassAttributes } from "react";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownBodyProps = {
  markdown: string;
};

export default function MarkdownBody({ markdown }: MarkdownBodyProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: (
          props: ClassAttributes<HTMLAnchorElement> &
            AnchorHTMLAttributes<HTMLAnchorElement> &
            ExtraProps
        ) => {
          const { href, children } = props;
          return (
            <a href={href} target="_blank" rel="nofollow ugc noopener noreferrer">
              {children}
            </a>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}