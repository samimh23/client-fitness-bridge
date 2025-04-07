import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Save, Activity, Dumbbell, Heart, LayoutPanelLeft, Lightbulb, InfoIcon } from 'lucide-react';
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
    gradient: 'from-red-100 to-red-200'
  },
  { 
    id: 'cardio', 
    name: 'Cardio', 
    icon: Heart,
    color: 'bg-green-50 border-green-200 text-green-700',
    gradient: 'from-green-100 to-green-200'
  },
  { 
    id: 'flexibility', 
    name: 'Flexibility', 
    icon: Activity,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    gradient: 'from-purple-100 to-purple-200'
  },
  { 
    id: 'hybrid', 
    name: 'Hybrid', 
    icon: LayoutPanelLeft,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    gradient: 'from-blue-100 to-blue-200'
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

  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center mb-6 bg-white p-4 rounded-lg shadow-sm sticky top-16 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/workouts')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Create Workout Plan</h1>
            <p className="text-gray-500 mt-1">Design your professional training program</p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
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
            <Button type="submit" form="workout-form" className="shadow-md hover:shadow-lg transition-shadow">
              <Save className="mr-2 h-4 w-4" />
              Save Workout
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-blue-100 to-blue-200">
                <TabsTrigger 
                  value="details" 
                  className={`text-sm ${activeTab === 'details' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-900'}`}
                >
                  Plan Details
                </TabsTrigger>
                <TabsTrigger 
                  value="exercises" 
                  className={`text-sm ${activeTab === 'exercises' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-900'}`}
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {WORKOUT_PLAN_TYPES.map((type) => (
                          <div 
                            key={type.id}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all 
                              ${planData.type === type.id 
                                ? `${type.color} border-primary bg-gradient-to-br ${type.gradient} shadow-md` 
                                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                              }`}
                            onClick={() => setPlanData(prev => ({ ...prev, type: type.id }))}
                          >
                            <type.icon className={`h-8 w-8 mb-2 ${planData.type === type.id ? 'text-white' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${planData.type === type.id ? 'text-white' : 'text-gray-700'}`}>
                              {type.name}
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
              <ScrollArea className="max-h-[calc(100vh-120px)]">
                <PlanOverviewCard 
                  createdAt={stats.createdAt}
                  updatedAt={stats.updatedAt}
                  totalExercises={stats.totalExercises}
                  weeklyFrequency={stats.weeklyFrequency}
                  className="mb-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md"
                />
                
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md mb-5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-amber-800">
                      <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-amber-700">
                      <li className="flex gap-2">
                        <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-100 text-amber-800 border-amber-200 h-5">01</Badge>
                        <span>Group exercises by muscle groups to optimize recovery</span>
                      </li>
                      <li className="flex gap-2">
                        <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-100 text-amber-800 border-amber-200 h-5">02</Badge>
                        <span>Include both compound and isolation exercises</span>
                      </li>
                      <li className="flex gap-2">
                        <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-100 text-amber-800 border-amber-200 h-5">03</Badge>
                        <span>Implement progressive overload by increasing weight or reps</span>
                      </li>
                      <li className="flex gap-2">
                        <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-100 text-amber-800 border-amber-200 h-5">04</Badge>
                        <span>Allow 1-2 rest days between working the same muscle group</span>
                      </li>
                      <li className="flex gap-2">
                        <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-100 text-amber-800 border-amber-200 h-5">05</Badge>
                        <span>Periodize your program (4-6 weeks) before changing intensity</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                {planData.name && (
                  <Card className="border-primary/10 shadow-md mb-5 bg-gradient-to-br from-white to-blue-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-primary">
                        Plan Summary
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
                              ${WORKOUT_PLAN_TYPES.find(t => t.id === planData.type)?.color} 
                              border-opacity-50 hover:bg-opacity-20
                            `}
                          >
                            {WORKOUT_PLAN_TYPES.find(t => t.id === planData.type)?.name || "Custom"}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {planData.duration} weeks
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {exercises.filter(ex => ex.name).length} exercises
                          </Badge>
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
