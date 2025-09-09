import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import type { Student, WorkItem } from '@/types';

interface AddWorkModalProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddWorkModal({ student, open, onOpenChange }: AddWorkModalProps) {
  const { addWorkItem, subjects } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    chapter: '',
    topic: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'assigned' as WorkItem['status'],
    priority: 'medium' as WorkItem['priority'],
    links: '',
    mentorNote: '',
    files: null as FileList | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.subject || !formData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const newWorkItem: WorkItem = {
      id: crypto.randomUUID(),
      studentId: student.id,
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      chapter: formData.chapter,
      topic: formData.topic,
      status:
        formData.status === 'assigned'
          ? 'pending'
          : formData.status === 'completed'
          ? 'done'
          : formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
      links: formData.links ? formData.links.split(',').map(link => link.trim()) : [],
      mentorNote: formData.mentorNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addWorkItem(newWorkItem);
    toast.success('Work item added successfully');
    setFormData({
      title: '',
      subject: '',
      chapter: '',
      topic: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'assigned',
      priority: 'medium',
      links: '',
      mentorNote: '',
      files: null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full bg-white rounded-lg shadow-2xl p-0 border-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-8 py-6 bg-white border-b border-gray-100">
          <DialogTitle className="text-xl font-medium text-gray-900">
            Add New Work for <span className="text-blue-600">{student.fullName}</span>
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Assign a new task or update an existing one.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 bg-white max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              className="w-full bg-gray-800 border-0 rounded-md text-white placeholder-gray-400 h-12 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject and Chapter Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger className="w-full bg-gray-800 border-0 rounded-md text-white h-12 text-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select Subject" className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name} className="text-white hover:bg-gray-700">
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="chapter" className="text-sm font-medium text-gray-700 mb-2 block">
                Chapter <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.chapter}
                onValueChange={(value) => setFormData(prev => ({ ...prev, chapter: value }))}
              >
                <SelectTrigger className="w-full bg-gray-800 border-0 rounded-md text-white h-12 text-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select Chapter" className="text-gray-400" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="chapter1" className="text-white hover:bg-gray-700">Chapter 1</SelectItem>
                  <SelectItem value="chapter2" className="text-white hover:bg-gray-700">Chapter 2</SelectItem>
                  <SelectItem value="chapter3" className="text-white hover:bg-gray-700">Chapter 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <Label htmlFor="topic" className="text-sm font-medium text-gray-700 mb-2 block">
              Topic (Optional)
            </Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="Enter topic"
              className="w-full bg-gray-800 border-0 rounded-md text-white placeholder-gray-400 h-12 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task in detail..."
              className="w-full bg-gray-800 border-0 rounded-md text-white placeholder-gray-400 min-h-[100px] text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700 mb-2 block">
              Due Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full bg-gray-800 border-0 rounded-md text-white h-12 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, status: value as WorkItem['status'] }))
                }
              >
                <SelectTrigger className="w-full bg-gray-800 border-0 rounded-md text-white h-12 text-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="assigned" className="text-white hover:bg-gray-700">Assign</SelectItem>
                  <SelectItem value="in-progress" className="text-white hover:bg-gray-700">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-gray-700">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700 mb-2 block">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, priority: value as WorkItem['priority'] }))
                }
              >
                <SelectTrigger className="w-full bg-gray-800 border-0 rounded-md text-white h-12 text-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Links */}
          <div>
            <Label htmlFor="links" className="text-sm font-medium text-gray-700 mb-2 block">
              Links (comma-separated)
            </Label>
            <Textarea
              id="links"
              value={formData.links}
              onChange={(e) => setFormData(prev => ({ ...prev, links: e.target.value }))}
              placeholder="Enter links separated by commas"
              className="w-full bg-gray-800 border-0 rounded-md text-white placeholder-gray-400 min-h-[80px] text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Files */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Files
            </Label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
              <Button
                type="button"
                onClick={() => document.getElementById('files')?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium h-9"
              >
                Choose Files
              </Button>
              <span className="text-sm text-gray-500">
                {formData.files ? `${formData.files.length} file(s) selected` : 'No file chosen'}
              </span>
              <input
                id="files"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFormData(prev => ({ ...prev, files: e.target.files }))}
              />
            </div>
          </div>

          {/* Mentor Note */}
          <div>
            <Label htmlFor="mentorNote" className="text-sm font-medium text-gray-700 mb-2 block">
              Mentor Note (Optional)
            </Label>
            <Textarea
              id="mentorNote"
              value={formData.mentorNote}
              onChange={(e) => setFormData(prev => ({ ...prev, mentorNote: e.target.value }))}
              placeholder="Add any notes for the student..."
              className="w-full bg-gray-800 border-0 rounded-md text-white placeholder-gray-400 min-h-[80px] text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
            >
              Save Work
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}