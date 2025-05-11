import type { Express } from "express";
import { createServer, type Server } from "http";
import { fileSystemStorage } from "./filesystem-storage";
import path from "path";
import fs from "fs";
import { promisify } from "util";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await fileSystemStorage.getCourses();
      res.json(courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  
  // Get a single course
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await fileSystemStorage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (err) {
      console.error(`Error fetching course ${req.params.id}:`, err);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });
  
  // Get notes for a course
  app.get("/api/courses/:id/notes", async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await fileSystemStorage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const notes = await fileSystemStorage.getNotesByCourse(courseId);
      res.json(notes);
    } catch (err) {
      console.error(`Error fetching notes for course ${req.params.id}:`, err);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });
  
  // Get all notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await fileSystemStorage.getAllNotes();
      res.json(notes);
    } catch (err) {
      console.error("Error fetching all notes:", err);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Get recent notes
  app.get("/api/notes/recent", async (req, res) => {
    try {
      const notes = await fileSystemStorage.getRecentNotes(5);
      res.json(notes);
    } catch (err) {
      console.error("Error fetching recent notes:", err);
      res.status(500).json({ message: "Failed to fetch recent notes" });
    }
  });
  
  // Get a single note - format /api/courses/:courseId/notes/:noteId
  app.get("/api/courses/:courseId/notes/:noteId", async (req, res) => {
    try {
      const { courseId, noteId } = req.params;
      const note = await fileSystemStorage.getNote(courseId, noteId);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (err) {
      console.error(`Error fetching note ${req.params.noteId}:`, err);
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });
  
  // Legacy endpoint for backward compatibility
  app.get("/api/notes/:id", async (req, res) => {
    try {
      // This is a temporary solution - we need to find the note across all courses
      const allNotes = await fileSystemStorage.getAllNotes();
      const note = allNotes.find(n => n.id === req.params.id);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (err) {
      console.error(`Error fetching note ${req.params.id}:`, err);
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });
  
  // Search notes
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const results = await fileSystemStorage.searchNotes(query);
      res.json(results);
    } catch (err) {
      console.error(`Error searching notes for '${req.query.q}':`, err);
      res.status(500).json({ message: "Failed to search notes" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
