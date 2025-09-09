import { Student, Subject, Doubt, WorkItem } from '@/types';

export const sampleStudents: Omit<Student, 'id' | 'createdAt' | 'archived'>[] = [
  {
    fullName: 'Rohan Sharma',
    grade: '10',
    board: 'CBSE',
    school: 'Delhi Public School',
    batch: 'A',
    timeSlot: '3:00-4:30',
    contact: '9876543210',
    borderColor: 'orange',
  },
  {
    fullName: 'Priya Patel',
    grade: '9',
    board: 'ICSE',
    school: "St. Xavier's",
    batch: 'B',
    timeSlot: '4:30-6:00',
    contact: '9876543211',
    borderColor: 'green',
  },
  {
    fullName: 'Amit Singh',
    grade: '11',
    board: 'Cambridge',
    school: 'Global International',
    batch: 'C',
    timeSlot: '6:00-8:00',
    contact: '9876543212',
    borderColor: 'blue',
  },
  {
    fullName: 'Vikram Mehta',
    grade: '8',
    board: 'GSEB',
    school: 'Gujarat Public School',
    batch: 'B',
    timeSlot: '4:30-6:00',
    contact: '9876543214',
    borderColor: 'purple',
  },
];

export const sampleSubjects: Omit<Subject, 'id'>[] = [
  {
    studentId: '', // Will be filled when creating sample data
    name: 'Mathematics',
    chapters: [
      { id: '1', name: 'Real Numbers', completed: false },
      { id: '2', name: 'Polynomials', completed: false },
    ],
  },
  {
    studentId: '',
    name: 'Science',
    chapters: [
      { id: '1', name: 'Chemical Reactions', completed: false },
      { id: '2', name: 'Life Processes', completed: false },
    ],
  },
];

export const generateSampleData = () => {
  // This function can be called to populate the store with sample data
  console.log('Sample data generator ready');
};