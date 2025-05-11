import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/toc-utils";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  headings: TocItem[];
  activeId: string;
}

export default function TocOverlay({ isOpen, onClose, headings, activeId }: TocOverlayProps) {
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Table of Contents</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <nav className="toc">
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li 
                  key={heading.id} 
                  style={{ marginLeft: `${(heading.level - 1) * 0.75}rem` }}
                >
                  <button
                    onClick={() => handleHeadingClick(heading.id)}
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
      </DialogContent>
    </Dialog>
  );
}
