
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Trash2 } from 'lucide-react';
import { Exercise } from '@/lib/types';

interface ExerciseFormProps {
  exercise: Partial<Exercise>;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Exercise, value: any) => void;
  onOpenLibrary: (index: number) => void;
}

const ExerciseForm = ({ exercise, index, onRemove, onChange, onOpenLibrary }: ExerciseFormProps) => {
  return (
    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Exercise {index + 1}</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenLibrary(index)}
          >
            <Dumbbell className="h-4 w-4 mr-1" /> 
            Select From Library
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor={`exercise-${index}-name`}>
            Exercise Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`exercise-${index}-name`}
            placeholder="e.g., Squat, Bench Press, Deadlift"
            value={exercise.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`exercise-${index}-day`}>
            Day <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`exercise-${index}-day`}
            type="number"
            min={1}
            max={7}
            value={exercise.day}
            onChange={(e) => onChange(index, 'day', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`exercise-${index}-sets`}>
            Sets <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`exercise-${index}-sets`}
            type="number"
            min={1}
            value={exercise.sets}
            onChange={(e) => onChange(index, 'sets', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`exercise-${index}-reps`}>
            Reps <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`exercise-${index}-reps`}
            type="number"
            min={1}
            value={exercise.reps}
            onChange={(e) => onChange(index, 'reps', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`exercise-${index}-weight`}>
            Weight (optional)
          </Label>
          <Input
            id={`exercise-${index}-weight`}
            placeholder="e.g., 50kg, bodyweight"
            value={exercise.weight || ''}
            onChange={(e) => onChange(index, 'weight', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`exercise-${index}-instructions`}>
            Instructions (optional)
          </Label>
          <Input
            id={`exercise-${index}-instructions`}
            placeholder="Brief instructions"
            value={exercise.instructions || ''}
            onChange={(e) => onChange(index, 'instructions', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseForm;
