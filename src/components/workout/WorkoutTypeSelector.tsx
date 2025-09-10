import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Dumbbell, Heart, LayoutPanelLeft, Flame, BarChart2 } from 'lucide-react';

// Define workout plan types
export const WORKOUT_PLAN_TYPES = [
  { 
    id: 'strength', 
    name: 'Strength Training', 
    icon: Dumbbell,
    description: 'Build muscle & power'
  },
  { 
    id: 'cardio', 
    name: 'Cardio', 
    icon: Heart,
    description: 'Improve endurance'
  },
  { 
    id: 'flexibility', 
    name: 'Flexibility', 
    icon: Activity,
    description: 'Increase range of motion'
  },
  { 
    id: 'hybrid', 
    name: 'Hybrid', 
    icon: LayoutPanelLeft,
    description: 'Balanced approach'
  },
  { 
    id: 'hiit', 
    name: 'HIIT', 
    icon: Flame,
    description: 'High intensity intervals'
  },
  { 
    id: 'powerlifting', 
    name: 'Powerlifting', 
    icon: BarChart2,
    description: 'Focus on major lifts'
  },
];

interface WorkoutTypeSelectorProps {
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

const WorkoutTypeSelector = ({ selectedType, onTypeChange }: WorkoutTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Workout Type</h3>
        <p className="text-sm text-muted-foreground">Select the primary focus of this workout plan</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {WORKOUT_PLAN_TYPES.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 
                transition-all duration-200 hover:scale-105 cursor-pointer
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                rounded-full w-12 h-12 flex items-center justify-center mb-3
                ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                <IconComponent className="h-6 w-6" />
              </div>
              <span className={`
                text-sm font-medium text-center mb-1
                ${isSelected ? 'text-primary' : 'text-gray-700'}
              `}>
                {type.name}
              </span>
              <span className="text-xs text-gray-500 text-center">
                {type.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutTypeSelector;
