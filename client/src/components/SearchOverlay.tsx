import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  courseId: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, navigate] = useLocation();
  
  // Reset search query when the overlay is opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);
  
  // Search results query
  const { data: results = [], isLoading } = useQuery<SearchResult[]>({
    queryKey: ['/api/search', searchQuery],
    enabled: searchQuery.length > 2,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };
  
  const handleResultClick = (courseId: string, noteId: string) => {
    navigate(`/note/${courseId}/${noteId}`);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <Button variant="ghost" onClick={onClose} type="button">
              <X className="h-4 w-4" />
            </Button>
          </form>
          
          {searchQuery.length > 2 && (
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <p className="text-sm text-primary-500 dark:text-primary-400 p-2">Searching...</p>
              ) : results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map((result) => (
                    <li key={result.id}>
                      <button
                        onClick={() => handleResultClick(result.courseId, result.id)}
                        className="w-full text-left block px-3 py-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-700"
                      >
                        <span className="text-primary-900 dark:text-primary-100 font-medium">
                          {result.title}
                        </span>
                        <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                          {result.excerpt}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-primary-500 dark:text-primary-400 p-2">
                  No results found for "{searchQuery}"
                </p>
              )}
            </div>
          )}
          
          {searchQuery.length <= 2 && (
            <div>
              <p className="text-sm text-primary-500 dark:text-primary-400 mb-2">
                Recent searches
              </p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSearchQuery("Johannine literature")}
                    className="w-full text-left block px-3 py-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-700"
                  >
                    <span className="text-primary-900 dark:text-primary-100">
                      Johannine literature
                    </span>
                    <p className="text-xs text-primary-500 dark:text-primary-400">7 results</p>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSearchQuery("Logos theology")}
                    className="w-full text-left block px-3 py-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-700"
                  >
                    <span className="text-primary-900 dark:text-primary-100">
                      Logos theology
                    </span>
                    <p className="text-xs text-primary-500 dark:text-primary-400">3 results</p>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSearchQuery("Synoptic problem")}
                    className="w-full text-left block px-3 py-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-700"
                  >
                    <span className="text-primary-900 dark:text-primary-100">
                      Synoptic problem
                    </span>
                    <p className="text-xs text-primary-500 dark:text-primary-400">12 results</p>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
