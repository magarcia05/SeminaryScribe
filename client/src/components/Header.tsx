import { useTheme } from "./ThemeProvider";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Moon, Sun, Menu, Search, Scroll } from "lucide-react";
import SearchOverlay from "./SearchOverlay";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [location, navigate] = useLocation();
  const [searchOverlay, setSearchOverlay] = useState(false);
  
  // Generate breadcrumbs from the URL
  const generateBreadcrumbs = () => {
    if (location === "/") return [];
    
    const paths = location.split("/").filter(Boolean);
    const result = [];
    
    let currentPath = "";
    for (let i = 0; i < paths.length; i++) {
      const isLast = i === paths.length - 1;
      currentPath += `/${paths[i]}`;
      
      // Format the label (capitalize, replace hyphens with spaces)
      const label = paths[i]
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      result.push({
        path: currentPath,
        label,
        isLast
      });
    }
    
    return result;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden text-muted-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <Scroll className="h-6 w-6 text-accent" />
              <span className="font-semibold text-lg">Seminary Notes</span>
            </Link>
            
            <div className="hidden md:flex ml-4 space-x-4">
              <Link 
                href="/courses" 
                className={`text-sm font-medium transition-colors hover:text-accent ${location === "/courses" ? "text-accent" : "text-muted-foreground"}`}
              >
                Courses
              </Link>
              <Link 
                href="/notes" 
                className={`text-sm font-medium transition-colors hover:text-accent ${location === "/notes" ? "text-accent" : "text-muted-foreground"}`}
              >
                Notes
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-10 pr-4 py-2 w-64"
                onClick={() => setSearchOverlay(true)}
                onFocus={() => setSearchOverlay(true)}
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOverlay(true)}
              className="md:hidden text-muted-foreground hover:bg-muted"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-muted-foreground hover:bg-muted"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {breadcrumbs.length > 0 && (
          <div className="px-4 py-2 md:px-6 flex items-center text-sm text-muted-foreground bg-muted/50">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-accent dark:hover:text-accent-400">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-xs">/</span>
                    {crumb.isLast ? (
                      <span className="font-medium text-foreground">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link 
                        href={crumb.path} 
                        className="hover:text-accent dark:hover:text-accent-400"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}
      </header>
      
      <SearchOverlay isOpen={searchOverlay} onClose={() => setSearchOverlay(false)} />
    </>
  );
}
