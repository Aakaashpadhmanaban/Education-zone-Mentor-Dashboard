import { useState } from 'react';
import { Plus, Search, Calendar, Download } from 'lucide-react';
import { useStore } from '@/lib/store';
import { StudentCard } from '@/components/students/StudentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AddWorkModal } from '@/components/work/AddWorkModal';
import type { Student } from '@/types';

export default function WorkPool() {
  const { students, workItems } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = students.filter((student) => {
    if (!showArchived && student.archived) return false;
    if (showArchived && !student.archived) return false;
    if (searchQuery && !student.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStudentWork = (studentId: string) => {
    return workItems.filter(w => w.studentId === studentId);
  };

  const handleAddWork = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setBatchFilter('');
    setSubjectFilter('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Work Pool</h2>
        <p className="text-muted-foreground">
          Assign and manage student tasks like tuition work, homework, and other assignments. 
          Click "+ Add Work" on a student to get started.
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

          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              <SelectItem value="A">Batch A</SelectItem>
              <SelectItem value="B">Batch B</SelectItem>
              <SelectItem value="C">Batch C</SelectItem>
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        <div className="flex items-center justify-between">
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

          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((student) => {
            const studentWork = getStudentWork(student.id);
            const pendingWork = studentWork.filter(w => w.status === 'pending').length;
            const doneWork = studentWork.filter(w => w.status === 'done').length;

            return (
              <StudentCard key={student.id} student={student}>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="text-sm text-muted-foreground">Pending: {pendingWork}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm text-muted-foreground">Done: {doneWork}</span>
                    </div>
                  </div>

                  {studentWork.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No work assigned yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {studentWork.slice(0, 2).map((work) => (
                        <div key={work.id} className="text-xs">
                          <Badge 
                            variant={work.status === 'pending' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {work.title}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className="w-full bg-primary text-white hover:bg-primary-hover" 
                    size="sm"
                    onClick={() => handleAddWork(student)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Work
                  </Button>
                </div>
              </StudentCard>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold">All Work Items</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
          
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">STUDENT</th>
                <th className="text-left p-4 font-medium">TITLE</th>
                <th className="text-left p-4 font-medium">DUE DATE</th>
                <th className="text-left p-4 font-medium">STATUS</th>
                <th className="text-left p-4 font-medium">PRIORITY</th>
                <th className="text-left p-4 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {workItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    No work items found.
                  </td>
                </tr>
              ) : (
                workItems.map((work) => {
                  const student = students.find(s => s.id === work.studentId);
                  if (!student) return null;
                  
                  return (
                    <tr key={work.id} className="border-t border-border">
                      <td className="p-4">
                        <p className="font-medium">{student.fullName}</p>
                      </td>
                      <td className="p-4">{work.title}</td>
                      <td className="p-4">{new Date(work.dueDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Badge variant={work.status === 'pending' ? 'default' : 'secondary'}>
                          {work.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={
                          work.priority === 'high' ? 'destructive' : 
                          work.priority === 'medium' ? 'default' : 
                          'secondary'
                        }>
                          {work.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="outline">Edit</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredStudents.length === 0 && viewMode === 'cards' && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No students found</p>
        </div>
      )}

      {/* Add Work Modal */}
      {selectedStudent && (
        <AddWorkModal
          student={selectedStudent}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
}