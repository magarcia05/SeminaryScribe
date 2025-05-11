import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText, ArrowLeft } from "lucide-react";
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

interface Course {
  id: string;
  name: string;
  description: string;
}

export default function CourseNotesPage() {
  const { courseId } = useParams();
  
  const { data: course, isLoading: loadingCourse } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
  });

  const { data: notes = [], isLoading: loadingNotes } = useQuery<Note[]>({
    queryKey: [`/api/courses/${courseId}/notes`],
  });

  const isSpanish = course?.name.includes("Antiguo") || course?.name.includes("Español");

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6 flex items-center"
        asChild
      >
        <Link href="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isSpanish ? "Volver a cursos" : "Back to courses"}
        </Link>
      </Button>

      <div className="mb-12">
        {loadingCourse ? (
          <>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold font-serif">{course?.name}</h1>
              {isSpanish ? (
                <span className="text-xs font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">ES</span>
              ) : (
                <span className="text-xs font-normal px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-full">EN</span>
              )}
            </div>
            <p className="text-lg text-muted-foreground">
              {course?.description}
            </p>
          </>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold font-serif mb-4">
          {isSpanish ? "Notas del curso" : "Course Notes"}
        </h2>
        
        {notes.length === 0 && !loadingNotes ? (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isSpanish ? "No hay notas disponibles" : "No notes available"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isSpanish 
                ? "Este curso aún no tiene notas. Agrega algunas para comenzar."
                : "This course doesn't have any notes yet. Add some to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingNotes ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
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
                        {note.title.includes("Eclesiastés") || isSpanish ? (
                          <span className="text-xs font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">ES</span>
                        ) : (
                          <span className="text-xs font-normal px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-full">EN</span>
                        )}
                      </span>
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {note.content ? `${note.content.substring(0, 150)}...` : 'No content available'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {note.title.includes("Eclesiastés") || isSpanish ? (
                          formatSpanishDate(new Date(note.updatedAt))
                        ) : (
                          formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })
                        )}
                      </span>
                    </div>
                    <Button variant="ghost" asChild size="sm">
                      <Link href={`/note/${note.courseId}/${note.id}`}>
                        {isSpanish ? "Leer" : "Read"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}