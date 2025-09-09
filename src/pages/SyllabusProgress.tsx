import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { StudentCard } from '@/components/students/StudentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function SyllabusProgress() {
  const { students, subjects } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const filteredStudents = students.filter((student) => {
    if (!showArchived && student.archived) return false;
    if (showArchived && !student.archived) return false;
    if (searchQuery && !student.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (boardFilter && boardFilter !== 'all' && student.board !== boardFilter) return false;
    if (gradeFilter && gradeFilter !== 'all' && student.grade !== gradeFilter) return false;
    return true;
  });

  const getStudentSubjects = (studentId: string) => {
    return subjects.filter(s => s.studentId === studentId);
  };

  const getSubjectProgress = (subject: any) => {
    if (!subject.chapters || subject.chapters.length === 0) return 0;
    const completedChapters = subject.chapters.filter((c: any) => c.completed).length;
    return Math.round((completedChapters / subject.chapters.length) * 100);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setBoardFilter('');
    setGradeFilter('');
    setSubjectFilter('');
  };

  const uniqueBoards = [...new Set(students.map(s => s.board))];
  const uniqueGrades = [...new Set(students.map(s => s.grade))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Syllabus Progress</h2>
        <p className="text-muted-foreground">
          Track academic progress for each student. Click on a student to view their detailed chapter-wise timeline.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Student Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={boardFilter} onValueChange={setBoardFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              {uniqueBoards.map((board) => (
                <SelectItem key={board} value={board}>
                  {board}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {uniqueGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => {
          const studentSubjects = getStudentSubjects(student.id);
          const totalProgress = studentSubjects.length > 0
            ? Math.round(studentSubjects.reduce((acc, subj) => acc + getSubjectProgress(subj), 0) / studentSubjects.length)
            : 0;

          return (
            <StudentCard key={student.id} student={student}>
              <div className="space-y-3">
                {studentSubjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No subjects assigned.</p>
                ) : (
                  studentSubjects.map((subject) => {
                    const progress = getSubjectProgress(subject);
                    const completedChapters = subject.chapters?.filter((c: any) => c.completed).length || 0;
                    const totalChapters = subject.chapters?.length || 0;

                    return (
                      <div key={subject.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{subject.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {completedChapters}/{totalChapters} done
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })
                )}

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-bold text-primary">{totalProgress}% Syllabus Done</span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowTimeline(true);
                    }}
                  >
                    View Timeline
                  </Button>
                </div>
              </div>
            </StudentCard>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No students found</p>
        </div>
      )}

      {/* Timeline Modal */}
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-popover">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {selectedStudent?.fullName.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedStudent?.fullName}'s Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Grade {selectedStudent?.grade} • {selectedStudent?.board} • Batch {selectedStudent?.batch}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            {/* Subject Tabs */}
            <div className="flex gap-2 mb-6">
              {getStudentSubjects(selectedStudent?.id || '').map((subject) => (
                <Button
                  key={subject.id}
                  variant="outline"
                  size="sm"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {subject.name}
                </Button>
              ))}
            </div>

            {/* Chapters List */}
            <div className="space-y-4">
              {getStudentSubjects(selectedStudent?.id || '').map((subject) => (
                <div key={subject.id}>
                  <h4 className="font-semibold mb-3">{subject.name} Chapters</h4>
                  {(!subject.chapters || subject.chapters.length === 0) ? (
                    <div className="bg-muted/50 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground mb-3">No progress logged yet.</p>
                      <Button variant="default" size="sm">
                        Start Chapter
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {subject.chapters.map((chapter: any, index: number) => (
                        <div
                          key={chapter.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{index + 1}. {chapter.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {chapter.completed ? (
                              <Badge variant="secondary" className="text-xs">Completed</Badge>
                            ) : (
                              <Button size="sm" variant="outline">
                                Start Chapter
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}