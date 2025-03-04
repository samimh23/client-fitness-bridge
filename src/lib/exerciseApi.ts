
import { Exercise } from './types';

export interface ExerciseWithVideo extends Omit<Exercise, 'id' | 'day'> {
  id: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscles: string[];
  description: string;
}

// Mock data for our exercise API
const exercisesData: ExerciseWithVideo[] = [
  {
    id: 'ex-001',
    name: 'Barbell Squat',
    sets: 4,
    reps: 8,
    weight: '135lbs',
    instructions: 'Keep your back straight, push through heels',
    category: 'Legs',
    videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8',
    thumbnail: 'https://img.youtube.com/vi/bEv6CCg2BC8/0.jpg',
    difficulty: 'intermediate',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    description: 'The barbell squat is a compound exercise that primarily targets the quadriceps, hamstrings, and glutes.'
  },
  {
    id: 'ex-002',
    name: 'Bench Press',
    sets: 3,
    reps: 10,
    weight: '95lbs',
    instructions: 'Maintain wrist alignment over elbows',
    category: 'Chest',
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    thumbnail: 'https://img.youtube.com/vi/rT7DgCr-3pg/0.jpg',
    difficulty: 'intermediate',
    muscles: ['Chest', 'Triceps', 'Shoulders'],
    description: 'The bench press is a compound exercise that primarily targets the chest, shoulders, and triceps.'
  },
  {
    id: 'ex-003',
    name: 'Deadlift',
    sets: 3,
    reps: 5,
    weight: '185lbs',
    instructions: 'Hinge at hips, keep back neutral',
    category: 'Back',
    videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
    thumbnail: 'https://img.youtube.com/vi/ytGaGIn3SjE/0.jpg',
    difficulty: 'advanced',
    muscles: ['Lower Back', 'Glutes', 'Hamstrings', 'Traps'],
    description: 'The deadlift is a compound exercise that engages multiple muscle groups including the back, glutes, and hamstrings.'
  },
  {
    id: 'ex-004',
    name: 'Pull-Up',
    sets: 3,
    reps: 8,
    instructions: 'Pull chin over bar, engage lats',
    category: 'Back',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    thumbnail: 'https://img.youtube.com/vi/eGo4IYlbE5g/0.jpg',
    difficulty: 'intermediate',
    muscles: ['Lats', 'Biceps', 'Upper Back'],
    description: 'The pull-up is a bodyweight exercise that targets the back, biceps, and shoulders.'
  },
  {
    id: 'ex-005',
    name: 'Push-Up',
    sets: 3,
    reps: 15,
    instructions: 'Maintain straight body line',
    category: 'Chest',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    thumbnail: 'https://img.youtube.com/vi/IODxDxX7oi4/0.jpg',
    difficulty: 'beginner',
    muscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    description: 'The push-up is a bodyweight exercise that primarily targets the chest, triceps, and shoulders.'
  },
  {
    id: 'ex-006',
    name: 'Lunges',
    sets: 3,
    reps: 12,
    instructions: 'Step forward, lower knee to ground',
    category: 'Legs',
    videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    thumbnail: 'https://img.youtube.com/vi/QOVaHwm-Q6U/0.jpg',
    difficulty: 'beginner',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    description: 'Lunges are a unilateral exercise that target the quadriceps, hamstrings, and glutes.'
  },
  {
    id: 'ex-007',
    name: 'Shoulder Press',
    sets: 3,
    reps: 10,
    weight: '45lbs',
    instructions: 'Press directly overhead, fully extend arms',
    category: 'Shoulders',
    videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
    thumbnail: 'https://img.youtube.com/vi/qEwKCR5JCog/0.jpg',
    difficulty: 'intermediate',
    muscles: ['Shoulders', 'Triceps'],
    description: 'The shoulder press targets the deltoid muscles and triceps for upper body strength.'
  },
  {
    id: 'ex-008',
    name: 'Planks',
    sets: 3,
    reps: 1,
    duration: 60,
    instructions: 'Maintain neutral spine, engage core',
    category: 'Core',
    videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
    thumbnail: 'https://img.youtube.com/vi/pSHjTRCQxIw/0.jpg',
    difficulty: 'beginner',
    muscles: ['Core', 'Shoulders', 'Lower Back'],
    description: 'The plank is an isometric core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time.'
  }
];

// API functions
export const fetchExercises = (): Promise<ExerciseWithVideo[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(exercisesData);
    }, 500);
  });
};

export const fetchExercisesByCategory = (category: string): Promise<ExerciseWithVideo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredExercises = exercisesData.filter(
        (exercise) => exercise.category.toLowerCase() === category.toLowerCase()
      );
      resolve(filteredExercises);
    }, 500);
  });
};

export const fetchExerciseById = (id: string): Promise<ExerciseWithVideo | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exercise = exercisesData.find((ex) => ex.id === id);
      resolve(exercise);
    }, 500);
  });
};

export const searchExercises = (query: string): Promise<ExerciseWithVideo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredExercises = exercisesData.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          exercise.category.toLowerCase().includes(query.toLowerCase()) ||
          exercise.description.toLowerCase().includes(query.toLowerCase()) ||
          exercise.muscles.some(muscle => muscle.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(filteredExercises);
    }, 500);
  });
};

export const getExerciseCategories = (): string[] => {
  const categories = new Set(exercisesData.map(exercise => exercise.category));
  return Array.from(categories);
};

