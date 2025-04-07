
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Save, Activity } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Exercise, WorkoutPlan } from '@/lib/types';
import { ExerciseWithVideo } from '@/lib/exerciseApi';
import ExerciseLibraryModal from '@/components/workout/ExerciseLibraryModal';
import PlanDetailsForm from '@/components/workout/PlanDetailsForm';
import ExerciseList from '@/components/workout/ExerciseList';
import PlanOverviewCard from '@/components/workout/PlanOverviewCard';

const WORKOUT_PLAN_TYPES = [
  { id: 'strength', name: 'Strength Training', icon: 'Dumbbell' },
  { id: 'cardio', name: 'Cardio', icon: 'Heart' },
  { id: 'flexibility', name: 'Flexibility', icon: 'Stretch' },
  { id: 'hybrid', name: 'Hybrid', icon: 'Activity' },
];

const WorkoutNew = () => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    duration: 4,
    type: 'strength'
  });
  
  const [exercises, setExercises] = useState<Partial<Exercise>[]>([
    { name: '', sets: 3, reps: 10, day: 1 }
  ]);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);

  // Calculate stats for the preview
  const calculateStats = () => {
    // Get today's date for the overview card
    const today = new Date();
    
    // Find the highest day number to determine weekly frequency
    const highestDay = Math.max(...exercises.map(ex => ex.day || 1));
    const weeklyFrequency = Math.min(highestDay, 7);
    
    return {
      createdAt: today,
      updatedAt: today,
      totalExercises: exercises.filter(ex => ex.name).length,
      weeklyFrequency
    };
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'sets' || field === 'reps' || field === 'day' 
        ? parseInt(value) || 0 
        : value
    };
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: '', sets: 3, reps: 10, day: 1 }
    ]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length === 1) {
      toast.error("You need at least one exercise");
      return;
    }
    
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  const openLibrary = (index: number) => {
    setActiveExerciseIndex(index);
    setIsLibraryOpen(true);
  };

  const closeLibrary = () => {
    setIsLibraryOpen(false);
    setActiveExerciseIndex(null);
  };

  const handleAddFromLibrary = () => {
    setActiveExerciseIndex(exercises.length);
    setIsLibraryOpen(true);
    addExercise();
  };

  const handleSelectExercise = (exerciseWithVideo: ExerciseWithVideo) => {
    if (activeExerciseIndex === null) return;
    
    const updatedExercises = [...exercises];
    updatedExercises[activeExerciseIndex] = {
      ...updatedExercises[activeExerciseIndex],
      name: exerciseWithVideo.name,
      sets: exerciseWithVideo.sets,
      reps: exerciseWithVideo.reps,
      weight: exerciseWithVideo.weight,
      instructions: exerciseWithVideo.instructions
    };
    
    setExercises(updatedExercises);
    toast.success(`Added ${exerciseWithVideo.name} to your workout plan!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!planData.name.trim()) {
      toast.error('Please enter a plan name');
      return;
    }
    
    const incompleteExercises = exercises.some(ex => !ex.name);
    if (incompleteExercises) {
      toast.error('Please complete all exercise information');
      return;
    }
    
    // In a real application, we would save the workout plan to a database
    const newWorkoutPlan = {
      id: `workout-${Date.now()}`,
      name: planData.name,
      description: planData.description,
      duration: planData.duration,
      exercises: exercises.map((ex, index) => ({
        ...ex,
        id: `ex-${Date.now()}-${index}`
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedToClientIds: []
    };
    
    // Simulate adding to the database
    console.log('New workout plan created:', newWorkoutPlan);
    
    toast.success('Workout plan created successfully!');
    navigate('/workouts');
  };

  // Stats for the preview card
  const stats = calculateStats();

  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/workouts')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Workout Plan</h1>
            <p className="text-gray-500 mt-1">Design a new workout program</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <PlanDetailsForm
                name={planData.name}
                description={planData.description}
                duration={planData.duration}
                onChange={handlePlanChange}
              />
              
              <ExerciseList
                exercises={exercises}
                onAddExercise={addExercise}
                onRemoveExercise={removeExercise}
                onExerciseChange={handleExerciseChange}
                onOpenLibrary={openLibrary}
                onAddFromLibrary={handleAddFromLibrary}
              />
              
              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => navigate('/workouts')}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Workout Plan
                </Button>
              </div>
            </form>
          </div>
          
          <div className="order-first lg:order-last">
            <div className="sticky top-24">
              <PlanOverviewCard 
                createdAt={stats.createdAt}
                updatedAt={stats.updatedAt}
                totalExercises={stats.totalExercises}
                weeklyFrequency={stats.weeklyFrequency}
              />
              
              <div className="mt-6 p-4 border rounded-lg bg-amber-50 border-amber-200">
                <div className="flex items-start">
                  <Activity className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium text-amber-800">Tips</h3>
                    <ul className="mt-2 space-y-2 text-sm text-amber-700">
                      <li>• Aim for 1-2 rest days per week</li>
                      <li>• Group exercises by muscle groups</li>
                      <li>• Include both compound and isolation exercises</li>
                      <li>• Consider progressive overload principles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ExerciseLibraryModal 
        isOpen={isLibraryOpen}
        onClose={closeLibrary}
        onSelectExercise={handleSelectExercise}
      />
    </PageTransition>
  );
};

export default WorkoutNew;
