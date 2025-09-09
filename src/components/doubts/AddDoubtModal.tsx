import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import type { Student, Doubt } from '@/types';

interface AddDoubtModalProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDoubtModal({ student, open, onOpenChange }: AddDoubtModalProps) {
  const { addDoubt, subjects } = useStore();
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    doubt: '',
    priority: 'medium' as Doubt['priority'],
    whenAsked: 'today',
    attachment: null as File | null,
    voiceNote: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.doubt) {
      toast.error('Please fill in required fields');
      return;
    }

    const newDoubt: Doubt = {
      id: crypto.randomUUID(),
      studentId: student.id,
      title: formData.doubt.substring(0, 50),
      description: formData.doubt,
      subject: formData.subject,
      chapter: formData.chapter,
      priority: formData.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDoubt(newDoubt);
    toast.success('Doubt added successfully');
    setFormData({
      subject: '',
      chapter: '',
      doubt: '',
      priority: 'medium',
      whenAsked: 'today',
      attachment: null,
      voiceNote: null,
    });
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'attachment' | 'voiceNote') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Doubt for <span className="text-primary">{student.fullName}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Log a new query or update an existing one.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              >
                <SelectTrigger id="subject" className="bg-gray-50">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="chapter">Chapter (Optional)</Label>
              <Select
                value={formData.chapter}
                onValueChange={(value) => setFormData(prev => ({ ...prev, chapter: value }))}
              >
                <SelectTrigger id="chapter" className="bg-gray-50">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chapter1">Chapter 1</SelectItem>
                  <SelectItem value="chapter2">Chapter 2</SelectItem>
                  <SelectItem value="chapter3">Chapter 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="doubt">Doubt *</Label>
            <Textarea
              id="doubt"
              value={formData.doubt}
              onChange={(e) => setFormData(prev => ({ ...prev, doubt: e.target.value }))}
              placeholder="Describe the doubt in detail..."
              className="min-h-[100px] bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Doubt['priority'] }))}
              >
                <SelectTrigger id="priority" className="bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="whenAsked">When did this doubt arise? *</Label>
              <Select
                value={formData.whenAsked}
                onValueChange={(value) => setFormData(prev => ({ ...prev, whenAsked: value }))}
              >
                <SelectTrigger id="whenAsked" className="bg-gray-50">
                  <SelectValue placeholder="Select When did this doubt arise?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="lastWeek">Last Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="attachment">Attachment</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('attachment')?.click()}
                  className="bg-primary text-white hover:bg-primary-hover"
                >
                  Choose File
                </Button>
                <span className="text-sm text-muted-foreground">
                  {formData.attachment ? formData.attachment.name : 'No file chosen'}
                </span>
                <input
                  id="attachment"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'attachment')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="voiceNote">Voice Note</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('voiceNote')?.click()}
                  className="bg-primary text-white hover:bg-primary-hover"
                >
                  Choose File
                </Button>
                <span className="text-sm text-muted-foreground">
                  {formData.voiceNote ? formData.voiceNote.name : 'No file chosen'}
                </span>
                <input
                  id="voiceNote"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'voiceNote')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white hover:bg-primary-hover">
              Save Doubt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}