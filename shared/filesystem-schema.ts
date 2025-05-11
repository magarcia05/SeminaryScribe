import { z } from "zod";

// File system schema types
export interface Course {
  id: string;
  name: string;
  description: string;
  icon: string;
  noteCount?: number;
  language?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  excerpt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface NoteTag {
  id: string;
  noteId: string;
  tagId: string;
}

// Validation schemas
export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  noteCount: z.number().optional(),
  language: z.string().optional()
});

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  courseId: z.string(),
  excerpt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const tagSchema = z.object({
  id: z.string(),
  name: z.string()
});

export const noteTagSchema = z.object({
  id: z.string(),
  noteId: z.string(),
  tagId: z.string()
});

// For creating new items
export type InsertCourse = Omit<Course, 'id' | 'noteCount'>;
export type InsertNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'excerpt'>;
export type InsertTag = Omit<Tag, 'id'>;
export type InsertNoteTag = Omit<NoteTag, 'id'>;