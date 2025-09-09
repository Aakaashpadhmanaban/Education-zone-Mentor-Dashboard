import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import type { Student } from '@/types';

interface TimelineModalProps {
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

export function TimelineModal({ student, open, onOpenChange }: TimelineModalProps) {
  const [activeTab, setActiveTab] = useState('mathematics');
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [dateValue, setDateValue] = useState('');

  // Mock data for demonstration - replace with actual data from store
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      chapters: [
        { id: 'real-numbers', name: 'Real Numbers' },
        { id: 'polynomials', name: 'Polynomials' }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      chapters: [
        { id: 'light', name: 'Light - Reflection and Refraction' },
        { id: 'acids', name: 'Acids, Bases and Salts' }
      ]
    }
  ];

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger 
                value="mathematics"
                className="text-blue-600 data-[state=active]:text-blue-600"
              >
                Mathematics
              </TabsTrigger>
              <TabsTrigger 
                value="science"
                className="text-blue-600 data-[state=active]:text-blue-600"
              >
                Science
              </TabsTrigger>
            </TabsList>

            {subjects.map((subject) => (
              <TabsContent 
                key={subject.id} 
                value={subject.name.toLowerCase()}
                className="flex-1 overflow-auto"
              >
                <div className="space-y-6">
                  {subject.chapters.map((chapter, index) => {
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
                          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <Input
                              type="text"
                              value={dateValue}
                              onChange={(e) => setDateValue(e.target.value)}
                              placeholder="09-09-2025"
                              className="w-32 text-sm"
                            />
                            <Textarea
                              placeholder="Add a note (optional)"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              className="min-h-[100px] resize-none"
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
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : progress ? (
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="text-sm font-medium text-gray-700">
                              {progress.date}
                            </div>
                            {progress.note && (
                              <div className="text-sm text-gray-600">
                                {progress.note}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500 mb-4">No progress logged yet.</p>
                            <Button 
                              className="bg-green-500 hover:bg-green-600 text-white px-6"
                              onClick={() => handleStartChapter(chapter.id)}
                            >
                              Start Chapter
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
