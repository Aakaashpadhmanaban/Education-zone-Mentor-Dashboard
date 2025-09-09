import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, FileText, X, Edit, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import type { Student, Doubt } from '@/types';

interface StudentDoubtModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDoubtModal({ student, open, onOpenChange }: StudentDoubtModalProps) {
  const { doubts, subjects } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('open');

  const studentDoubts = useMemo(() => {
    if (!student) return [];
    return doubts.filter(doubt => doubt.studentId === student.id);
  }, [doubts, student]);

  const filteredDoubts = useMemo(() => {
    let filtered = studentDoubts;

    // Filter by tab
    if (activeTab === 'open') {
      filtered = filtered.filter(doubt => doubt.status === 'open');
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(doubt => doubt.status === 'resolved');
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doubt =>
        doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(doubt => doubt.subject === selectedSubject);
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(doubt => doubt.priority === selectedPriority);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(doubt => doubt.status === selectedStatus);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [studentDoubts, activeTab, searchQuery, selectedSubject, selectedPriority, selectedStatus]);

  const openDoubtsCount = studentDoubts.filter(d => d.status === 'open').length;
  const resolvedDoubtsCount = studentDoubts.filter(d => d.status === 'resolved').length;

  const handleExportCSV = () => {
    const csvData = filteredDoubts.map(doubt => ({
      Subject: doubt.subject || '',
      Title: doubt.title,
      Description: doubt.description,
      Priority: doubt.priority,
      Status: doubt.status,
      'Created At': format(new Date(doubt.createdAt), 'yyyy-MM-dd HH:mm'),
      'Updated At': format(new Date(doubt.updatedAt), 'yyyy-MM-dd HH:mm'),
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student?.fullName}_doubts.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // For now, we'll create a simple text-based PDF export
    // In a real application, you'd use a library like jsPDF
    const content = `
${student?.fullName}'s Doubts Report
Grade ${student?.grade} • ${student?.board}
Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}

Total Doubts: ${studentDoubts.length}
Open: ${openDoubtsCount}
Resolved: ${resolvedDoubtsCount}

Doubts List:
${filteredDoubts.map((doubt, index) => `
${index + 1}. ${doubt.title}
   Subject: ${doubt.subject || 'N/A'}
   Priority: ${doubt.priority}
   Status: ${doubt.status}
   Created: ${format(new Date(doubt.createdAt), 'yyyy-MM-dd HH:mm')}
   Description: ${doubt.description}
`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student?.fullName}_doubts.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedPriority('all');
    setSelectedStatus('all');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'open' 
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-green-100 text-green-800 border-green-200';
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-white overflow-hidden flex flex-col">
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
                  {student.fullName}'s Doubts
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Grade {student.grade} • {student.board}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="bg-green-500 text-white hover:bg-green-600 border-green-500"
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="bg-red-500 text-white hover:bg-red-600 border-red-500"
              >
                Export PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="open" className="text-blue-600">
                Open ({openDoubtsCount})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({resolvedDoubtsCount})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({studentDoubts.length})
              </TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex-shrink-0 space-y-4 mb-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Search Doubts</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search inside doubt text..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-40 bg-gray-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-32 bg-gray-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32 bg-gray-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>

            {/* Content */}
            <TabsContent value={activeTab} className="flex-1 overflow-auto">
              <div className="space-y-3">
                {filteredDoubts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No doubts found matching your criteria
                  </div>
                ) : (
                  filteredDoubts.map((doubt) => (
                    <div
                      key={doubt.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(doubt.status)} border`}>
                            {doubt.status}
                          </Badge>
                          <Badge className={`${getPriorityColor(doubt.priority)} border`}>
                            {doubt.priority} Priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2">
                        {doubt.subject ? `${doubt.subject} - ` : ''}{doubt.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {doubt.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          <span>Origin: During Reading | Logged: {format(new Date(doubt.createdAt), 'yyyy-MM-dd')}</span>
                        </div>
                        <div>
                          <span>Logged: 9 Sept • Open for 1 day</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
