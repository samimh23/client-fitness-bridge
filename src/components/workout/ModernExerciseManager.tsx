import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Dumbbell, 
  GripVertical, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Exercise } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuperCompactExerciseView from './SuperCompactExerciseView';

interface ModernExerciseManagerProps {
  exercises: Partial<Exercise>[];
  onAddExercise: (day: number) => void;
  onRemoveExercise: (index: number) => void;
  onExerciseChange: (index: number, field: keyof Exercise, value: string | number) => void;
  onOpenLibrary: (index: number) => void;
  onAddFromLibrary: (day: number) => void;
  initialActiveDay?: number;
  onActiveDayChange?: (day: number) => void;
}

const ModernExerciseManager = ({ 
  exercises, 
  onAddExercise, 
  onRemoveExercise, 
  onExerciseChange, 
  onOpenLibrary,
  onAddFromLibrary,
  initialActiveDay,
  onActiveDayChange
}: ModernExerciseManagerProps) => {
  const [activeDay, setActiveDay] = useState(initialActiveDay || 1);

  // Group exercises by day
  const exercisesByDay = exercises.reduce((acc, exercise) => {
    const day = (exercise as Partial<Exercise> & { day?: number }).day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(exercise);
    return acc;
  }, {} as { [key: number]: Partial<Exercise>[] });
  
  const activeDays = Object.keys(exercisesByDay).map(Number).sort((a, b) => a - b);

  // Add new day if needed
  const addNewDay = () => {
    const maxDay = Math.max(...activeDays, 0);
    const newDay = maxDay + 1;
    onAddExercise(newDay);
    setActiveDay(newDay);
    onActiveDayChange?.(newDay);
  };

  // Navigate to previous/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    const currentIndex = activeDays.indexOf(activeDay);
    if (direction === 'prev' && currentIndex > 0) {
      const newDay = activeDays[currentIndex - 1];
      setActiveDay(newDay);
      onActiveDayChange?.(newDay);
    } else if (direction === 'next' && currentIndex < activeDays.length - 1) {
      const newDay = activeDays[currentIndex + 1];
      setActiveDay(newDay);
      onActiveDayChange?.(newDay);
    }
  };

  // If no days exist, create day 1
  if (activeDays.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 sm:p-8 text-center">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Start Your Workout Plan</h3>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">Add your first training day to begin creating exercises.</p>
          <Button onClick={addNewDay} className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add First Day
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentDayIndex = activeDays.indexOf(activeDay);
  const canGoPrev = currentDayIndex > 0;
  const canGoNext = currentDayIndex < activeDays.length - 1;

  return (
    <div className="space-y-4">
      {/* Responsive Day Navigation */}
      <div className="space-y-3">
        {/* Desktop: Horizontal scrollable tabs */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap px-2 flex-shrink-0">
            Days:
          </span>
          
          <ScrollArea className="flex-1">
            <div className="flex gap-2 pb-2">
              {activeDays.map(day => {
                const dayExercises = exercisesByDay[day] || [];
                const completeCount = dayExercises.filter(ex => ex.name && ex.sets && ex.reps).length;
                const totalCount = dayExercises.filter(ex => ex.name).length;
                
                return (
                  <Button
                    key={day}
                    variant={activeDay === day ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setActiveDay(day);
                      onActiveDayChange?.(day);
                    }}
                    className="flex items-center gap-2 min-w-fit h-8 flex-shrink-0"
                  >
                    <span>Day {day}</span>
                    {totalCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {completeCount}/{totalCount}
                      </Badge>
                    )}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={addNewDay}
                className="flex items-center gap-1 h-8 min-w-fit flex-shrink-0"
              >
                <Plus className="h-3 w-3" />
                Add Day
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Mobile: Compact day selector with navigation */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('prev')}
              disabled={!canGoPrev}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Day</span>
              <select
                value={activeDay}
                onChange={(e) => {
                  const newDay = Number(e.target.value);
                  setActiveDay(newDay);
                  onActiveDayChange?.(newDay);
                }}
                className="h-8 px-3 py-1 border border-border rounded-md bg-background text-sm font-medium min-w-fit"
              >
                {activeDays.map(day => {
                  const dayExercises = exercisesByDay[day] || [];
                  const completeCount = dayExercises.filter(ex => ex.name && ex.sets && ex.reps).length;
                  const totalCount = dayExercises.filter(ex => ex.name).length;
                  
                  return (
                    <option key={day} value={day}>
                      Day {day} {totalCount > 0 ? `(${completeCount}/${totalCount})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDay('next')}
              disabled={!canGoNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Add Day Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={addNewDay}
              className="flex items-center gap-1 h-8 w-full"
            >
              <Plus className="h-3 w-3" />
              Add New Day
            </Button>
          </div>
        </div>
      </div>

      {/* Current Day Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <span className="text-white font-bold">{activeDay}</span>
              </div>
              <div>
                <CardTitle className="text-lg">Day {activeDay}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {exercisesByDay[activeDay]?.length || 0} exercises
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddFromLibrary(activeDay)}
                className="flex items-center gap-1 h-8 w-full sm:w-auto"
              >
                <Dumbbell className="h-3 w-3" />
                Library
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddExercise(activeDay)}
                className="flex items-center gap-1 h-8 w-full sm:w-auto"
              >
                <Plus className="h-3 w-3" />
                Add Exercise
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <SuperCompactExerciseView
            exercises={exercisesByDay[activeDay] || []}
            onRemove={onRemoveExercise}
            onChange={onExerciseChange}
            onOpenLibrary={onOpenLibrary}
            onEdit={(index) => console.log('Edit exercise:', index)}
            onAddExercise={() => onAddExercise(activeDay)}
            day={activeDay}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernExerciseManager;