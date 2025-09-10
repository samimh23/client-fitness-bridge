import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Exercise, WorkoutPlan, WorkoutDay } from '@/lib/types';
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
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isProTipsOpen, setIsProTipsOpen] = useState(false);

  // Form state
  const [planData, setPlanData] = useState({
    planName: '',
    description: '',
    status: 'ACTIVE' as const,
    weekNumber: 1,
    difficulty: 'Beginner' as const
  });
  
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([
    {
      dayNumber: 1,
      title: 'Day 1',
      exercises: [{ name: '', sets: 3, reps: 10, order: 1 }]
    }
  ]);

  const [activeExerciseIndex, setActiveExerciseIndex] = useState<{ dayIndex: number; exerciseIndex: number } | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);

  // Form methods
  const calculateStats = () => {
    const today = new Date();
    
    const totalExercises = workoutDays.reduce((sum, day) => sum + day.exercises.length, 0);
    const totalSets = workoutDays.reduce((sum, day) => 
      sum + day.exercises.reduce((daySum, ex) => daySum + (ex.sets || 0), 0), 0
    );
    const totalReps = workoutDays.reduce((sum, day) => 
      sum + day.exercises.reduce((daySum, ex) => daySum + (ex.reps || 0), 0), 0
    );
    const weeklyFrequency = workoutDays.length;
    
    return {
      createdAt: today,
      updatedAt: today,
      totalExercises,
      weeklyFrequency,
      totalSets,
      totalReps
    };
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlanData(prev => ({
      ...prev,
      [name]: name === 'weekNumber' ? parseInt(value) || 1 : value
    }));
  };

  const handleExerciseChange = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: string | number) => {
    const updatedWorkoutDays = [...workoutDays];
    updatedWorkoutDays[dayIndex].exercises[exerciseIndex] = {
      ...updatedWorkoutDays[dayIndex].exercises[exerciseIndex],
      [field]: field === 'sets' || field === 'reps' || field === 'order' || field === 'restPeriod'
  ? (typeof value === 'string' ? parseInt(value) || 0 : value)
        : value
    };
    setWorkoutDays(updatedWorkoutDays);
  };

  const addExercise = (dayIndex: number) => {
    const updatedWorkoutDays = [...workoutDays];
    const maxOrder = Math.max(...updatedWorkoutDays[dayIndex].exercises.map(ex => ex.order), 0);
    updatedWorkoutDays[dayIndex].exercises.push({
      name: '',
      sets: 3,
      reps: 10,
      order: maxOrder + 1
    });
    setWorkoutDays(updatedWorkoutDays);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedWorkoutDays = [...workoutDays];
    if (updatedWorkoutDays[dayIndex].exercises.length === 1) {
      toast.error("You need at least one exercise");
      return;
    }
    
    updatedWorkoutDays[dayIndex].exercises.splice(exerciseIndex, 1);
    // Reorder exercises
    updatedWorkoutDays[dayIndex].exercises.forEach((ex, index) => {
      ex.order = index + 1;
    });
    setWorkoutDays(updatedWorkoutDays);
  };

  const openLibrary = (dayIndex: number, exerciseIndex: number) => {
    setActiveExerciseIndex({ dayIndex, exerciseIndex });
    setIsLibraryOpen(true);
  };

  const closeLibrary = () => {
    setIsLibraryOpen(false);
    setActiveExerciseIndex(null);
  };

  const handleAddFromLibrary = (dayIndex: number) => {
    const exerciseIndex = workoutDays[dayIndex].exercises.length;
    setActiveExerciseIndex({ dayIndex, exerciseIndex });
    setIsLibraryOpen(true);
    addExercise(dayIndex);
  };

  const handleSelectExercise = (exerciseWithVideo: ExerciseWithVideo) => {
    if (!activeExerciseIndex) return;
    
    const { dayIndex, exerciseIndex } = activeExerciseIndex;
    const updatedWorkoutDays = [...workoutDays];
    updatedWorkoutDays[dayIndex].exercises[exerciseIndex] = {
      ...updatedWorkoutDays[dayIndex].exercises[exerciseIndex],
      name: exerciseWithVideo.name,
      sets: exerciseWithVideo.sets,
      reps: exerciseWithVideo.reps,
      videoUrl: exerciseWithVideo.videoUrl,
      instructions: exerciseWithVideo.instructions
    };
    
    setWorkoutDays(updatedWorkoutDays);
    toast.success(`Added ${exerciseWithVideo.name} to your workout plan!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!planData.planName.trim()) {
      toast.error('Please enter a plan name');
      return;
    }
    
    const incompleteExercises = workoutDays.some(day => 
      day.exercises.some(ex => !ex.name)
    );
    if (incompleteExercises) {
      toast.error('Please complete all exercise information');
      return;
    }
    
    const newWorkoutPlan = {
      id: `workout-${Date.now()}`,
      planName: planData.planName,
      description: planData.description,
      status: planData.status,
      weekNumber: planData.weekNumber,
      difficulty: planData.difficulty,
      workoutDays: workoutDays
    };
    
    console.log('New workout plan created:', newWorkoutPlan);
    toast.success('Workout plan created successfully!');
    navigate('/workouts');
  };

  // Wrapper functions for ModernExerciseManager compatibility
  const getAllExercises = () => {
    return workoutDays.flatMap(day => 
      day.exercises.map(ex => ({ ...ex, day: day.dayNumber }))
    );
  };

  const handleAddExerciseWrapper = (day: number) => {
    const dayIndex = workoutDays.findIndex(d => d.dayNumber === day);
    if (dayIndex !== -1) {
      addExercise(dayIndex);
    }
  };

  const handleRemoveExerciseWrapper = (index: number) => {
    // Find the exercise in the flat structure and remove it
    const allExercises = getAllExercises();
    const exerciseToRemove = allExercises[index];
    if (exerciseToRemove) {
      const dayIndex = workoutDays.findIndex(d => d.dayNumber === exerciseToRemove.day);
      const exerciseIndex = workoutDays[dayIndex].exercises.findIndex(ex => 
        ex.name === exerciseToRemove.name && ex.sets === exerciseToRemove.sets
      );
      if (dayIndex !== -1 && exerciseIndex !== -1) {
        removeExercise(dayIndex, exerciseIndex);
      }
    }
  };

  const handleExerciseChangeWrapper = (index: number, field: keyof Exercise, value: string | number) => {
    // Find the exercise in the flat structure and update it
    const allExercises = getAllExercises();
    const exerciseToChange = allExercises[index];
    if (exerciseToChange) {
      const dayIndex = workoutDays.findIndex(d => d.dayNumber === exerciseToChange.day);
      const exerciseIndex = workoutDays[dayIndex].exercises.findIndex(ex => 
        ex.name === exerciseToChange.name && ex.sets === exerciseToChange.sets
      );
      if (dayIndex !== -1 && exerciseIndex !== -1) {
        handleExerciseChange(dayIndex, exerciseIndex, field, value);
      }
    }
  };

  const handleOpenLibraryWrapper = (index: number) => {
    // Find the exercise in the flat structure and open library for it
    const allExercises = getAllExercises();
    const exerciseToEdit = allExercises[index];
    if (exerciseToEdit) {
      const dayIndex = workoutDays.findIndex(d => d.dayNumber === exerciseToEdit.day);
      const exerciseIndex = workoutDays[dayIndex].exercises.findIndex(ex => 
        ex.name === exerciseToEdit.name && ex.sets === exerciseToEdit.sets
      );
      if (dayIndex !== -1 && exerciseIndex !== -1) {
        openLibrary(dayIndex, exerciseIndex);
      }
    }
  };

  const handleAddFromLibraryWrapper = (day: number) => {
    const dayIndex = workoutDays.findIndex(d => d.dayNumber === day);
    if (dayIndex !== -1) {
      handleAddFromLibrary(dayIndex);
    }
  };

  const stats = calculateStats();

  // Add new day functionality
  const addNewDay = () => {
    const newDayNumber = Math.max(...workoutDays.map(day => day.dayNumber), 0) + 1;
    const newDay: WorkoutDay = {
      dayNumber: newDayNumber,
      title: `Day ${newDayNumber}`,
      exercises: [{ name: '', sets: 3, reps: 10, order: 1 }]
    };
    setWorkoutDays([...workoutDays, newDay]);
    setActiveDay(newDayNumber);
  };

  // Copy day functionality
  const handleCopyDay = (sourceDayIndex: number) => {
    const sourceDay = workoutDays[sourceDayIndex];
    if (!sourceDay || sourceDay.exercises.length === 0) return;

    const newDayNumber = Math.max(...workoutDays.map(day => day.dayNumber), 0) + 1;
    const newDay: WorkoutDay = {
      dayNumber: newDayNumber,
      title: `Day ${newDayNumber}`,
      exercises: sourceDay.exercises.map(ex => ({ ...ex }))
    };
    
    setWorkoutDays([...workoutDays, newDay]);
    setActiveDay(newDayNumber);
    toast.success(`Copied Day ${sourceDay.dayNumber} to Day ${newDayNumber}`);
  };

  // Navigate to previous/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    const currentIndex = workoutDays.findIndex(day => day.dayNumber === activeDay);
    if (direction === 'prev' && currentIndex > 0) {
      setActiveDay(workoutDays[currentIndex - 1].dayNumber);
    } else if (direction === 'next' && currentIndex < workoutDays.length - 1) {
      setActiveDay(workoutDays[currentIndex + 1].dayNumber);
    }
  };

  // Get current day info
  const currentDay = workoutDays.find(day => day.dayNumber === activeDay);
  const currentDayExercises = currentDay?.exercises || [];
  const currentDayComplete = currentDayExercises.filter(ex => ex.name && ex.sets && ex.reps).length;
  const currentDayTotal = currentDayExercises.filter(ex => ex.name).length;
  const currentDayProgress = currentDayTotal > 0 ? Math.round((currentDayComplete / currentDayTotal) * 100) : 0;

  // Calculate workout intensity score
  const calculateIntensityScore = () => {
    const totalSets = workoutDays.reduce((sum, day) => 
      sum + day.exercises.reduce((daySum, ex) => daySum + (ex.sets || 0), 0), 0
    );
    const totalReps = workoutDays.reduce((sum, day) => 
      sum + day.exercises.reduce((daySum, ex) => daySum + (ex.reps || 0), 0), 0
    );
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
                          name="planName"
                          value={planData.planName}
                          onChange={handlePlanChange}
                          placeholder="e.g., Beginner Strength Plan"
                          className="w-full h-10"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">
                          Status
                        </label>
                        <select
                          name="status"
                          value={planData.status}
                          onChange={handlePlanChange}
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">
                          Week Number
                        </label>
                        <Input
                          name="weekNumber"
                          type="number"
                          value={planData.weekNumber}
                          onChange={handlePlanChange}
                          min="1"
                          max="52"
                          className="w-full h-10"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          value={planData.difficulty}
                          onChange={handlePlanChange}
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
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
                  {workoutDays.length > 0 && (
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
                            <div className={`w-3 h-3 rounded-full ${intensityColors[intensityScore - 1] || 'bg-green-500'}`} />
                            <span className="text-sm font-medium">{intensityLabels[intensityScore - 1] || 'Light'}</span>
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
                              {workoutDays.length}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Sets</span>
                            <Badge variant="secondary" className="text-sm">
                              {stats.totalSets}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Reps</span>
                            <Badge variant="secondary" className="text-sm">
                              {stats.totalReps}
                            </Badge>
                          </div>
                        </div>

                        <Separator />

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">
                              {Math.round((workoutDays.reduce((complete, day) => 
                                complete + day.exercises.filter(ex => ex.name && ex.sets && ex.reps).length, 0
                              ) / stats.totalExercises) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(workoutDays.reduce((complete, day) => 
                              complete + day.exercises.filter(ex => ex.name && ex.sets && ex.reps).length, 0
                            ) / stats.totalExercises) * 100} 
                            className="h-2" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{workoutDays.reduce((complete, day) => 
                              complete + day.exercises.filter(ex => ex.name && ex.sets && ex.reps).length, 0
                            )} complete</span>
                            <span>{stats.totalExercises} total</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Current Day Info */}
                  {workoutDays.length > 0 && (
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
                            disabled={workoutDays.findIndex(day => day.dayNumber === activeDay) === 0}
                            className="flex items-center gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold gradient-text">{activeDay}</div>
                            <div className="text-xs text-muted-foreground">Day {activeDay} of {workoutDays.length}</div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateDay('next')}
                            disabled={workoutDays.findIndex(day => day.dayNumber === activeDay) === workoutDays.length - 1}
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
                    exercises={getAllExercises()}
                    onAddExercise={handleAddExerciseWrapper}
                    onRemoveExercise={handleRemoveExerciseWrapper}
                    onExerciseChange={handleExerciseChangeWrapper}
                    onOpenLibrary={handleOpenLibraryWrapper}
                    onAddFromLibrary={handleAddFromLibraryWrapper}
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