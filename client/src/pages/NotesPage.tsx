import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText } from "lucide-react";
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
  updatedAt: string;
  courseId: string;
  excerpt?: string;
  content?: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  noteCount: number;
}

export default function NotesPage() {
  const { data: notes = [], isLoading: loadingNotes } = useQuery<Note[]>({
    queryKey: ['/api/notes'],
  });

  const { data: courses = [], isLoading: loadingCourses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });
  
  const isLoading = loadingNotes || loadingCourses;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-serif mb-4">All Notes</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse all your seminary class notes in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="flex items-center gap-2">
                    {note.title}
                    {note.title.includes("Eclesiastés") || note.title.includes("Cantar") || note.courseId.includes("Antiguo") ? (
                      <span className="text-xs font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">ES</span>
                    ) : (
                      <span className="text-xs font-normal px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-full">EN</span>
                    )}
                  </span>
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                </CardTitle>
                <CardDescription>
                  {courses.find(c => c.id === note.courseId)?.name || note.courseId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {note.excerpt || note.content?.substring(0, 150)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {note.title.includes("Eclesiastés") || note.title.includes("Cantar") || note.courseId.includes("Antiguo") ? (
                      formatSpanishDate(new Date(note.updatedAt))
                    ) : (
                      formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
                    )}
                  </span>
                </div>
                <Button variant="ghost" asChild size="sm">
                  <Link href={`/note/${note.courseId}/${note.id}`}>
                    Read
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}