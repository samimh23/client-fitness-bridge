
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { mockWorkoutPlans, mockClients } from '@/lib/data';
import { WorkoutPlan, Exercise, Client } from '@/lib/types';
import DeleteWorkoutDialog from '@/components/workout/DeleteWorkoutDialog';
import WorkoutPlanHeader from '@/components/workout/WorkoutPlanHeader';
import PlanOverviewCard from '@/components/workout/PlanOverviewCard';
import AssignedClientsCard from '@/components/workout/AssignedClientsCard';
import WorkoutScheduleCard from '@/components/workout/WorkoutScheduleCard';

const WorkoutPlanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [assignedClients, setAssignedClients] = useState<Client[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
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
    // Close the dialog
    setShowDeleteDialog(false);
    
    // In a real app, you would delete from a database
    // Here we just show a toast and navigate away
    toast.success('Workout plan deleted successfully');
    navigate('/workouts');
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
        {/* Header with actions */}
        <WorkoutPlanHeader
          planId={plan.id}
          planName={plan.name}
          planDescription={plan.description}
          planDuration={plan.duration}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />
        
        {/* Delete Confirmation Dialog */}
        <DeleteWorkoutDialog
          isOpen={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          hasAssignedClients={assignedClients.length > 0}
        />
        
        {/* Plan summary cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PlanOverviewCard
            createdAt={plan.createdAt}
            updatedAt={plan.updatedAt}
            totalExercises={plan.exercises.length}
            weeklyFrequency={Object.keys(exercisesByDay).length}
          />
          
          <AssignedClientsCard clients={assignedClients} />
        </div>
        
        {/* Workout schedule */}
        <WorkoutScheduleCard exercisesByDay={exercisesByDay} />
      </div>
    </PageTransition>
  );
};

export default WorkoutPlanDetail;
