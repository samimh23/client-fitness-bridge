
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Exercise } from '@/lib/types';
import { ExerciseWithVideo } from '@/lib/exerciseApi';
import ExerciseLibraryModal from '@/components/workout/ExerciseLibraryModal';
import PlanDetailsForm from '@/components/workout/PlanDetailsForm';
import ExerciseList from '@/components/workout/ExerciseList';

const WorkoutNew = () => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    duration: 4
  });
  
  const [exercises, setExercises] = useState<Partial<Exercise>[]>([
    { name: '', sets: 3, reps: 10, day: 1 }
  ]);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);

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
        
        <div className="max-w-4xl mx-auto">
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
