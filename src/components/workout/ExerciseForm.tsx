import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dumbbell, 
  Trash2, 
  Clock, 
  Target, 
  Weight, 
  Info,
  GripVertical,
  Play,
  Pause
} from 'lucide-react';
import { Exercise } from '@/lib/types';

interface ExerciseFormProps {
  exercise: Partial<Exercise>;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Exercise, value: any) => void;
  onOpenLibrary: (index: number) => void;
}

const ExerciseForm = ({ exercise, index, onRemove, onChange, onOpenLibrary }: ExerciseFormProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleQuickSetRep = (sets: number, reps: number) => {
    onChange(index, 'sets', sets);
    onChange(index, 'reps', reps);
  };

  const handleQuickRest = (restTime: number) => {
    onChange(index, 'restPeriod', restTime);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">
                Exercise {index + 1}
              </CardTitle>
              {exercise.name && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Play className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenLibrary(index)}
              className="h-8 px-3 text-xs"
            >
              <Dumbbell className="h-3 w-3 mr-1" /> 
              Library
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {/* Exercise Name */}
          <div className="space-y-2">
            <Label htmlFor={`exercise-${index}-name`} className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Exercise Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`exercise-${index}-name`}
              placeholder="e.g., Bench Press, Squat, Deadlift"
              value={exercise.name || ''}
              onChange={(e) => onChange(index, 'name', e.target.value)}
              className="h-10"
              required
            />
          </div>

          <Separator />

          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSetRep(3, 10)}
                className="text-xs h-8 px-3"
              >
                3×10 Strength
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSetRep(4, 8)}
                className="text-xs h-8 px-3"
              >
                4×8 Hypertrophy
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSetRep(5, 5)}
                className="text-xs h-8 px-3"
              >
                5×5 Power
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSetRep(3, 15)}
                className="text-xs h-8 px-3"
              >
                3×15 Endurance
              </Button>
            </div>
          </div>

          <Separator />

          {/* Main Exercise Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`exercise-${index}-sets`} className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Sets <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`exercise-${index}-sets`}
                type="number"
                min={1}
                max={20}
                value={exercise.sets || ''}
                onChange={(e) => onChange(index, 'sets', parseInt(e.target.value) || 0)}
                className="h-10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`exercise-${index}-reps`} className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Reps <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`exercise-${index}-reps`}
                type="number"
                min={1}
                max={100}
                value={exercise.reps || ''}
                onChange={(e) => onChange(index, 'reps', parseInt(e.target.value) || 0)}
                className="h-10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`exercise-${index}-restTime`} className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Rest (seconds)
              </Label>
              <div className="relative">
                <Input
                  id={`exercise-${index}-restTime`}
                  type="number"
                  min={0}
                  max={600}
                  value={exercise.restPeriod || ''}
                  onChange={(e) => onChange(index, 'restPeriod', parseInt(e.target.value) || 0)}
                  className="h-10 pr-12"
                  placeholder="60"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  sec
                </span>
              </div>
            </div>
          </div>

          {/* Quick Rest Times */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Quick Rest Times</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickRest(30)}
                className="text-xs h-8 px-3"
              >
                30s Quick
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickRest(60)}
                className="text-xs h-8 px-3"
              >
                1min Standard
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickRest(90)}
                className="text-xs h-8 px-3"
              >
                1.5min Long
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickRest(120)}
                className="text-xs h-8 px-3"
              >
                2min Heavy
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickRest(180)}
                className="text-xs h-8 px-3"
              >
                3min Power
              </Button>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`exercise-${index}-weight`} className="text-sm font-medium flex items-center gap-2">
                <Weight className="h-4 w-4 text-purple-500" />
                Weight (optional)
              </Label>
              <Input
                id={`exercise-${index}-weight`}
                placeholder="e.g., 50kg, 135lbs, bodyweight"
                value={exercise.weight || ''}
                onChange={(e) => onChange(index, 'weight', e.target.value)}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`exercise-${index}-duration`} className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500" />
                Duration (minutes)
              </Label>
              <Input
                id={`exercise-${index}-duration`}
                type="number"
                min={1}
                max={120}
                value={exercise.duration || ''}
                onChange={(e) => onChange(index, 'duration', parseInt(e.target.value) || 0)}
                className="h-10"
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`exercise-${index}-instructions`} className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-cyan-500" />
              Instructions (optional)
            </Label>
            <Input
              id={`exercise-${index}-instructions`}
              placeholder="Brief instructions or notes for this exercise"
              value={exercise.instructions || ''}
              onChange={(e) => onChange(index, 'instructions', e.target.value)}
              className="h-10"
            />
          </div>

          {/* Exercise Summary */}
          {exercise.name && exercise.sets && exercise.reps && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Exercise Ready</span>
                </div>
                <div className="text-sm text-green-700">
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.restPeriod && ` • ${exercise.restPeriod}s rest`}
                  {exercise.weight && ` • ${exercise.weight}`}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ExerciseForm;
