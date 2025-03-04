
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Dumbbell } from 'lucide-react';
import { Exercise } from '@/lib/types';
import ExerciseForm from './ExerciseForm';

interface ExerciseListProps {
  exercises: Partial<Exercise>[];
  onAddExercise: () => void;
  onRemoveExercise: (index: number) => void;
  onExerciseChange: (index: number, field: keyof Exercise, value: any) => void;
  onOpenLibrary: (index: number) => void;
  onAddFromLibrary: () => void;
}

const ExerciseList = ({ 
  exercises, 
  onAddExercise, 
  onRemoveExercise, 
  onExerciseChange, 
  onOpenLibrary,
  onAddFromLibrary
}: ExerciseListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Exercises</CardTitle>
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={onAddFromLibrary} 
            variant="secondary"
            size="sm"
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Browse Exercise Library
          </Button>
          <Button type="button" onClick={onAddExercise} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Exercise Manually
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {exercises.map((exercise, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Separator className="my-6" />}
            <ExerciseForm
              exercise={exercise}
              index={index}
              onRemove={onRemoveExercise}
              onChange={onExerciseChange}
              onOpenLibrary={onOpenLibrary}
            />
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExerciseList;
