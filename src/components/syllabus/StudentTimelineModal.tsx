import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import type { Student, Subject, Chapter } from '@/types';

interface StudentTimelineModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChapterProgress {
  id: string;
  chapterId: string;
  date: string;
  note: string;
  started: boolean;
}

export function StudentTimelineModal({ student, open, onOpenChange }: StudentTimelineModalProps) {
  const { subjects, updateSubject } = useStore();
  const [activeTab, setActiveTab] = useState('');
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [dateValue, setDateValue] = useState('');

  const studentSubjects = student ? subjects.filter(s => s.studentId === student.id) : [];

  // Set first subject as active tab when modal opens
  if (activeTab === '' && studentSubjects.length > 0) {
    setActiveTab(studentSubjects[0].name.toLowerCase());
  }

  const handleStartChapter = (chapterId: string) => {
    setEditingChapter(chapterId);
    setDateValue(format(new Date(), 'dd-MM-yyyy'));
    setNoteText('');
  };

  const handleSaveProgress = (chapterId: string) => {
    if (!dateValue) return;

    const newProgress: ChapterProgress = {
      id: crypto.randomUUID(),
      chapterId,
      date: dateValue,
      note: noteText,
      started: true
    };

    setChapterProgress(prev => [...prev.filter(p => p.chapterId !== chapterId), newProgress]);
    setEditingChapter(null);
    setNoteText('');
    setDateValue('');
  };

  const handleCancel = () => {
    setEditingChapter(null);
    setNoteText('');
    setDateValue('');
  };

  const getChapterProgress = (chapterId: string) => {
    return chapterProgress.find(p => p.chapterId === chapterId);
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">
                  {student.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {student.fullName}'s Timeline
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Grade {student.grade} • {student.board} • Batch {student.batch}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {studentSubjects.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No subjects assigned to this student.</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid grid-cols-2 mb-4">
                {studentSubjects.slice(0, 2).map((subject) => (
                  <TabsTrigger 
                    key={subject.id} 
                    value={subject.name.toLowerCase()}
                    className="text-blue-600"
                  >
                    {subject.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {studentSubjects.map((subject) => (
                <TabsContent 
                  key={subject.id} 
                  value={subject.name.toLowerCase()}
                  className="flex-1 overflow-auto"
                >
                  <div className="space-y-4">
                    {(!subject.chapters || subject.chapters.length === 0) ? (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500 mb-4">No progress logged yet.</p>
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                          Start Chapter
                        </Button>
                      </div>
                    ) : (
                      subject.chapters.map((chapter, index) => {
                        const progress = getChapterProgress(chapter.id);
                        const isEditing = editingChapter === chapter.id;
                        
                        return (
                          <div key={chapter.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-900">
                                  {index + 1}. {chapter.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {progress ? 'Started' : 'Not Started'}
                                </span>
                              </div>
                            </div>

                            {isEditing ? (
                              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <Input
                                  type="text"
                                  value={dateValue}
                                  onChange={(e) => setDateValue(e.target.value)}
                                  placeholder="09-09-2025"
                                  className="w-32"
                                />
                                <Textarea
                                  placeholder="Add a note (optional)"
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  className="min-h-[80px] resize-none"
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleSaveProgress(chapter.id)}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : progress ? (
                              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="text-sm text-gray-600">
                                  {progress.date}
                                </div>
                                {progress.note && (
                                  <div className="text-sm text-gray-700">
                                    {progress.note}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-gray-500 mb-3">No progress logged yet.</p>
                                <Button 
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => handleStartChapter(chapter.id)}
                                >
                                  Start Chapter
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
