import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BookOpen, Book, Church, HandHelping, 
  Brain, FileText, Clock, Hash, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

type Course = {
  id: string;
  name: string;
  icon: string;
};

type Note = {
  id: string;
  title: string;
  courseId: string;
  updatedAt: string;
};

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const [location] = useLocation();
  
  // Get available courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Get recent notes
  const { data: recentNotes = [] } = useQuery<Note[]>({
    queryKey: ['/api/notes/recent'],
  });
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      
      if (sidebar && 
          !sidebar.contains(event.target as Node) && 
          window.innerWidth < 1024 && 
          isOpen) {
        closeSidebar();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSidebar]);
  
  // Helper function to get the appropriate icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "book-open":
        return <BookOpen className="h-4 w-4 mr-2" />;
      case "book":
        return <Book className="h-4 w-4 mr-2" />;
      case "church":
        return <Church className="h-4 w-4 mr-2" />;
      case "praying-hands":
        return <HandHelping className="h-4 w-4 mr-2" />;
      case "brain":
        return <Brain className="h-4 w-4 mr-2" />;
      default:
        return <Book className="h-4 w-4 mr-2" />;
    }
  };
  
  // Format a path for a note
  const getNotePath = (courseId: string, noteId: string) => {
    return `/note/${courseId}/${noteId}`;
  };
  
  return (
    <aside 
      id="sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 transform pt-16 h-full border-r border-primary-200 dark:border-primary-700 transition-transform duration-300 overflow-y-auto",
        "bg-sidebar dark:bg-sidebar",
        {
          "-translate-x-full": !isOpen,
          "translate-x-0": isOpen,
          "lg:translate-x-0": true // Always visible on large screens
        }
      )}
    >
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Courses
            </h2>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-1">
            {courses.map((course) => {
              const isActive = location.includes(`/note/${course.id}`);
              return (
                <li key={course.id}>
                  <Link 
                    href={`/course/${course.id}`}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      {
                        "text-sidebar-foreground bg-sidebar-accent": isActive,
                        "text-foreground hover:bg-sidebar-accent": !isActive
                      }
                    )}
                  >
                    {getIconComponent(course.icon)}
                    <span>{course.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Recent Notes
            </h2>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Clock className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-1">
            {recentNotes.map((note) => {
              const notePath = getNotePath(note.courseId, note.id);
              const isActive = location === notePath;
              
              return (
                <li key={note.id}>
                  <Link 
                    href={notePath} 
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      {
                        "text-sidebar-foreground bg-sidebar-accent": isActive,
                        "text-foreground hover:bg-sidebar-accent": !isActive
                      }
                    )}
                  >
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{note.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Tags
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              #gospel
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              #jesus
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              #theology
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              #exegesis
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
              #history
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
