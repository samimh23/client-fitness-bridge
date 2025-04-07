
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WorkoutPlanHeaderProps {
  planId: string;
  planName: string;
  planDescription: string;
  planDuration: number;
  onDeleteClick: () => void;
}

const WorkoutPlanHeader = ({ 
  planId, 
  planName, 
  planDescription, 
  planDuration,
  onDeleteClick 
}: WorkoutPlanHeaderProps) => {
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    navigate(`/workouts/edit/${planId}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/workouts')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold mr-3">{planName}</h1>
            <Badge variant="outline" className="ml-2">
              {planDuration} weeks
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">{planDescription}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleEditClick}>
          <PenLine className="mr-2 h-4 w-4" />
          Edit Plan
        </Button>
        <Button 
          variant="destructive" 
          onClick={onDeleteClick}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default WorkoutPlanHeader;
