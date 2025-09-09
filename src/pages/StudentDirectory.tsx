import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useStore } from '@/lib/store';
import { StudentCard } from '@/components/students/StudentCard';
import { AddStudentModal } from '@/components/students/AddStudentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function StudentDirectory() {
  const { students } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredStudents = students.filter((student) => {
    if (!showArchived && student.archived) return false;
    if (showArchived && !student.archived) return false;
    if (searchQuery && !student.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (boardFilter && boardFilter !== 'all' && student.board !== boardFilter) return false;
    if (gradeFilter && gradeFilter !== 'all' && student.grade !== gradeFilter) return false;
    if (batchFilter && batchFilter !== 'all' && student.batch !== batchFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setBoardFilter('');
    setGradeFilter('');
    setBatchFilter('');
  };

  const uniqueBoards = [...new Set(students.map(s => s.board))];
  const uniqueGrades = [...new Set(students.map(s => s.grade))];
  const uniqueBatches = [...new Set(students.map(s => s.batch))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Student Directory</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Name"
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

          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {uniqueBatches.map((batch) => (
                <SelectItem key={batch} value={batch}>
                  {batch}
                </SelectItem>
              ))}
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
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No students found</p>
          {!showArchived && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Student
            </Button>
          )}
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}