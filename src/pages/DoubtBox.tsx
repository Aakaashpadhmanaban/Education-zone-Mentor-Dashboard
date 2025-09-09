import { useState } from 'react';
import { Plus, Search, Grid3x3, List } from 'lucide-react';
import { useStore } from '@/lib/store';
import { StudentCard } from '@/components/students/StudentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { AddDoubtModal } from '@/components/doubts/AddDoubtModal';
import { StudentDoubtModal } from '@/components/doubts/StudentDoubtModal';
import type { Student } from '@/types';

export default function DoubtBox() {
  const { students, doubts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredStudents = students.filter((student) => {
    if (!showArchived && student.archived) return false;
    if (showArchived && !student.archived) return false;
    if (searchQuery && !student.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Generate chart data for last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayDoubts = doubts.filter(d => 
      format(new Date(d.createdAt), 'yyyy-MM-dd') === dateStr
    ).length;
    
    return {
      date: format(date, 'd MMM'),
      doubts: dayDoubts,
    };
  });

  const getStudentDoubts = (studentId: string) => {
    return doubts.filter(d => d.studentId === studentId);
  };

  const handleAddDoubt = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleViewStudentDoubts = (student: Student) => {
    setSelectedStudentForView(student);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Doubt Box</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('cards')}
            className={viewMode === 'cards' ? 'bg-muted' : ''}
          >
            <Grid3x3 className="h-4 w-4" />
            Cards View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
            Table View
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Doubt Activity - Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="doubts" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((student) => {
            const studentDoubts = getStudentDoubts(student.id);
            const openDoubts = studentDoubts.filter(d => d.status === 'open').length;
            const resolvedDoubts = studentDoubts.filter(d => d.status === 'resolved').length;

            return (
              <div 
                key={student.id} 
                className="cursor-pointer" 
                onClick={() => handleViewStudentDoubts(student)}
              >
                <StudentCard student={student}>
                  <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive"></div>
                      <span className="text-sm text-muted-foreground">Open: {openDoubts}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm text-muted-foreground">Resolved: {resolvedDoubts}</span>
                    </div>
                  </div>

                  {studentDoubts.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No doubts logged yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {studentDoubts.slice(0, 2).map((doubt) => (
                        <div key={doubt.id} className="text-xs">
                          <Badge variant={doubt.status === 'open' ? 'destructive' : 'secondary'} className="text-xs">
                            {doubt.title}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                    <Button 
                      className="w-full bg-primary text-white hover:bg-primary-hover" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddDoubt(student);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Doubt
                    </Button>
                  </div>
                </StudentCard>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Student</th>
                <th className="text-left p-4 font-medium">Open Doubts</th>
                <th className="text-left p-4 font-medium">Resolved Doubts</th>
                <th className="text-left p-4 font-medium">Total</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const studentDoubts = getStudentDoubts(student.id);
                const openDoubts = studentDoubts.filter(d => d.status === 'open').length;
                const resolvedDoubts = studentDoubts.filter(d => d.status === 'resolved').length;

                return (
                  <tr key={student.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full bg-student-${student.borderColor}`}></div>
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            Grade {student.grade} • {student.board}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="destructive">{openDoubts}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{resolvedDoubts}</Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{studentDoubts.length}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewStudentDoubts(student)}
                        >
                          View Doubts
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-primary text-white hover:bg-primary-hover"
                          onClick={() => handleAddDoubt(student)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Doubt
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No students found</p>
        </div>
      )}

      {/* Add Doubt Modal */}
      {selectedStudent && (
        <AddDoubtModal
          student={selectedStudent}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      {/* Student Doubt View Modal */}
      <StudentDoubtModal
        student={selectedStudentForView}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
      />
    </div>
  );
}