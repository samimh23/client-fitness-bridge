import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Dumbbell, Copy, Calendar } from 'lucide-react';
import { Exercise } from '@/lib/types';
import ExerciseForm from './ExerciseForm';

interface DayExerciseSectionProps {
  day: number;
  exercises: Partial<Exercise>[];
  onAddExercise: (day: number) => void;
  onRemoveExercise: (index: number) => void;
  onExerciseChange: (index: number, field: keyof Exercise, value: any) => void;
  onOpenLibrary: (index: number) => void;
  onAddFromLibrary: (day: number) => void;
  onCopyDay?: (day: number) => void;
  allExercises: Partial<Exercise>[];
}

const DayExerciseSection = ({ 
  day,
  exercises,
  onAddExercise,
  onRemoveExercise,
  onExerciseChange,
  onOpenLibrary,
  onAddFromLibrary,
  onCopyDay,
  allExercises
}: DayExerciseSectionProps) => {
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day - 1] || `Day ${day}`;
  
  const getExerciseColor = (index: number) => {
    const colors = ['bg-blue-50 border-blue-200', 'bg-green-50 border-green-200', 'bg-purple-50 border-purple-200', 'bg-orange-50 border-orange-200'];
    return colors[index % colors.length];
  };

  return (
    <Card className="card-enhanced overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl gradient-text">
                {dayName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Day {day} of your workout plan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {exercises.length} {exercises.length === 1 ? 'Exercise' : 'Exercises'}
            </Badge>
            {onCopyDay && exercises.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onCopyDay(day)}
                className="text-muted-foreground hover:text-primary"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Day
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex gap-2 mb-6">
          <Button 
            type="button" 
            onClick={() => onAddFromLibrary(day)} 
            variant="default"
            className="btn-primary"
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Add from Library
          </Button>
          <Button 
            type="button" 
            onClick={() => onAddExercise(day)} 
            variant="outline"
            className="hover:bg-primary/5 hover:border-primary/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Manually
          </Button>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No exercises added yet</p>
            <p className="text-sm">Add your first exercise to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((exercise, exerciseIndex) => {
              // Find the global index in allExercises array
              const globalIndex = allExercises.findIndex(ex => 
                ex === exercise || (ex.name === exercise.name && ex.day === exercise.day)
              );
              
              return (
                <React.Fragment key={globalIndex}>
                  {exerciseIndex > 0 && <Separator className="my-6" />}
                  <div className={`rounded-xl p-1 ${getExerciseColor(exerciseIndex)}`}>
                    <ExerciseForm
                      exercise={exercise}
                      index={globalIndex}
                      onRemove={onRemoveExercise}
                      onChange={onExerciseChange}
                      onOpenLibrary={onOpenLibrary}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayExerciseSection;