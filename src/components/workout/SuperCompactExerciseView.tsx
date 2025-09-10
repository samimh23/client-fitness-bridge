import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dumbbell, 
  Trash2, 
  Edit, 
  Target, 
  Clock, 
  Weight,
  GripVertical,
  Plus,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Exercise } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SuperCompactExerciseViewProps {
  exercises: Partial<Exercise>[];
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Exercise, value: any) => void;
  onOpenLibrary: (index: number) => void;
  onEdit: (index: number) => void;
  onAddExercise: () => void;
  day: number;
}

const SuperCompactExerciseView = ({ 
  exercises, 
  onRemove, 
  onChange, 
  onOpenLibrary,
  onEdit,
  onAddExercise,
  day
}: SuperCompactExerciseViewProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [quickEditValues, setQuickEditValues] = useState<{[key: number]: {sets: string, reps: string, rest: string}}>({});

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    // Note: In a real implementation, you'd handle reordering here
    setDraggedIndex(null);
  };

  const getExerciseStatus = (exercise: Partial<Exercise>) => {
    if (!exercise.name) return 'empty';
    if (!exercise.sets || !exercise.reps) return 'incomplete';
    return 'complete';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'incomplete':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const startQuickEdit = (index: number) => {
    setEditingIndex(index);
    setQuickEditValues({
      ...quickEditValues,
      [index]: {
        sets: (exercises[index].sets || '').toString(),
        reps: (exercises[index].reps || '').toString(),
        rest: (exercises[index].restTime || '').toString()
      }
    });
  };

  const saveQuickEdit = (index: number) => {
    const values = quickEditValues[index];
    if (values) {
      onChange(index, 'sets', parseInt(values.sets) || 0);
      onChange(index, 'reps', parseInt(values.reps) || 0);
      onChange(index, 'restTime', parseInt(values.rest) || 0);
    }
    setEditingIndex(null);
  };

  const cancelQuickEdit = () => {
    setEditingIndex(null);
  };

  const handleQuickEditChange = (index: number, field: 'sets' | 'reps' | 'rest', value: string) => {
    setQuickEditValues({
      ...quickEditValues,
      [index]: {
        ...quickEditValues[index],
        [field]: value
      }
    });
  };

  // Calculate stats
  const totalExercises = exercises.length;
  const completeExercises = exercises.filter(ex => getExerciseStatus(ex) === 'complete').length;
  const completionPercentage = totalExercises > 0 ? Math.round((completeExercises / totalExercises) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header with Stats - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text">{day}</div>
            <div className="text-xs text-muted-foreground">Day</div>
          </div>
          <div className="h-8 w-px bg-border sm:block hidden" />
          <div className="grid grid-cols-3 gap-3 flex-1">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{completeExercises}</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">{totalExercises - completeExercises}</div>
              <div className="text-xs text-muted-foreground">Incomplete</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{completionPercentage}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={onAddExercise}
          size="sm"
          className="h-8 px-3 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Exercise
        </Button>
      </div>

      {/* Compact Exercise Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
        {exercises.map((exercise, index) => {
          const status = getExerciseStatus(exercise);
          const isEditing = editingIndex === index;
          
          return (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              className={`group relative p-3 rounded-lg border-2 transition-all duration-200 cursor-move ${
                draggedIndex === index 
                  ? 'border-primary/50 bg-primary/5 scale-[1.02] shadow-lg' 
                  : status === 'complete' 
                    ? 'border-green-200 bg-green-50/50 hover:border-green-300 hover:bg-green-100/50'
                    : status === 'incomplete'
                    ? 'border-yellow-200 bg-yellow-50/50 hover:border-yellow-300 hover:bg-yellow-100/50'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100/50'
              }`}
            >
              {/* Drag Handle - Hidden on mobile */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
              </div>

              {/* Status Icon */}
              <div className="absolute top-2 right-2">
                {getStatusIcon(status)}
              </div>

              {/* Exercise Content */}
              <div className="space-y-2 pt-1">
                {/* Exercise Name */}
                {isEditing ? (
                  <Input
                    value={exercise.name || ''}
                    onChange={(e) => onChange(index, 'name', e.target.value)}
                    placeholder="Exercise name"
                    className="h-7 text-xs"
                    autoFocus
                  />
                ) : (
                  <div className="pr-6">
                    <div className={`text-sm font-medium truncate ${
                      exercise.name ? 'text-foreground' : 'text-muted-foreground italic'
                    }`}>
                      {exercise.name || `Exercise ${index + 1}`}
                    </div>
                    {exercise.weight && (
                      <div className="text-xs text-muted-foreground">{exercise.weight}</div>
                    )}
                  </div>
                )}

                {/* Quick Edit Mode */}
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="relative">
                        <Input
                          value={quickEditValues[index]?.sets || ''}
                          onChange={(e) => handleQuickEditChange(index, 'sets', e.target.value)}
                          placeholder="Sets"
                          className="h-6 text-xs pr-8"
                        />
                        <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">s</span>
                      </div>
                      <div className="relative">
                        <Input
                          value={quickEditValues[index]?.reps || ''}
                          onChange={(e) => handleQuickEditChange(index, 'reps', e.target.value)}
                          placeholder="Reps"
                          className="h-6 text-xs pr-8"
                        />
                        <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">r</span>
                      </div>
                      <div className="relative">
                        <Input
                          value={quickEditValues[index]?.rest || ''}
                          onChange={(e) => handleQuickEditChange(index, 'rest', e.target.value)}
                          placeholder="Rest"
                          className="h-6 text-xs pr-10"
                        />
                        <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">sec</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveQuickEdit(index)}
                        className="flex-1 h-6 text-xs bg-green-500 hover:bg-green-600"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={cancelQuickEdit}
                        variant="ghost"
                        className="flex-1 h-6 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{exercise.sets || '-'}</div>
                      <div className="text-muted-foreground">sets</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{exercise.reps || '-'}</div>
                      <div className="text-muted-foreground">reps</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">{exercise.restTime ? `${exercise.restTime}s` : '-'}</div>
                      <div className="text-muted-foreground">rest</div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Responsive */}
                <div className="flex items-center justify-between pt-1">
                  {isEditing ? (
                    <div className="flex gap-1 w-full">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveQuickEdit(index)}
                        className="flex-1 h-5 px-2 text-xs bg-green-500 hover:bg-green-600"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={cancelQuickEdit}
                        variant="ghost"
                        className="flex-1 h-5 px-2 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => startQuickEdit(index)}
                        variant="ghost"
                        className="h-5 px-2 text-xs hover:bg-primary/10"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => onOpenLibrary(index)}>
                            <Dumbbell className="h-3 w-3 mr-2" />
                            Library
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(index)}>
                            <Edit className="h-3 w-3 mr-2" />
                            Full Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onRemove(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {exercises.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Dumbbell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-sm">No exercises yet. Click "Add Exercise" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default SuperCompactExerciseView;