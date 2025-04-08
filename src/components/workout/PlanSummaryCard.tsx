
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Award, CalendarDays, Clock } from 'lucide-react';
import { WORKOUT_PLAN_TYPES } from './WorkoutTypeSelector';

interface PlanSummaryCardProps {
  name: string;
  description: string;
  type: string;
  duration: number;
  exerciseCount: number;
  weeklyFrequency: number;
}

const PlanSummaryCard = ({ 
  name, 
  description, 
  type, 
  duration, 
  exerciseCount, 
  weeklyFrequency 
}: PlanSummaryCardProps) => {
  const selectedPlanType = WORKOUT_PLAN_TYPES.find(t => t.id === type) || WORKOUT_PLAN_TYPES[0];
  
  return (
    <Card className={`border-${selectedPlanType.accent?.split('-')[1]}-300 shadow-md mb-5 hover:shadow-xl transition-all duration-300 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-white via-${selectedPlanType.accent?.split('-')[1]}-50 to-${selectedPlanType.accent?.split('-')[1]}-100 opacity-50`}></div>
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-lg flex items-center">
          <span className={selectedPlanType.accent}>Plan Summary</span>
          <Sparkles className={`h-4 w-4 ${selectedPlanType.accent} ml-2`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 relative">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-xl text-gray-800 flex items-center">
              {name || "Untitled Plan"}
              {name && <Award className={`h-4 w-4 ${selectedPlanType.accent} ml-2`} />}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{description || "No description provided"}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className={`
                ${selectedPlanType.color}
                border-opacity-50 hover:bg-opacity-20 transition-colors
              `}
            >
              {selectedPlanType.name || "Custom"}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {duration} weeks
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {exerciseCount} exercises
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
            <div className="text-center p-2 rounded-lg bg-gray-50/80 hover:bg-gray-50 transition-colors backdrop-blur-sm">
              <p className="text-xs text-gray-500">FREQUENCY</p>
              <p className="text-lg font-semibold">{weeklyFrequency}x / week</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50/80 hover:bg-gray-50 transition-colors backdrop-blur-sm">
              <p className="text-xs text-gray-500">INTENSITY</p>
              <div className="flex justify-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Zap 
                    key={i} 
                    className={`h-4 w-4 transition-all ${i <= Math.min(Math.ceil(exerciseCount / 3), 5) ? selectedPlanType.accent + ' animate-pulse' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSummaryCard;
