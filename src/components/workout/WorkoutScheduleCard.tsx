
import React from 'react';
import { ClipboardList, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Exercise } from '@/lib/types';

interface WorkoutScheduleCardProps {
  exercisesByDay: Record<number, Exercise[]>;
}

const WorkoutScheduleCard = ({ exercisesByDay }: WorkoutScheduleCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ClipboardList className="mr-2 h-5 w-5 text-primary" />
          Workout Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.keys(exercisesByDay).length > 0 ? (
            Object.keys(exercisesByDay).map(day => (
              <div key={day}>
                <h3 className="text-lg font-medium mb-3">Day {day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exercisesByDay[Number(day)].map(exercise => (
                    <div 
                      key={exercise.id} 
                      className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <h4 className="font-medium mb-2">{exercise.name}</h4>
                      <div className="text-sm text-gray-600">
                        <p>{exercise.sets} sets × {exercise.reps} reps</p>
                        {exercise.weight && <p>Weight: {exercise.weight}</p>}
                        {exercise.restTime && <p>Rest: {exercise.restTime} seconds</p>}
                      </div>
                      {exercise.instructions && (
                        <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                          {exercise.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {Number(day) < Object.keys(exercisesByDay).length && <Separator className="mt-6" />}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Dumbbell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p>No exercises found for this workout plan.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutScheduleCard;
