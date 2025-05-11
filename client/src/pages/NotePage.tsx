import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import TocOverlay from "@/components/TocOverlay";
import SimpleBibleRefs from "@/components/SimpleBibleRefs";
import { extractHeadings } from "@/lib/toc-utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { List, Download, Share2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// No direct import support for ES locale, we'll use a workaround for dates
const formatSpanishDate = (date: Date) => {
  // Simple Spanish date formatter that doesn't rely on locale
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return "hoy";
  if (diff === 1) return "ayer";
  if (diff < 7) return `hace ${diff} días`;
  if (diff < 30) return `hace ${Math.floor(diff / 7)} semanas`;
  if (diff < 365) return `hace ${Math.floor(diff / 30)} meses`;
  return `hace ${Math.floor(diff / 365)} años`;
};

interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  updatedAt: string;
}

export default function NotePage() {
  const { courseId, noteId } = useParams();
  const [tocOpen, setTocOpen] = useState(false);
  const [headings, setHeadings] = useState<any[]>([]);
  const [activeId, setActiveId] = useState("");
  const [noteLanguage, setNoteLanguage] = useState<'english' | 'spanish'>('english');
  
  const { data: note, isLoading } = useQuery<Note>({
    queryKey: [`/api/notes/${noteId}`],
  });
  
  // Extract headings from markdown content
  useEffect(() => {
    if (note?.content) {
      const extractedHeadings = extractHeadings(note.content);
      setHeadings(extractedHeadings);
      
      if (extractedHeadings.length > 0 && !activeId) {
        setActiveId(extractedHeadings[0].id);
      }
      
      // Detect language
      const isSpanish = 
        note.title.includes("Eclesiastés") || 
        note.content.includes("español") || 
        note.content.includes("Español");
      
      setNoteLanguage(isSpanish ? 'spanish' : 'english');
      
      // Language detection is sufficient now with our custom implementation
      // No need to manually trigger anything
    }
  }, [note?.content, activeId]);
  
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
  
  return (
    <div className="flex flex-1">
      {/* Add Bible reference handler */}
      <SimpleBibleRefs language={noteLanguage} contentSelector=".prose" />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-start justify-between">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-64 mb-2" />
                  <Skeleton className="h-5 w-40" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold font-serif text-foreground flex items-center gap-3">
                    {note?.title}
                    {note?.title.includes("Eclesiastés") || 
                     note?.content.includes("español") || 
                     note?.content.includes("Español") ? (
                      <span className="text-xs font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">ES</span>
                    ) : (
                      <span className="text-xs font-normal px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-full">EN</span>
                    )}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {note?.title.includes("Eclesiastés") || 
                     note?.content.includes("español") || 
                     note?.content.includes("Español") ? (
                      <>Última actualización: {note?.updatedAt 
                        ? formatSpanishDate(new Date(note.updatedAt)) 
                        : "Desconocido"}</>
                    ) : (
                      <>Last updated: {note?.updatedAt 
                        ? formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true }) 
                        : "Unknown"}</>
                    )}
                  </p>
                </>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setTocOpen(true)}
              >
                <List className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/6" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/6" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <article className="markdown-content font-serif">
              <MarkdownRenderer content={note?.content || ''} />
            </article>
          )}
        </div>
      </main>
      
      {note?.content && (
        <TableOfContents markdown={note.content} />
      )}
      
      <TocOverlay 
        isOpen={tocOpen} 
        onClose={() => setTocOpen(false)} 
        headings={headings}
        activeId={activeId}
      />
    </div>
  );
}
