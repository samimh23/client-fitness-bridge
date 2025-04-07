
import React from 'react';
import { Calendar, Users, Clock, Dumbbell, Target, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlanOverviewCardProps {
  createdAt: Date;
  updatedAt: Date;
  totalExercises: number;
  weeklyFrequency: number;
  className?: string;
}

const PlanOverviewCard = ({ 
  createdAt, 
  updatedAt, 
  totalExercises, 
  weeklyFrequency,
  className 
}: PlanOverviewCardProps) => {
  const isHighFrequency = weeklyFrequency > 4;
  const frequencyColor = isHighFrequency ? 'text-amber-500' : 'text-emerald-500';
  const exerciseCountColor = totalExercises > 15 ? 'text-amber-500' : totalExercises > 0 ? 'text-emerald-500' : 'text-gray-500';
  
  return (
    <Card className={cn("bg-white border-primary/10 shadow-md hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <Target className="mr-2 h-5 w-5 text-primary" />
          Plan Overview
          <Badge variant="outline" className="ml-auto font-normal text-xs">Preview</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Created</p>
            </div>
            <p className="font-medium">{createdAt.toLocaleDateString()}</p>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Last Updated</p>
            </div>
            <p className="font-medium">{updatedAt.toLocaleDateString()}</p>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div className="flex items-center">
              <Dumbbell className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Total Exercises</p>
            </div>
            <div className="flex items-center gap-1">
              <p className={cn("font-medium", exerciseCountColor)}>{totalExercises}</p>
              {totalExercises === 0 && <span className="text-xs text-gray-400">(add exercises)</span>}
              {totalExercises > 0 && totalExercises < 5 && <ChevronDown className="h-3 w-3 text-red-500" />}
              {totalExercises >= 5 && totalExercises <= 15 && <ChevronUp className="h-3 w-3 text-emerald-500" />}
              {totalExercises > 15 && <ChevronUp className="h-3 w-3 text-amber-500" />}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Weekly Frequency</p>
            </div>
            <div className="flex items-center gap-1">
              <p className={cn("font-medium", frequencyColor)}>
                {weeklyFrequency} <span className="text-gray-700">days/week</span>
              </p>
              {weeklyFrequency > 4 && <ChevronUp className="h-3 w-3 text-amber-500" />}
              {weeklyFrequency <= 4 && weeklyFrequency > 0 && <ChevronUp className="h-3 w-3 text-emerald-500" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanOverviewCard;
