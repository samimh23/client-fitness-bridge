
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
    <Card className="card-enhanced">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Plan Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {name || "Untitled Plan"}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedPlanType.name || "Custom"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {duration} weeks
          </Badge>
          <Badge variant="outline" className="text-xs">
            {exerciseCount} exercises
          </Badge>
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frequency</span>
            <span className="font-medium">{weeklyFrequency}x / week</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={exerciseCount > 0 ? "default" : "secondary"} className="text-xs">
              {exerciseCount > 0 ? "In Progress" : "Empty"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSummaryCard;
