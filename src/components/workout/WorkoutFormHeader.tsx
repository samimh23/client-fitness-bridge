
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Lightbulb, InfoIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WorkoutFormHeaderProps {
  onBackClick: () => void;
  onOpenTips: () => void;
}

const WorkoutFormHeader = ({ onBackClick, onOpenTips }: WorkoutFormHeaderProps) => {
  return (
    <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-md sticky top-16 z-10 border border-blue-100">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onBackClick}
        className="mr-4 hover:bg-blue-50"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 bg-clip-text text-transparent">Create Workout Plan</h1>
        <p className="text-gray-500 mt-1">Design your professional training program</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300"
          onClick={onOpenTips}
        >
          <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
          Training Tips
        </Button>
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
  );
};

export default WorkoutFormHeader;
