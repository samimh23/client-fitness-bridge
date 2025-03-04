
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Plus } from 'lucide-react';
import { ExerciseWithVideo, fetchExercises, getExerciseCategories } from '@/lib/exerciseApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExerciseSearchProps {
  onSelectExercise: (exercise: ExerciseWithVideo) => void;
}

const ExerciseSearch = ({ onSelectExercise }: ExerciseSearchProps) => {
  const [exercises, setExercises] = useState<ExerciseWithVideo[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseWithVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videoDialog, setVideoDialog] = useState<{ isOpen: boolean; exercise: ExerciseWithVideo | null }>({
    isOpen: false,
    exercise: null,
  });

  useEffect(() => {
    const loadExercises = async () => {
      const exerciseData = await fetchExercises();
      setExercises(exerciseData);
      setFilteredExercises(exerciseData);
      setCategories(getExerciseCategories());
    };
    
    loadExercises();
  }, []);

  useEffect(() => {
    let result = exercises;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(ex => ex.category === selectedCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(
        ex => 
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.muscles.some(muscle => muscle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredExercises(result);
  }, [searchQuery, selectedCategory, exercises]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleViewVideo = (exercise: ExerciseWithVideo) => {
    setVideoDialog({
      isOpen: true,
      exercise,
    });
  };

  const handleCloseVideo = () => {
    setVideoDialog({
      isOpen: false,
      exercise: null,
    });
  };

  const handleAddExercise = (exercise: ExerciseWithVideo) => {
    onSelectExercise(exercise);
  };

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        <Input
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all" onClick={() => handleCategoryChange('all')}>
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger 
              key={category}
              value={category}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory || 'all'} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={exercise.thumbnail} 
                      alt={exercise.name} 
                      className="w-full h-32 object-cover"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute right-2 bottom-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                      onClick={() => handleViewVideo(exercise)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                      <Badge variant={
                        exercise.difficulty === 'beginner' ? 'outline' : 
                        exercise.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                      }>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {exercise.muscles.map((muscle) => (
                        <Badge key={muscle} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {exercise.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm">
                        <span className="font-medium">{exercise.sets} sets</span> x{' '}
                        <span className="font-medium">{exercise.reps} reps</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddExercise(exercise)}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No exercises found. Try a different search term or category.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={videoDialog.isOpen} onOpenChange={handleCloseVideo}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{videoDialog.exercise?.name}</DialogTitle>
          </DialogHeader>
          {videoDialog.exercise && (
            <div className="pt-4">
              <div className="relative aspect-video">
                <iframe
                  src={videoDialog.exercise.videoUrl}
                  title={videoDialog.exercise.name}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Instructions:</h4>
                <p className="text-sm text-gray-600 mb-4">{videoDialog.exercise.instructions}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {videoDialog.exercise.muscles.map((muscle) => (
                    <Badge key={muscle} variant="outline">
                      {muscle}
                    </Badge>
                  ))}
                </div>
                <Button 
                  onClick={() => {
                    handleAddExercise(videoDialog.exercise!);
                    handleCloseVideo();
                  }}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add to Workout Plan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExerciseSearch;
