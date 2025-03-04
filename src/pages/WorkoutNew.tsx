
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Save, Trash2, Dumbbell } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Exercise } from '@/lib/types';
import { ExerciseWithVideo } from '@/lib/exerciseApi';
import ExerciseLibraryModal from '@/components/workout/ExerciseLibraryModal';

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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Beginner Strength Training"
                      value={planData.name}
                      onChange={handlePlanChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the goals and focus of this workout plan"
                      rows={3}
                      value={planData.description}
                      onChange={handlePlanChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (weeks)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min={1}
                      max={52}
                      value={planData.duration}
                      onChange={handlePlanChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Exercises</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={() => {
                      setActiveExerciseIndex(exercises.length);
                      setIsLibraryOpen(true);
                      addExercise();
                    }} 
                    variant="secondary"
                    size="sm"
                  >
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Browse Exercise Library
                  </Button>
                  <Button type="button" onClick={addExercise} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exercise Manually
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {exercises.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    {index > 0 && <Separator className="my-6" />}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Exercise {index + 1}</h3>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => openLibrary(index)}
                        >
                          <Dumbbell className="h-4 w-4 mr-1" /> 
                          Select From Library
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-${index}-name`}>
                          Exercise Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`exercise-${index}-name`}
                          placeholder="e.g., Squat, Bench Press, Deadlift"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-${index}-day`}>
                          Day <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`exercise-${index}-day`}
                          type="number"
                          min={1}
                          max={7}
                          value={exercise.day}
                          onChange={(e) => handleExerciseChange(index, 'day', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-${index}-sets`}>
                          Sets <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`exercise-${index}-sets`}
                          type="number"
                          min={1}
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-${index}-reps`}>
                          Reps <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`exercise-${index}-reps`}
                          type="number"
                          min={1}
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-${index}-weight`}>
                          Weight (optional)
                        </Label>
                        <Input
                          id={`exercise-${index}-weight`}
                          placeholder="e.g., 50kg, bodyweight"
                          value={exercise.weight || ''}
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`exercise-${index}-instructions`}>
                          Instructions (optional)
                        </Label>
                        <Input
                          id={`exercise-${index}-instructions`}
                          placeholder="Brief instructions"
                          value={exercise.instructions || ''}
                          onChange={(e) => handleExerciseChange(index, 'instructions', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
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
