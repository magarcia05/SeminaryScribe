import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Course {
  id: string;
  name: string;
  description: string;
  noteCount: number;
}

interface RecentNote {
  id: string;
  title: string;
  updatedAt: string;
  courseId: string;
  excerpt?: string;
  content?: string;
}

export default function Home() {
  const { data: courses = [], isLoading: loadingCourses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: recentNotes = [], isLoading: loadingNotes } = useQuery<RecentNote[]>({
    queryKey: ['/api/notes/recent'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-serif mb-4">Seminary Notes</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse your seminary class notes with this beautiful, responsive markdown renderer.
          Supporting notes in multiple languages.
        </p>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif">Courses</h2>
          <Button variant="outline" asChild>
            <Link href="/courses">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCourses ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {course.name}
                    {course.name.includes("Antiguo") || course.name.includes("Español") ? (
                      <span className="text-xs font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">ES</span>
                    ) : (
                      <span className="text-xs font-normal px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-full">EN</span>
                    )}
                  </CardTitle>
                  <CardDescription>{course.noteCount} notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {course.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/course/${course.id}`}>
                      Browse Notes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif">Recent Notes</h2>
          <Button variant="outline" asChild>
            <Link href="/notes">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingNotes ? (
            Array(4).fill(0).map((_, i) => (
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
            recentNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="flex items-center gap-2">
                      {note.title}
                      {note.title.includes("Eclesiastés") || note.courseId.includes("Antiguo") ? (
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
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
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
    </div>
  );
}
