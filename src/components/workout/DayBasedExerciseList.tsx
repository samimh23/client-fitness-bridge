import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Calendar, BarChart3 } from 'lucide-react';
import { Exercise } from '@/lib/types';
import DayExerciseSection from './DayExerciseSection';

interface DayBasedExerciseListProps {
  exercises: Partial<Exercise>[];
  onAddExercise: (day?: number) => void;
  onRemoveExercise: (index: number) => void;
  onExerciseChange: (index: number, field: keyof Exercise, value: any) => void;
  onOpenLibrary: (index: number) => void;
  onAddFromLibrary: (day?: number) => void;
}

const DayBasedExerciseList = ({ 
  exercises, 
  onAddExercise, 
  onRemoveExercise, 
  onExerciseChange, 
  onOpenLibrary,
  onAddFromLibrary
}: DayBasedExerciseListProps) => {
  const [activeDay, setActiveDay] = useState<string>("1");

  // Group exercises by day
  const exercisesByDay = useMemo(() => {
    const grouped: { [key: number]: Partial<Exercise>[] } = {};
    exercises.forEach(exercise => {
      const day = exercise.day || 1;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(exercise);
    });
    return grouped;
  }, [exercises]);

  // Get all unique days that have exercises
  const activeDays = useMemo(() => {
    const days = Object.keys(exercisesByDay).map(Number).sort((a, b) => a - b);
    return days.length > 0 ? days : [1]; // At least show day 1
  }, [exercisesByDay]);

  // Add a new day if needed
  const addNewDay = () => {
    const maxDay = Math.max(...activeDays, 0);
    const newDay = maxDay + 1;
    onAddExercise(newDay);
    setActiveDay(newDay.toString());
  };

  // Copy exercises from one day to another
  const handleCopyDay = (sourceDay: number) => {
    const sourceDayExercises = exercisesByDay[sourceDay] || [];
    if (sourceDayExercises.length === 0) return;

    const newDay = Math.max(...activeDays, 0) + 1;
    
    // Copy all exercises from source day to new day
    sourceDayExercises.forEach(exercise => {
      const newExercise = {
        ...exercise,
        day: newDay
      };
      // Add the new exercise to the exercises array
      onAddExercise(newDay);
      // The exercise will be added with default values, so we need to update it
      setTimeout(() => {
        const newIndex = exercises.length; // The new exercise will be at the end
        Object.keys(newExercise).forEach(key => {
          if (key !== 'day') {
            onExerciseChange(newIndex, key as keyof Exercise, newExercise[key as keyof Exercise]);
          }
        });
      }, 0);
    });
    
    setActiveDay(newDay.toString());
  };

  const getTotalExercises = () => exercises.filter(ex => ex.name).length;

  return (
    <Card className="card-enhanced">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl gradient-text">
                Workout Schedule
              </CardTitle>
              <p className="text-muted-foreground">
                Organize your exercises by training days
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>{getTotalExercises()} total exercises</span>
            </div>
            <Button
              type="button"
              onClick={addNewDay}
              variant="secondary"
              size="sm"
              className="bg-primary/10 hover:bg-primary/20 text-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Day
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <div className="border-b bg-muted/30">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex h-16 items-center justify-start rounded-none bg-transparent p-0 px-6 gap-2">
                 {activeDays.map(day => {
                   const dayExercises = exercisesByDay[day] || [];
                   
                   return (
                     <TabsTrigger
                       key={day}
                       value={day.toString()}
                       className="relative h-12 rounded-xl px-6 py-3 text-sm font-medium transition-all hover:bg-primary/5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-white data-[state=active]:shadow-lg hover-scale"
                     >
                       <div className="flex items-center gap-3">
                         <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 data-[state=active]:bg-white/20">
                           <span className="text-xs font-semibold">{day}</span>
                         </div>
                         <div className="text-left">
                           <div className="font-semibold">Day {day}</div>
                           {dayExercises.length > 0 && (
                             <div className="text-xs opacity-75">
                               {dayExercises.length} exercise{dayExercises.length !== 1 ? 's' : ''}
                             </div>
                           )}
                         </div>
                       </div>
                     </TabsTrigger>
                   );
                 })}
              </TabsList>
            </ScrollArea>
          </div>

          <div className="p-6">
            {activeDays.map(day => (
              <TabsContent key={day} value={day.toString()} className="mt-0">
                <DayExerciseSection
                  day={day}
                  exercises={exercisesByDay[day] || []}
                  onAddExercise={(dayNum) => onAddExercise(dayNum)}
                  onRemoveExercise={onRemoveExercise}
                  onExerciseChange={onExerciseChange}
                  onOpenLibrary={onOpenLibrary}
                  onAddFromLibrary={(dayNum) => onAddFromLibrary(dayNum)}
                  onCopyDay={handleCopyDay}
                  allExercises={exercises}
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DayBasedExerciseList;