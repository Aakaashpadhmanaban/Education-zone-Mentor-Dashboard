import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  editingStudent?: any;
}

const boards = ['CBSE', 'ICSE', 'GSEB', 'Cambridge', 'IB', 'State Board'];
const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const timeSlots = [
  '3:00-4:30', '4:30-6:00', '6:00-8:00', '8:00-9:30',
  '10:00-11:30', '11:30-1:00', '1:00-2:30', '2:30-4:00'
];
const borderColors = ['orange', 'green', 'blue', 'purple'] as const;

export function AddStudentModal({ open, onClose, editingStudent }: AddStudentModalProps) {
  const { addStudent, updateStudent } = useStore();
  
  // Map time slots to batch names
  const getBatchFromTimeSlot = (timeSlot: string) => {
    const batchMap: { [key: string]: string } = {
      '3:00-4:30': 'A',
      '4:30-6:00': 'B',
      '6:00-8:00': 'C',
      '8:00-9:30': 'D',
      '10:00-11:30': 'E',
      '11:30-1:00': 'F',
      '1:00-2:30': 'G',
      '2:30-4:00': 'H',
    };
    return batchMap[timeSlot] || '';
  };
  
  const [formData, setFormData] = useState({
    fullName: editingStudent?.fullName || '',
    school: editingStudent?.school || '',
    board: editingStudent?.board || '',
    grade: editingStudent?.grade || '',
    batch: editingStudent?.batch || '',
    timeSlot: editingStudent?.timeSlot || '',
    contact: editingStudent?.contact || '',
    personalPhone: editingStudent?.personalPhone || '',
    fatherPhone: editingStudent?.fatherPhone || '',
    motherPhone: editingStudent?.motherPhone || '',
    address: editingStudent?.address || '',
    borderColor: editingStudent?.borderColor || borderColors[Math.floor(Math.random() * borderColors.length)],
  });
  
  // Auto-update batch when time slot changes
  const handleTimeSlotChange = (value: string) => {
    setFormData({ 
      ...formData, 
      timeSlot: value,
      batch: getBatchFromTimeSlot(value)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.school || !formData.board || !formData.grade || !formData.timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      toast.success('Student updated successfully');
    } else {
      addStudent(formData);
      toast.success('Student added successfully');
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-popover">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <Button type="button" variant="outline" size="sm">
              Choose File
            </Button>
            <span className="text-sm text-muted-foreground">No file chosen</span>
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter student's full name"
              className="mt-1"
              required
            />
          </div>

          {/* School */}
          <div>
            <Label htmlFor="school">School *</Label>
            <Input
              id="school"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="Enter school name"
              className="mt-1"
              required
            />
          </div>

          {/* Board and Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="board">Board *</Label>
              <Select value={formData.board} onValueChange={(value) => setFormData({ ...formData, board: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board} value={board}>
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grade">Grade *</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Slot and Batch */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeSlot">Time Slot *</Label>
              <Select value={formData.timeSlot} onValueChange={handleTimeSlotChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Time Slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value.toUpperCase() })}
                placeholder="Auto-filled"
                className="mt-1"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-filled based on time slot</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Contact Details (Optional)</h3>
            
            <div>
              <Label htmlFor="contact">Primary Contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Primary contact number"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="personalPhone">Personal Phone</Label>
                <Input
                  id="personalPhone"
                  value={formData.personalPhone}
                  onChange={(e) => setFormData({ ...formData, personalPhone: e.target.value })}
                  placeholder="Student's phone"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fatherPhone">Father's Phone</Label>
                <Input
                  id="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                  placeholder="Father's phone"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="motherPhone">Mother's Phone</Label>
                <Input
                  id="motherPhone"
                  value={formData.motherPhone}
                  onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                  placeholder="Mother's phone"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingStudent ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}