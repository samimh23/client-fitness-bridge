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
  
  const getExerciseColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20', 
      'bg-gradient-to-br from-secondary/50 to-secondary/70 border-secondary/30', 
      'bg-gradient-to-br from-accent/50 to-accent/70 border-accent/30',
      'bg-gradient-to-br from-muted/50 to-muted/70 border-muted/30'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
              <span className="text-xl font-bold text-white">{day}</span>
            </div>
            <div>
              <CardTitle className="text-2xl gradient-text">
                Day {day}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Training session for day {day}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-primary/10 to-primary-glow/10 text-primary border border-primary/20 shadow-sm"
            >
              {exercises.length} {exercises.length === 1 ? 'Exercise' : 'Exercises'}
            </Badge>
            {onCopyDay && exercises.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onCopyDay(day)}
                className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Day
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="flex gap-3 mb-8">
          <Button 
            type="button" 
            onClick={() => onAddFromLibrary(day)} 
            className="btn-primary flex-1 h-12 text-base font-medium"
          >
            <Dumbbell className="mr-3 h-5 w-5" />
            Add from Library
          </Button>
          <Button 
            type="button" 
            onClick={() => onAddExercise(day)} 
            variant="outline"
            className="flex-1 h-12 text-base font-medium border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
          >
            <Plus className="mr-3 h-5 w-5" />
            Add Manually
          </Button>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary-glow/10 flex items-center justify-center">
              <Dumbbell className="h-10 w-10 text-primary/50" />
            </div>
            <p className="text-xl font-semibold mb-3 text-foreground/80">No exercises added yet</p>
            <p className="text-base">Start building your workout for Day {day}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {exercises.map((exercise, exerciseIndex) => {
              // Find the global index in allExercises array
              const globalIndex = allExercises.findIndex(ex => 
                ex === exercise || (ex.name === exercise.name && ex.day === exercise.day)
              );
              
              return (
                <React.Fragment key={globalIndex}>
                  <div className={`rounded-xl p-4 border transition-all duration-200 hover:shadow-md ${getExerciseColor(exerciseIndex)}`}>
                    <div className="mb-2">
                      <span className="text-xs font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                        Exercise {exerciseIndex + 1}
                      </span>
                    </div>
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