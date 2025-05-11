import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/toc-utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  markdown: string;
  className?: string;
}

export default function TableOfContents({ markdown, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<TocItem[]>([]);
  
  // Extract headings from markdown
  useEffect(() => {
    if (!markdown) return;
    
    // Find all headings (# Heading) using regex
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings: TocItem[] = [];
    let match;
    
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text);
      
      extractedHeadings.push({
        id,
        text,
        level
      });
    }
    
    setHeadings(extractedHeadings);
  }, [markdown]);
  
  // Handle scroll to update active heading
  useEffect(() => {
    if (headings.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px"
      }
    );
    
    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });
    
    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);
  
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };
  
  return (
    <aside className={cn("hidden xl:block w-72 p-4 border-l border-border overflow-y-auto bg-muted/50 dark:bg-muted/20", className)}>
      <div className="sticky top-20">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
          Table of Contents
        </h3>
        <nav className="toc">
          <ul className="space-y-1 text-sm">
            {headings.map((heading) => (
              <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 0.75}rem` }}>
                <button
                  onClick={() => handleClick(heading.id)}
                  className={cn(
                    "w-full text-left px-2 py-1 rounded-md hover:bg-muted",
                    {
                      "text-foreground bg-muted": heading.id === activeId,
                      "text-muted-foreground": heading.id !== activeId
                    }
                  )}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
