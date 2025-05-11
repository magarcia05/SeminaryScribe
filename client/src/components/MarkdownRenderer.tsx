import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { slugify } from "@/lib/toc-utils";
import { useTheme } from "./ThemeProvider";

// No global declarations needed for our custom Bible reference handler

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const { theme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Process headings to add IDs for ToC linking
  useEffect(() => {
    if (!contentRef.current) return;
    
    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headings.forEach(heading => {
      const text = heading.textContent || '';
      const id = slugify(text);
      heading.id = id;
    });
    
    // No need for Reftagger anymore, our custom Bible reference handler 
    // will handle this automatically
  }, [content]);

  return (
    <div ref={contentRef} className={`prose prose-slate dark:prose-invert max-w-none markdown-content ${className}`}>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ node, ...props }) {
            return (
              <img
                {...props}
                className="rounded-xl shadow-lg max-w-full h-auto"
                loading="lazy"
              />
            );
          },
          a({ node, ...props }) {
            return (
              <a
                {...props}
                className="text-accent hover:underline"
                target={props.href?.startsWith("http") ? "_blank" : undefined}
                rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              />
            );
          },
          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto">
                <table {...props} />
              </div>
            );
          }
        }}
      />
    </div>
  );
}
