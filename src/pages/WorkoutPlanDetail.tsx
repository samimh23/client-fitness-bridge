
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Users, Calendar, ClipboardList, Trash2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { mockWorkoutPlans, mockClients } from '@/lib/data';
import { WorkoutPlan, Exercise, Client } from '@/lib/types';

const WorkoutPlanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [assignedClients, setAssignedClients] = useState<Client[]>([]);
  
  useEffect(() => {
    // Find the plan in mock data
    const foundPlan = mockWorkoutPlans.find(p => p.id === id);
    
    if (foundPlan) {
      setPlan(foundPlan);
      
      // Get assigned clients
      const clients = mockClients.filter(client => 
        foundPlan.assignedToClientIds.includes(client.id)
      );
      setAssignedClients(clients);
    }
  }, [id]);
  
  // Group exercises by day
  const exercisesByDay: Record<number, Exercise[]> = {};
  
  if (plan) {
    plan.exercises.forEach(exercise => {
      if (!exercisesByDay[exercise.day]) {
        exercisesByDay[exercise.day] = [];
      }
      exercisesByDay[exercise.day].push(exercise);
    });
  }
  
  const handleDelete = () => {
    // In a real app, you would delete from a database
    toast.success('Workout plan deleted successfully');
    navigate('/workouts');
  };
  
  const handleEdit = () => {
    toast.info('Edit functionality not implemented yet');
  };
  
  if (!plan) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          Workout plan not found
        </div>
        <Button onClick={() => navigate('/workouts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workouts
        </Button>
      </div>
    );
  }
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/workouts')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold mr-3">{plan.name}</h1>
                <Badge variant="outline" className="ml-2">
                  {plan.duration} weeks
                </Badge>
              </div>
              <p className="text-gray-500 mt-1">{plan.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <PenLine className="mr-2 h-4 w-4" />
              Edit Plan
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Plan Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p>{plan.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p>{plan.updatedAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Exercises</p>
                  <p>{plan.exercises.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weekly Frequency</p>
                  <p>{Object.keys(exercisesByDay).length} days per week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Assigned Clients ({assignedClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedClients.length > 0 ? (
                <div className="space-y-3">
                  {assignedClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {client.avatar ? (
                            <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span className="text-lg font-medium text-gray-500">{client.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/clients/${client.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>This plan is not assigned to any clients yet.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/clients')}
                  >
                    Assign to Clients
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
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
      </div>
    </PageTransition>
  );
};

export default WorkoutPlanDetail;
