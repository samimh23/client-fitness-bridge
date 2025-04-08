
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Save, Activity, Dumbbell, Heart, LayoutPanelLeft, Lightbulb, InfoIcon, Flame, Zap, Sparkles, BarChart2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Exercise, WorkoutPlan } from '@/lib/types';
import { ExerciseWithVideo } from '@/lib/exerciseApi';
import ExerciseLibraryModal from '@/components/workout/ExerciseLibraryModal';
import PlanDetailsForm from '@/components/workout/PlanDetailsForm';
import ExerciseList from '@/components/workout/ExerciseList';
import PlanOverviewCard from '@/components/workout/PlanOverviewCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WORKOUT_PLAN_TYPES = [
  { 
    id: 'strength', 
    name: 'Strength Training', 
    icon: Dumbbell,
    color: 'bg-red-50 border-red-200 text-red-700',
    gradient: 'from-red-100 to-red-200',
    accent: 'text-red-600',
    iconBg: 'bg-red-600',
    description: 'Build muscle & power'
  },
  { 
    id: 'cardio', 
    name: 'Cardio', 
    icon: Heart,
    color: 'bg-green-50 border-green-200 text-green-700',
    gradient: 'from-green-100 to-green-200',
    accent: 'text-green-600',
    iconBg: 'bg-green-600',
    description: 'Improve endurance'
  },
  { 
    id: 'flexibility', 
    name: 'Flexibility', 
    icon: Activity,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    gradient: 'from-purple-100 to-purple-200',
    accent: 'text-purple-600',
    iconBg: 'bg-purple-600',
    description: 'Increase range of motion'
  },
  { 
    id: 'hybrid', 
    name: 'Hybrid', 
    icon: LayoutPanelLeft,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    gradient: 'from-blue-100 to-blue-200',
    accent: 'text-blue-600',
    iconBg: 'bg-blue-600',
    description: 'Balanced approach'
  },
  { 
    id: 'hiit', 
    name: 'HIIT', 
    icon: Flame,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    gradient: 'from-orange-100 to-orange-200',
    accent: 'text-orange-600',
    iconBg: 'bg-orange-600',
    description: 'High intensity intervals'
  },
  { 
    id: 'powerlifting', 
    name: 'Powerlifting', 
    icon: BarChart2,
    color: 'bg-slate-50 border-slate-200 text-slate-700',
    gradient: 'from-slate-100 to-slate-200',
    accent: 'text-slate-600',
    iconBg: 'bg-slate-600',
    description: 'Focus on major lifts'
  },
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
  const [activeTab, setActiveTab] = useState<string>("details");
  const [animateProTips, setAnimateProTips] = useState(false);

  // Trigger the animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateProTips(true), 500);
    return () => clearTimeout(timer);
  }, []);

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
  const selectedPlanType = WORKOUT_PLAN_TYPES.find(t => t.id === planData.type) || WORKOUT_PLAN_TYPES[0];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-md sticky top-16 z-10 border border-blue-100">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/workouts')}
            className="mr-4 hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 bg-clip-text text-transparent">Create Workout Plan</h1>
            <p className="text-gray-500 mt-1">Design your professional training program</p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h3 className="font-medium">Creating Effective Workouts</h3>
                  <p className="text-sm text-muted-foreground">
                    A good workout plan typically includes 3-5 days per week of training with balanced exercises. 
                    Focus on progressive overload and include rest days.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              type="submit" 
              form="workout-form" 
              className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Workout
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-xl p-1">
                <TabsTrigger 
                  value="details" 
                  className={`text-sm rounded-lg ${activeTab === 'details' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-900'}`}
                >
                  Plan Details
                </TabsTrigger>
                <TabsTrigger 
                  value="exercises" 
                  className={`text-sm rounded-lg ${activeTab === 'exercises' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-900'}`}
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
                  
                  <Card className="border-primary/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">Workout Type</CardTitle>
                      <CardDescription>Select the primary focus of this workout plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {WORKOUT_PLAN_TYPES.map((type) => (
                          <div 
                            key={type.id}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105
                              ${planData.type === type.id 
                                ? `${type.color} border-primary bg-gradient-to-br ${type.gradient} shadow-md` 
                                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                              }`}
                            onClick={() => setPlanData(prev => ({ ...prev, type: type.id }))}
                          >
                            <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-3 ${planData.type === type.id ? type.iconBg + ' text-white' : 'bg-gray-100 ' + type.accent}`}>
                              <type.icon className="h-6 w-6" />
                            </div>
                            <span className={`text-sm font-semibold mb-1 ${planData.type === type.id ? 'text-gray-800' : type.accent}`}>
                              {type.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {type.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="exercises" className="mt-0">
                  <ExerciseList
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
          
          <div className="order-first lg:order-last">
            <div className="sticky top-24">
              <ScrollArea className="max-h-[calc(100vh-120px)] pr-2">
                <PlanOverviewCard 
                  createdAt={stats.createdAt}
                  updatedAt={stats.updatedAt}
                  totalExercises={stats.totalExercises}
                  weeklyFrequency={stats.weeklyFrequency}
                  className={`mb-5 bg-gradient-to-br from-${selectedPlanType.id === 'strength' ? 'blue' : selectedPlanType.accent?.split('-')[1]}-50 to-${selectedPlanType.id === 'strength' ? 'blue' : selectedPlanType.accent?.split('-')[1]}-100 border-${selectedPlanType.id === 'strength' ? 'blue' : selectedPlanType.accent?.split('-')[1]}-200 shadow-md`}
                />
                
                <Card className={`bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md mb-5 max-h-[500px] overflow-hidden ${animateProTips ? 'animate-fade-in' : 'opacity-0'}`}>
                  <CardHeader className="pb-2 sticky top-0 bg-amber-50 z-10 border-b border-amber-100">
                    <CardTitle className="text-lg flex items-center text-amber-800">
                      <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                      Pro Training Tips
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-[400px]">
                    <CardContent className="p-4">
                      <ul className="space-y-3 text-sm text-amber-700">
                        {[
                          "Group exercises by muscle groups to optimize recovery",
                          "Include both compound and isolation exercises for complete development",
                          "Implement progressive overload by gradually increasing weight, reps, or sets",
                          "Allow 48-72 hours rest between training the same muscle group",
                          "Periodize your program (4-6 weeks) before changing intensity to avoid plateaus",
                          "Start with compound movements when your energy is highest",
                          "Use a proper warm-up protocol before heavy lifting to prevent injury",
                          "Track your progress with a workout journal or fitness app",
                          "Stay hydrated (aim for 3-4 liters daily) during training periods",
                          "Consume protein within 30 minutes post-workout for optimal recovery",
                          "Listen to your body and avoid overtraining - rest is when growth occurs",
                          "Incorporate mobility and stretching exercises to maintain flexibility",
                          "Focus on proper form over heavy weights to prevent injuries",
                          "Include deload weeks (lighter training) every 4-6 weeks for recovery",
                          "Consider your experience level when selecting exercise difficulty",
                          "Alternate between pushing and pulling movements for balanced development",
                          "Use tempo variations to increase time under tension for hypertrophy",
                          "Plan your workout splits based on your weekly availability",
                          "Adjust volume based on your recovery capacity and stress levels",
                          "Balance your program with cardiovascular training for heart health"
                        ].map((tip, index) => (
                          <li key={index} className="flex gap-2 group hover:bg-amber-100/40 p-2 rounded-lg transition-colors">
                            <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-100 text-amber-800 border-amber-200 h-5 group-hover:bg-amber-200">
                              {String(index + 1).padStart(2, '0')}
                            </Badge>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </ScrollArea>
                </Card>
                
                {planData.name && (
                  <Card className={`border-${selectedPlanType.accent?.split('-')[1]}-300 shadow-md mb-5 bg-gradient-to-br from-white via-${selectedPlanType.accent?.split('-')[1]}-50 to-${selectedPlanType.accent?.split('-')[1]}-100 transition-all duration-300 hover:shadow-lg`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className={selectedPlanType.accent}>Plan Summary</span>
                        <Sparkles className={`h-4 w-4 ${selectedPlanType.accent}`} />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-xl text-gray-800">{planData.name || "Untitled Plan"}</h3>
                          <p className="text-sm text-gray-500 mt-1">{planData.description || "No description provided"}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`
                              ${selectedPlanType.color}
                              border-opacity-50 hover:bg-opacity-20
                            `}
                          >
                            {selectedPlanType.name || "Custom"}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {planData.duration} weeks
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {exercises.filter(ex => ex.name).length} exercises
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                          <div className="text-center p-2 rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500">FREQUENCY</p>
                            <p className="text-lg font-semibold">{stats.weeklyFrequency}x / week</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500">INTENSITY</p>
                            <div className="flex justify-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map(i => (
                                <Zap 
                                  key={i} 
                                  className={`h-4 w-4 ${i <= Math.min(Math.ceil(exercises.length / 3), 5) ? selectedPlanType.accent : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </ScrollArea>
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
