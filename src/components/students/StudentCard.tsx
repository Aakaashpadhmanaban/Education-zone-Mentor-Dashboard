import { cn } from '@/lib/utils';
import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  children?: React.ReactNode;
  onClick?: () => void;
}

const borderColorMap = {
  orange: 'border-l-student-orange',
  green: 'border-l-student-green',
  blue: 'border-l-student-blue',
  purple: 'border-l-student-purple',
};

export function StudentCard({ student, children, onClick }: StudentCardProps) {
  return (
    <div
      className={cn(
        'relative bg-card rounded-lg border border-border border-l-4 p-4 hover:bg-card-hover transition-colors cursor-pointer',
        borderColorMap[student.borderColor]
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {student.profileImage ? (
            <img
              src={student.profileImage}
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-muted-foreground">
              {student.fullName.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{student.fullName}</h3>
          <p className="text-sm text-muted-foreground">
            Grade {student.grade} • {student.board}
          </p>
          <p className="text-sm text-muted-foreground">{student.school}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Batch:</span>
          <span className="text-foreground">{student.batch} ({student.timeSlot})</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Contact:</span>
          <span className="text-foreground">{student.contact}</span>
        </div>
      </div>

      {/* Children (buttons, stats, etc.) */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}