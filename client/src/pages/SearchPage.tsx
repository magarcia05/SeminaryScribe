import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileText } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  courseId: string;
  courseName: string;
  matches: string[];
}

export default function SearchPage() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extract query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const query = params.get("q") || "";
    setSearchQuery(query);
  }, [location]);
  
  // Search query
  const { data: results = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ['/api/search', searchQuery],
    enabled: searchQuery.length > 0,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("q", searchQuery);
      window.history.replaceState(null, "", `/search?${params.toString()}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold font-serif mb-6">Search Results</h1>
        
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-primary-500 dark:text-primary-400 mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
            
            {results.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary-400" />
                    {result.title}
                  </CardTitle>
                  <p className="text-sm text-primary-500 dark:text-primary-400">
                    Course: {result.courseName}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-600 dark:text-primary-400">
                    {result.excerpt}
                  </p>
                  
                  {result.matches.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-primary-500 dark:text-primary-400">
                        Matches:
                      </p>
                      {result.matches.map((match, index) => (
                        <div 
                          key={index} 
                          className="text-sm p-2 rounded bg-secondary dark:bg-primary-800"
                          dangerouslySetInnerHTML={{ 
                            __html: match.replace(
                              new RegExp(searchQuery, 'gi'), 
                              `<mark class="bg-accent/20 text-accent-foreground px-1 rounded">${searchQuery}</mark>`
                            )
                          }}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/note/${result.courseId}/${result.id}`}>
                      View Note
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No results found for "{searchQuery}"</p>
            <p className="text-primary-500 dark:text-primary-400">
              Try using different keywords or check your spelling
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Enter a search term to find notes</p>
            <p className="text-primary-500 dark:text-primary-400">
              Search across all your seminary notes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
