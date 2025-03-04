
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExerciseWithVideo } from '@/lib/exerciseApi';
import ExerciseSearch from './ExerciseSearch';

interface ExerciseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseWithVideo) => void;
}

const ExerciseLibraryModal = ({ isOpen, onClose, onSelectExercise }: ExerciseLibraryModalProps) => {
  const handleSelectExercise = (exercise: ExerciseWithVideo) => {
    onSelectExercise(exercise);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Exercise Library</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ExerciseSearch onSelectExercise={handleSelectExercise} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseLibraryModal;
