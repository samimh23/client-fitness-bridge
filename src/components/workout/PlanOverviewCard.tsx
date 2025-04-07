
import React from 'react';
import { Calendar, Users, Clock, Dumbbell } from 'lucide-react';
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
    <Card className="bg-white border-primary/10 shadow-sm">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          Plan Overview
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
            <p className="font-medium">{totalExercises}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Weekly Frequency</p>
            </div>
            <p className="font-medium">{weeklyFrequency} days per week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanOverviewCard;
