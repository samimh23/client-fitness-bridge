import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Exercise, WorkoutPlan } from '@/lib/types';
import { ExerciseWithVideo } from '@/lib/exerciseApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import PageTransition from '@/components/PageTransition';
import ExerciseLibraryModal from '@/components/workout/ExerciseLibraryModal';
import WorkoutTypeSelector, { WORKOUT_PLAN_TYPES } from '@/components/workout/WorkoutTypeSelector';
import TrainingTipsDrawer from '@/components/workout/TrainingTipsDrawer';
import ModernExerciseManager from '@/components/workout/ModernExerciseManager';
import { 
  ArrowLeft, 
  BookOpen, 
  Save, 
  Dumbbell, 
  BarChart3, 
  Calendar, 
  Target,
  Clock,
  CheckCircle,
  Settings,
  Plus,
  Copy,
  GripVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
  const [activeDay, setActiveDay] = useState<number>(1);
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

  // Group exercises by day
  const exercisesByDay = exercises.reduce((acc, exercise) => {
    const day = exercise.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(exercise);
    return acc;
  }, {} as { [key: number]: Partial<Exercise>[] });
  
  const activeDays = Object.keys(exercisesByDay).map(Number).sort((a, b) => a - b);

  // Add new day functionality
  const addNewDay = () => {
    const maxDay = Math.max(...activeDays, 0);
    const newDay = maxDay + 1;
    addExercise(newDay);
    setActiveDay(newDay);
  };

  // Copy day functionality
  const handleCopyDay = (sourceDay: number) => {
    const sourceDayExercises = exercisesByDay[sourceDay] || [];
    if (sourceDayExercises.length === 0) return;

    const newDay = Math.max(...activeDays, 0) + 1;
    
    sourceDayExercises.forEach(exercise => {
      const newExercise = {
        ...exercise,
        day: newDay
      };
      addExercise(newDay);
      setTimeout(() => {
        const newIndex = exercises.length;
        Object.keys(newExercise).forEach(key => {
          if (key !== 'day') {
            handleExerciseChange(newIndex, key as keyof Exercise, newExercise[key as keyof Exercise]);
          }
        });
      }, 0);
    });
    
    setActiveDay(newDay);
    toast.success(`Copied Day ${sourceDay} to Day ${newDay}`);
  };

  // Navigate to previous/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    const currentIndex = activeDays.indexOf(activeDay);
    if (direction === 'prev' && currentIndex > 0) {
      setActiveDay(activeDays[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < activeDays.length - 1) {
      setActiveDay(activeDays[currentIndex + 1]);
    }
  };

  // Get current day info
  const currentDayExercises = exercisesByDay[activeDay] || [];
  const currentDayComplete = currentDayExercises.filter(ex => ex.name && ex.sets && ex.reps).length;
  const currentDayTotal = currentDayExercises.filter(ex => ex.name).length;
  const currentDayProgress = currentDayTotal > 0 ? Math.round((currentDayComplete / currentDayTotal) * 100) : 0;

  // Calculate workout intensity score
  const calculateIntensityScore = () => {
    const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
    const totalReps = exercises.reduce((sum, ex) => sum + (ex.reps || 0), 0);
    const totalVolume = totalSets * totalReps;
    
    if (totalVolume === 0) return 0;
    if (totalVolume < 100) return 1;
    if (totalVolume < 300) return 2;
    if (totalVolume < 500) return 3;
    return 4;
  };

  const intensityScore = calculateIntensityScore();
  const intensityLabels = ['Light', 'Moderate', 'Intense', 'Extreme'];
  const intensityColors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        {/* Sticky Header - Responsive */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/workouts')}
                  className="flex items-center gap-2 h-8 sm:h-9"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Workouts</span>
                  <span className="sm:hidden">Back</span>
                </Button>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <h1 className="text-lg sm:text-xl font-bold truncate">Create New Workout Plan</h1>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProTipsOpen(true)}
                  className="flex items-center gap-2 h-8 sm:h-9"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Tips</span>
                </Button>
                <Button
                  type="submit"
                  form="workout-form"
                  size="sm"
                  className="flex items-center gap-2 h-8 sm:h-9 shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save Workout</span>
                  <span className="sm:hidden">Save</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Sidebar - Plan Details */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Quick Plan Setup */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Workout Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Plan Name *
                      </label>
                      <Input
                        name="name"
                        value={planData.name}
                        onChange={handlePlanChange}
                        placeholder="e.g., Upper Body Strength"
                        className="w-full h-10"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Duration (weeks)
                      </label>
                      <Input
                        name="duration"
                        type="number"
                        value={planData.duration}
                        onChange={handlePlanChange}
                        min="1"
                        max="52"
                        className="w-full h-10"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Workout Type
                      </label>
                      <WorkoutTypeSelector 
                        selectedType={planData.type} 
                        onTypeChange={handleTypeChange}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Description
                      </label>
                      <Textarea
                        name="description"
                        value={planData.description}
                        onChange={handlePlanChange}
                        placeholder="Brief description of your workout plan..."
                        className="w-full h-20 resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Workout Stats */}
                {exercises.length > 0 && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Workout Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Intensity Score */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Intensity</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${intensityColors[intensityScore]}`} />
                          <span className="text-sm font-medium">{intensityLabels[intensityScore]}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Basic Stats */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Exercises</span>
                          <Badge variant="secondary" className="text-sm">
                            {stats.totalExercises}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Training Days</span>
                          <Badge variant="secondary" className="text-sm">
                            {activeDays.length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Weekly Frequency</span>
                          <Badge variant="secondary" className="text-sm">
                            {stats.weeklyFrequency}/week
                          </Badge>
                        </div>
                      </div>

                      <Separator />

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">
                            {Math.round((exercises.filter(ex => ex.name && ex.sets && ex.reps).length / stats.totalExercises) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(exercises.filter(ex => ex.name && ex.sets && ex.reps).length / stats.totalExercises) * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{exercises.filter(ex => ex.name && ex.sets && ex.reps).length} complete</span>
                          <span>{stats.totalExercises} total</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Current Day Info */}
                {activeDays.length > 0 && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Current Day
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Day Navigation */}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateDay('prev')}
                          disabled={activeDays.indexOf(activeDay) === 0}
                          className="flex items-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold gradient-text">{activeDay}</div>
                          <div className="text-xs text-muted-foreground">Day {activeDay} of {activeDays.length}</div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateDay('next')}
                          disabled={activeDays.indexOf(activeDay) === activeDays.length - 1}
                          className="flex items-center gap-1"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Day Progress */}
                      {currentDayTotal > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Day Progress</span>
                            <span className="text-sm font-medium">{currentDayProgress}%</span>
                          </div>
                          <Progress value={currentDayProgress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{currentDayComplete} complete</span>
                            <span>{currentDayTotal} exercises</span>
                          </div>
                        </div>
                      )}

                      {/* Day Actions */}
                      <div className="space-y-2">
                        {currentDayTotal > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyDay(activeDay)}
                            className="w-full flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy Day {activeDay}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addNewDay}
                          className="w-full flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add New Day
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="xl:col-span-3">
              <form id="workout-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Exercise Management */}
                <ModernExerciseManager
                  exercises={exercises}
                  onAddExercise={addExercise}
                  onRemoveExercise={removeExercise}
                  onExerciseChange={handleExerciseChange}
                  onOpenLibrary={openLibrary}
                  onAddFromLibrary={handleAddFromLibrary}
                />
              </form>
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