import { useState } from 'react';
import { useStore } from '@/lib/store';
import { StudentCard } from '@/components/students/StudentCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SubjectManager() {
  const { students, subjects, addSubject, updateSubject } = useStore();
  const [showArchived, setShowArchived] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapters, setNewChapters] = useState<string[]>(['']);

  const filteredStudents = students.filter((student) => {
    if (!showArchived && student.archived) return false;
    if (showArchived && !student.archived) return false;
    return true;
  });

  const getStudentSubjects = (studentId: string) => {
    return subjects.filter(s => s.studentId === studentId);
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    const validChapters = newChapters.filter(c => c.trim()).map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      completed: false,
    }));

    if (selectedStudent) {
      addSubject({
        studentId: selectedStudent.id,
        name: newSubjectName,
        chapters: validChapters,
      });

      toast.success(`Added ${newSubjectName} for ${selectedStudent.fullName}`);
      setNewSubjectName('');
      setNewChapters(['']);
      setShowAddSubject(false);
      setSelectedStudent(null);
    }
  };

  const addChapterField = () => {
    setNewChapters([...newChapters, '']);
  };

  const updateChapterField = (index: number, value: string) => {
    const updated = [...newChapters];
    updated[index] = value;
    setNewChapters(updated);
  };

  const removeChapterField = (index: number) => {
    setNewChapters(newChapters.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Subject Manager</h2>
        <p className="text-muted-foreground">
          A central place to define subjects and chapters for each student. Click on a student to manage their curriculum.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="showArchived"
            checked={showArchived}
            onCheckedChange={(checked) => setShowArchived(checked as boolean)}
          />
          <label
            htmlFor="showArchived"
            className="text-sm font-medium text-muted-foreground cursor-pointer"
          >
            Show Archived Students
          </label>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudents.map((student) => {
          const studentSubjects = getStudentSubjects(student.id);

          return (
            <div
              key={student.id}
              className={`bg-card rounded-lg border border-border border-l-4 p-4 border-l-student-${student.borderColor}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{student.fullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Grade {student.grade} • {student.board}
                  </p>
                  <p className="text-sm text-muted-foreground">{student.school}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowAddSubject(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Subject
                </Button>
              </div>

              {studentSubjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-3">No subjects assigned.</p>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowAddSubject(true);
                    }}
                    className="text-primary hover:underline text-sm"
                  >
                    Click to add curriculum
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {studentSubjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.chapters?.length || 0} chap
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No students found</p>
        </div>
      )}

      {/* Add Subject Modal */}
      <Dialog open={showAddSubject} onOpenChange={setShowAddSubject}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-popover">
          <DialogHeader>
            <DialogTitle>
              Add Subject for {selectedStudent?.fullName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g., Mathematics"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Chapters</Label>
              <div className="space-y-2 mt-2">
                {newChapters.map((chapter, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={chapter}
                      onChange={(e) => updateChapterField(index, e.target.value)}
                      placeholder={`Chapter ${index + 1} name`}
                    />
                    {newChapters.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeChapterField(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChapterField}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Chapter
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddSubject(false);
                  setNewSubjectName('');
                  setNewChapters(['']);
                  setSelectedStudent(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>
                Add Subject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}