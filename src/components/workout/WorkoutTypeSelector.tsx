
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Dumbbell, Heart, LayoutPanelLeft, Flame, BarChart2 } from 'lucide-react';

// Define workout plan types
export const WORKOUT_PLAN_TYPES = [
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

interface WorkoutTypeSelectorProps {
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

const WorkoutTypeSelector = ({ selectedType, onTypeChange }: WorkoutTypeSelectorProps) => {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Workout Type</CardTitle>
        <CardDescription>Select the primary focus of this workout plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {WORKOUT_PLAN_TYPES.map((type) => {
            const IconComponent = type.icon;
            return (
              <div 
                key={type.id}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105
                  ${selectedType === type.id 
                    ? `${type.color} border-primary bg-gradient-to-br ${type.gradient} shadow-md` 
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                onClick={() => onTypeChange(type.id)}
              >
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-3 ${selectedType === type.id ? type.iconBg + ' text-white' : 'bg-gray-100 ' + type.accent}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className={`text-sm font-semibold mb-1 ${selectedType === type.id ? 'text-gray-800' : type.accent}`}>
                  {type.name}
                </span>
                <span className="text-xs text-gray-500">
                  {type.description}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTypeSelector;
