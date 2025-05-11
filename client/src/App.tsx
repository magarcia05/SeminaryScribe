import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import NotePage from "@/pages/NotePage";
import CoursesPage from "@/pages/CoursesPage";
import NotesPage from "@/pages/NotesPage";
import CourseNotesPage from "@/pages/CourseNotesPage";
import SearchPage from "@/pages/SearchPage";
import Layout from "@/components/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/notes" component={NotesPage} />
      <Route path="/course/:courseId" component={CourseNotesPage} />
      <Route path="/note/:courseId/:noteId" component={NotePage} />
      <Route path="/search" component={SearchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Layout>
        <Router />
      </Layout>
    </TooltipProvider>
  );
}

export default App;
