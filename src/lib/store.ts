import { create } from 'zustand';
import type { Student, Subject, Doubt, WorkItem } from '@/types';
import { db, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, where, getDocs, serverTimestamp } from '@/lib/firebase';

interface AppState {
  students: Student[];
  subjects: Subject[];
  doubts: Doubt[];
  workItems: WorkItem[];

  // Student actions
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'archived'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  archiveStudent: (id: string) => Promise<void>;

  // Subject actions
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Doubt actions
  addDoubt: (doubt: Omit<Doubt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDoubt: (id: string, doubt: Partial<Doubt>) => Promise<void>;
  deleteDoubt: (id: string) => Promise<void>;

  // Work item actions
  addWorkItem: (workItem: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWorkItem: (id: string, workItem: Partial<WorkItem>) => Promise<void>;
  deleteWorkItem: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  students: [],
  subjects: [],
  doubts: [],
  workItems: [],

  // Students
  addStudent: async (student) => {
    await addDoc(collection(db, 'students'), {
      ...student,
      createdAt: new Date().toISOString(),
      archived: false,
      _createdAtTs: serverTimestamp(),
    });
  },

  updateStudent: async (id, student) => {
    await updateDoc(doc(db, 'students', id), student as any);
  },

  deleteStudent: async (id) => {
    await deleteDoc(doc(db, 'students', id));
    // Optionally, cascade delete related docs client-side if desired
    // This demo leaves related docs; filtering is done by queries when reading
  },

  archiveStudent: async (id) => {
    const target = get().students.find(s => s.id === id);
    await updateDoc(doc(db, 'students', id), { archived: !target?.archived });
  },

  // Subjects
  addSubject: async (subject) => {
    // Create subject
    const created = await addDoc(collection(db, 'subjects'), subject as any);

    // Auto-create work items for each chapter added
    const chapterList = subject.chapters || [];
    for (const chapter of chapterList) {
      if (!chapter?.name) continue;
      await addDoc(collection(db, 'workItems'), {
        studentId: subject.studentId,
        title: `Study ${subject.name}: ${chapter.name}`,
        description: `Auto task for chapter ${chapter.name} in ${subject.name}`,
        subject: subject.name,
        chapter: chapter.name,
        dueDate: new Date().toISOString(),
        status: 'pending',
        priority: 'medium',
        links: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _createdAtTs: serverTimestamp(),
      } as Omit<WorkItem, 'id'> & { _createdAtTs: any });
    }

    return Promise.resolve(created);
  },

  updateSubject: async (id, subject) => {
    await updateDoc(doc(db, 'subjects', id), subject as any);
  },

  deleteSubject: async (id) => {
    await deleteDoc(doc(db, 'subjects', id));
  },

  // Doubts
  addDoubt: async (doubt) => {
    await addDoc(collection(db, 'doubts'), {
      ...doubt,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _createdAtTs: serverTimestamp(),
    });
  },

  updateDoubt: async (id, doubt) => {
    await updateDoc(doc(db, 'doubts', id), {
      ...doubt,
      updatedAt: new Date().toISOString(),
    } as any);
  },

  deleteDoubt: async (id) => {
    await deleteDoc(doc(db, 'doubts', id));
  },

  // Work Items
  addWorkItem: async (workItem) => {
    await addDoc(collection(db, 'workItems'), {
      ...workItem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _createdAtTs: serverTimestamp(),
    });
  },

  updateWorkItem: async (id, workItem) => {
    // Update the work item
    await updateDoc(doc(db, 'workItems', id), {
      ...workItem,
      updatedAt: new Date().toISOString(),
    } as any);

    // If marking as completed/done, resolve related doubts
    const newStatus = workItem.status;
    if (newStatus === 'completed' || newStatus === 'done') {
      const current = get().workItems.find(w => w.id === id);
      const studentId = workItem.studentId || current?.studentId;
      const subject = workItem.subject || current?.subject;
      const chapter = workItem.chapter || current?.chapter;
      if (studentId && subject) {
        const doubtsQ = query(
          collection(db, 'doubts'),
          where('studentId', '==', studentId),
          where('subject', '==', subject),
          where('status', '==', 'open')
        );
        const snap = await getDocs(doubtsQ);
        for (const d of snap.docs) {
          const data = d.data() as Doubt;
          if (!chapter || !data.chapter || data.chapter === chapter) {
            await updateDoc(doc(db, 'doubts', d.id), {
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as any);
          }
        }
      }
    }
  },

  deleteWorkItem: async (id) => {
    await deleteDoc(doc(db, 'workItems', id));
  },
}));

// Firestore subscriptions (live sync)
(function initializeFirestoreSubscriptions() {
  // Avoid double subscription in HMR by tracking on window
  const anyWindow = window as any;
  if (anyWindow.__mentorDashboardFirestoreSubscribed) return;
  anyWindow.__mentorDashboardFirestoreSubscribed = true;

  // Students
  onSnapshot(query(collection(db, 'students'), orderBy('_createdAtTs', 'desc')), (snap) => {
    const rows: Student[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    useStore.setState({ students: rows });
  });

  // Subjects
  onSnapshot(query(collection(db, 'subjects')), (snap) => {
    const rows: Subject[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    useStore.setState({ subjects: rows });
  });

  // Doubts
  onSnapshot(query(collection(db, 'doubts'), orderBy('_createdAtTs', 'desc')), (snap) => {
    const rows: Doubt[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    useStore.setState({ doubts: rows });
  });

  // Work Items
  onSnapshot(query(collection(db, 'workItems'), orderBy('_createdAtTs', 'desc')), (snap) => {
    const rows: WorkItem[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    useStore.setState({ workItems: rows });
  });
})();