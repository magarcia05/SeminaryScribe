import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Course, Note } from '@shared/filesystem-schema';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

interface CourseMetadata {
  name: string;
  description: string;
  icon: string;
  language: string;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  courseId: string;
  courseName: string;
  matches: string[];
}

export class FileSystemStorage {
  private coursesDir: string;
  
  constructor(coursesDir = './courses') {
    this.coursesDir = coursesDir;
  }
  
  /**
   * Helper function to extract lecture number from title
   */
  private extractLectureNumber(title: string): number {
    // Extract lecture number if it exists (e.g., "Lectura 30 - ..." will return 30)
    const match = title.match(/Lectura\s+(\d+)/i);
    return match ? parseInt(match[1], 10) : 999; // Default to high number if no lecture number found
  }
  
  /**
   * Get all courses from the file system
   */
  async getCourses(): Promise<Course[]> {
    try {
      const courseFolders = await readdir(this.coursesDir);
      
      const courses = await Promise.all(
        courseFolders.map(async (folder) => {
          try {
            const folderPath = path.join(this.coursesDir, folder);
            
            // Check if it's a directory
            const stats = await stat(folderPath);
            if (!stats.isDirectory()) return null;
            
            // Check for course.json
            const courseJsonPath = path.join(folderPath, 'course.json');
            if (!fs.existsSync(courseJsonPath)) return null;
            
            // Read course metadata
            const courseJson = await readFile(courseJsonPath, 'utf-8');
            const courseData = JSON.parse(courseJson) as CourseMetadata;
            
            // Count notes
            const noteFiles = await this.getNoteFilesInCourse(folder);
            
            return {
              id: folder,
              name: courseData.name,
              description: courseData.description,
              icon: courseData.icon,
              noteCount: noteFiles.length,
              language: courseData.language
            };
          } catch (error) {
            console.error(`Error processing course folder ${folder}:`, error);
            return null;
          }
        })
      );
      
      // Filter out nulls
      return courses.filter(Boolean) as Course[];
    } catch (error) {
      console.error('Error reading courses directory:', error);
      return [];
    }
  }
  
  /**
   * Get a single course by ID
   */
  async getCourse(id: string): Promise<Course | null> {
    try {
      const coursePath = path.join(this.coursesDir, id);
      const courseJsonPath = path.join(coursePath, 'course.json');
      
      if (!fs.existsSync(courseJsonPath)) {
        return null;
      }
      
      const courseJson = await readFile(courseJsonPath, 'utf-8');
      const courseData = JSON.parse(courseJson) as CourseMetadata;
      
      // Count notes
      const noteFiles = await this.getNoteFilesInCourse(id);
      
      return {
        id,
        name: courseData.name,
        description: courseData.description,
        icon: courseData.icon,
        noteCount: noteFiles.length,
        language: courseData.language
      };
    } catch (error) {
      console.error(`Error getting course ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Get all notes for a specific course
   */
  async getNotesByCourse(courseId: string): Promise<Note[]> {
    try {
      const noteFiles = await this.getNoteFilesInCourse(courseId);
      
      const notes = await Promise.all(
        noteFiles.map(async (file) => {
          try {
            const notePath = path.join(this.coursesDir, courseId, file);
            const content = await readFile(notePath, 'utf-8');
            
            const fileStats = await stat(notePath);
            
            // Extract title from markdown - first # heading
            const titleMatch = content.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');
            
            // Create excerpt
            const plainTextContent = content
              .replace(/^#.+$/gm, '') // Remove headings
              .replace(/\*\*/g, '')   // Remove bold markers
              .replace(/\n+/g, ' ')   // Replace newlines with spaces
              .trim();
            
            const excerpt = plainTextContent.length > 150 
              ? plainTextContent.substring(0, 150) + '...'
              : plainTextContent;
            
            return {
              id: path.basename(file, '.md'),
              title,
              courseId,
              content,
              excerpt,
              updatedAt: fileStats.mtime.toISOString(),
              createdAt: fileStats.birthtime.toISOString()
            };
          } catch (error) {
            console.error(`Error processing note file ${file}:`, error);
            return null;
          }
        })
      );
      
      // Filter out nulls and sort by lecture number
      const filteredNotes = notes.filter(Boolean) as Note[];
      return filteredNotes.sort((a: Note, b: Note) => {
        const aLectureNum = this.extractLectureNumber(a.title);
        const bLectureNum = this.extractLectureNumber(b.title);
        return aLectureNum - bLectureNum; // Sort in ascending order by lecture number
      });
    } catch (error) {
      console.error(`Error getting notes for course ${courseId}:`, error);
      return [];
    }
  }
  
  /**
   * Get all notes across all courses
   */
  async getAllNotes(): Promise<Note[]> {
    try {
      const courses = await this.getCourses();
      
      const allNotes: Note[] = [];
      for (const course of courses) {
        const notes = await this.getNotesByCourse(course.id);
        allNotes.push(...notes);
      }
      
      const sortedNotes = [...allNotes].sort((a: Note, b: Note) => {
        // First sort by course ID
        if (a.courseId !== b.courseId) {
          return a.courseId.localeCompare(b.courseId);
        }
        
        // Then sort by lecture number
        const aLectureNum = this.extractLectureNumber(a.title);
        const bLectureNum = this.extractLectureNumber(b.title);
        return aLectureNum - bLectureNum;
      });
      return sortedNotes;
    } catch (error) {
      console.error('Error getting all notes:', error);
      return [];
    }
  }
  
  /**
   * Get a single note by ID and course ID
   */
  async getNote(courseId: string, noteId: string): Promise<Note | null> {
    try {
      const notePath = path.join(this.coursesDir, courseId, `${noteId}.md`);
      
      if (!fs.existsSync(notePath)) {
        return null;
      }
      
      const content = await readFile(notePath, 'utf-8');
      const fileStats = await stat(notePath);
      
      // Extract title from markdown - first # heading
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : noteId;
      
      return {
        id: noteId,
        title,
        courseId,
        content,
        updatedAt: fileStats.mtime.toISOString(),
        createdAt: fileStats.birthtime.toISOString()
      };
    } catch (error) {
      console.error(`Error getting note ${noteId} in course ${courseId}:`, error);
      return null;
    }
  }
  
  /**
   * Get recent notes across all courses
   */
  async getRecentNotes(limit = 5): Promise<Note[]> {
    try {
      // For recent notes, we want to sort by date (newest first)
      const allNotes = await this.getAllNotes();
      const notesByDate = [...allNotes].sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      
      return notesByDate.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent notes:', error);
      return [];
    }
  }
  
  /**
   * Search notes for a given query string
   */
  async searchNotes(query: string): Promise<SearchResult[]> {
    try {
      if (!query || query.length < 3) {
        return [];
      }
      
      const allNotes = await this.getAllNotes();
      const courses = await this.getCourses();
      const courseMap = new Map(courses.map(course => [course.id, course]));
      
      const searchResults: SearchResult[] = [];
      
      for (const note of allNotes) {
        const course = courseMap.get(note.courseId);
        if (!course) continue;
        
        const lowerContent = note.content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (lowerContent.includes(lowerQuery) || 
            note.title.toLowerCase().includes(lowerQuery)) {
          
          // Extract matching passages for context (up to 3)
          const matches: string[] = [];
          let lastIndex = 0;
          let count = 0;
          
          while (lastIndex !== -1 && count < 3) {
            const foundIndex = lowerContent.indexOf(lowerQuery, lastIndex);
            
            if (foundIndex !== -1) {
              // Extract a window of text around the match
              const start = Math.max(0, foundIndex - 30);
              const end = Math.min(lowerContent.length, foundIndex + query.length + 30);
              let matchText = note.content.substring(start, end);
              
              // Add ellipsis if we're not at the beginning or end
              if (start > 0) matchText = "..." + matchText;
              if (end < note.content.length) matchText += "...";
              
              matches.push(matchText);
              lastIndex = foundIndex + query.length;
              count++;
            } else {
              lastIndex = -1;
            }
          }
          
          searchResults.push({
            id: note.id,
            title: note.title,
            excerpt: note.excerpt || '',
            courseId: note.courseId,
            courseName: course.name,
            matches
          });
        }
      }
      
      return searchResults;
    } catch (error) {
      console.error(`Error searching notes for '${query}':`, error);
      return [];
    }
  }
  
  /**
   * Helper method to get all markdown files in a course directory
   */
  private async getNoteFilesInCourse(courseId: string): Promise<string[]> {
    try {
      const coursePath = path.join(this.coursesDir, courseId);
      
      if (!fs.existsSync(coursePath)) {
        return [];
      }
      
      const files = await readdir(coursePath);
      
      // Filter for .md files only, exclude course.json
      return files.filter(file => 
        file.endsWith('.md') && 
        file !== 'course.json' &&
        fs.statSync(path.join(coursePath, file)).isFile()
      );
    } catch (error) {
      console.error(`Error reading note files in course ${courseId}:`, error);
      return [];
    }
  }
}

// Export a singleton instance
export const fileSystemStorage = new FileSystemStorage();