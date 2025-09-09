export interface Student {
  id: string;
  fullName: string;
  grade: string;
  board: string;
  school: string;
  batch: string;
  timeSlot: string;
  contact: string;
  personalPhone?: string;
  fatherPhone?: string;
  motherPhone?: string;
  address?: string;
  profileImage?: string;
  archived: boolean;
  createdAt: string;
  borderColor: 'orange' | 'green' | 'blue' | 'purple';
}

export interface Subject {
  id: string;
  studentId: string;
  name: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface Doubt {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: 'open' | 'resolved';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  subject?: string;
  chapter?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface WorkItem {
  id: string;
  studentId: string;
  title: string;
  description: string;
  subject: string;
  chapter?: string;
  topic?: string;
  dueDate: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'pending' | 'done';
  priority: 'low' | 'medium' | 'high';
  links?: string[];
  mentorNote?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface SyllabusProgress {
  studentId: string;
  subjectId: string;
  completedChapters: number;
  totalChapters: number;
  percentage: number;
}