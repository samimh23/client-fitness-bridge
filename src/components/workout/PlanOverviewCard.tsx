
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlanOverviewCardProps {
  createdAt: Date;
  updatedAt: Date;
  totalExercises: number;
  weeklyFrequency: number;
}

const PlanOverviewCard = ({ 
  createdAt, 
  updatedAt, 
  totalExercises, 
  weeklyFrequency 
}: PlanOverviewCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          Plan Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p>{createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p>{updatedAt.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Exercises</p>
            <p>{totalExercises}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weekly Frequency</p>
            <p>{weeklyFrequency} days per week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanOverviewCard;
