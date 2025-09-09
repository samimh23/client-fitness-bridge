import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Exercise, WorkoutPlan } from '@/lib/types';
import { ExerciseWithVideo } from '@/lib/exerciseApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/PageTransition';
import ExerciseLibraryModal from '@/components/workout/ExerciseLibraryModal';
import PlanDetailsForm from '@/components/workout/PlanDetailsForm';
import WorkoutTypeSelector, { WORKOUT_PLAN_TYPES } from '@/components/workout/WorkoutTypeSelector';
import WorkoutFormHeader from '@/components/workout/WorkoutFormHeader';
import TrainingTipsDrawer from '@/components/workout/TrainingTipsDrawer';
import PlanSummaryCard from '@/components/workout/PlanSummaryCard';
import DayBasedExerciseList from '@/components/workout/DayBasedExerciseList';

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
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isProTipsOpen, setIsProTipsOpen] = useState(false);

  const calculateStats = () => {
    const today = new Date();
    
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

  const handleTypeChange = (typeId: string) => {
    setPlanData(prev => ({ ...prev, type: typeId }));
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

  const addExercise = (day: number = 1) => {
    setExercises([
      ...exercises,
      { name: '', sets: 3, reps: 10, day }
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

  const handleAddFromLibrary = (day: number = 1) => {
    setActiveExerciseIndex(exercises.length);
    setIsLibraryOpen(true);
    addExercise(day);
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
    
    if (!planData.name.trim()) {
      toast.error('Please enter a plan name');
      return;
    }
    
    const incompleteExercises = exercises.some(ex => !ex.name);
    if (incompleteExercises) {
      toast.error('Please complete all exercise information');
      return;
    }
    
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
    
    console.log('New workout plan created:', newWorkoutPlan);
    
    toast.success('Workout plan created successfully!');
    navigate('/workouts');
  };

  const stats = calculateStats();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <WorkoutFormHeader 
            onBackClick={() => navigate('/workouts')}
            onOpenTips={() => setIsProTipsOpen(true)}
          />
          
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/30">
                    <TabsTrigger 
                      value="details" 
                      className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      Plan Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="exercises" 
                      className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      Exercises
                    </TabsTrigger>
                  </TabsList>
                  
                  <form id="workout-form" onSubmit={handleSubmit}>
                    <TabsContent value="details" className="mt-0 space-y-6">
                      <PlanDetailsForm
                        name={planData.name}
                        description={planData.description}
                        duration={planData.duration}
                        onChange={handlePlanChange}
                      />
                      
                      <WorkoutTypeSelector 
                        selectedType={planData.type} 
                        onTypeChange={handleTypeChange}
                      />
                    </TabsContent>
                    
                    <TabsContent value="exercises" className="mt-0">
                      <DayBasedExerciseList
                        exercises={exercises}
                        onAddExercise={addExercise}
                        onRemoveExercise={removeExercise}
                        onExerciseChange={handleExerciseChange}
                        onOpenLibrary={openLibrary}
                        onAddFromLibrary={handleAddFromLibrary}
                      />
                    </TabsContent>
                  </form>
                </Tabs>
              </div>
              
              {/* Compact Summary Sidebar */}
              {planData.name && (
                <div className="xl:w-80 xl:sticky xl:top-24 xl:h-fit">
                  <PlanSummaryCard
                    name={planData.name}
                    description={planData.description}
                    type={planData.type}
                    duration={planData.duration}
                    exerciseCount={stats.totalExercises}
                    weeklyFrequency={stats.weeklyFrequency}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ExerciseLibraryModal 
        isOpen={isLibraryOpen}
        onClose={closeLibrary}
        onSelectExercise={handleSelectExercise}
      />

      <TrainingTipsDrawer
        isOpen={isProTipsOpen}
        onOpenChange={setIsProTipsOpen}
      />
    </PageTransition>
  );
};

export default WorkoutNew;
