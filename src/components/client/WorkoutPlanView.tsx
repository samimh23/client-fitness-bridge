
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockWorkoutPlans } from '@/lib/data';
import { Exercise } from '@/lib/types';

const WorkoutPlanView = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  // Find the plan from mock data
  const plan = mockWorkoutPlans.find(p => p.id === planId);
  
  if (!plan) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          Workout plan not found
        </div>
        <Button onClick={() => navigate('/client-app')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  // Group exercises by day
  const exercisesByDay: Record<number, Exercise[]> = {};
  plan.exercises.forEach(exercise => {
    if (!exercisesByDay[exercise.day]) {
      exercisesByDay[exercise.day] = [];
    }
    exercisesByDay[exercise.day].push(exercise);
  });
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-20">
      <Button 
        variant="outline" 
        onClick={() => navigate('/client-app')}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{plan.name}</h1>
          <p className="text-gray-500">{plan.description}</p>
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-primary/5 rounded-lg flex justify-between">
        <div>
          <span className="text-sm font-medium text-gray-500">Duration:</span>
          <span className="ml-2 font-medium">{plan.duration} weeks</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Exercises:</span>
          <span className="ml-2 font-medium">{plan.exercises.length}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.keys(exercisesByDay).map((day) => (
          <Card key={day} className="w-full">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg">Day {day}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {exercisesByDay[Number(day)].map((exercise) => (
                <div key={exercise.id} className="p-4 border-b last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && ` @ ${exercise.weight}`}
                      </div>
                      {exercise.restTime && (
                        <div className="text-sm text-gray-500">
                          Rest: {exercise.restTime} seconds
                        </div>
                      )}
                    </div>
                  </div>
                  {exercise.instructions && (
                    <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Instructions:</span> {exercise.instructions}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanView;
