import React from 'react';
import { Activity, Dumbbell, Heart, LayoutPanelLeft, Flame, BarChart2 } from 'lucide-react';

export const WORKOUT_PLAN_TYPES = [
  { id: 'strength', name: 'Strength Training', icon: Dumbbell, description: 'Build muscle & power' },
  { id: 'cardio', name: 'Cardio', icon: Heart, description: 'Improve endurance' },
  { id: 'flexibility', name: 'Flexibility', icon: Activity, description: 'Increase range of motion' },
  { id: 'hybrid', name: 'Hybrid', icon: LayoutPanelLeft, description: 'Balanced approach' },
  { id: 'hiit', name: 'HIIT', icon: Flame, description: 'High intensity intervals' },
  { id: 'powerlifting', name: 'Powerlifting', icon: BarChart2, description: 'Focus on major lifts' },
];

interface WorkoutTypeSelectorProps {
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

const WorkoutTypeSelector = ({ selectedType, onTypeChange }: WorkoutTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Workout Type</h3>
        <p className="text-sm text-muted-foreground">Select the primary focus of this workout plan</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {WORKOUT_PLAN_TYPES.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              type="button"
              className={`
                group relative flex flex-col items-center justify-center p-2 rounded-lg border-2 
                transition-all duration-200 hover:scale-[1.03] cursor-pointer
                bg-card
                ${isSelected 
                  ? 'border-primary shadow-lg shadow-primary/10' 
                  : 'border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5'
                }
              `}
            >
              <div className={`
                rounded-full w-10 h-10 flex items-center justify-center mb-2 flex-shrink-0
                transition-all duration-200
                ${isSelected 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }
              `}>
                <IconComponent className="h-6 w-6" />
              </div>
              <span className={`
                text-xs font-semibold leading-tight w-full
                transition-colors duration-200 text-center
                ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}
              `}>
                {type.name}
              </span>
              <span className={`
                text-[10px] leading-tight w-full
                transition-colors duration-200 text-center
                ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}
              `}>
                {type.description}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutTypeSelector;