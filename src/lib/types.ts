
export interface Client {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: Date;
  workoutPlans: string[];
  nutritionPlans: string[];
  lastActive?: Date;
  goal?: string;
  notes?: string;
  progressData?: ClientProgress;
}

export interface ClientProgress {
  photos: ProgressPhoto[];
  measurements: BodyMeasurement[];
  workoutPerformance: WorkoutPerformanceEntry[];
  nutritionAdherence: NutritionAdherenceEntry[];
}

export interface ProgressPhoto {
  id: string;
  imageUrl: string;
  type: 'front' | 'side' | 'back';
  date: Date;
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    bicep?: number;
    thigh?: number;
    [key: string]: number | undefined;
  };
  notes?: string;
}

export interface WorkoutPerformanceEntry {
  id: string;
  date: Date;
  workoutPlanId: string;
  exerciseId: string;
  exerciseName: string;
  sets: {
    reps: number;
    weight?: number;
    duration?: number;
    restTime?: number;
  }[];
  notes?: string;
  fatigue?: number; // 1-10 scale
  difficulty?: number; // 1-10 scale
}

export interface NutritionAdherenceEntry {
  id: string;
  date: Date;
  nutritionPlanId: string;
  mealsCompleted: number;
  totalMeals: number;
  adherencePercentage: number;
  caloriesConsumed?: number;
  targetCalories?: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  planName: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  weekNumber: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  workoutDays: WorkoutDay[];
}

export interface WorkoutDay {
  dayNumber: number;
  title: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  order: number;
  restPeriod?: number;
  videoUrl?: string;
  weight?: string;
  duration?: number;
  instructions?: string;
}

export interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
  duration: number; // in weeks
  createdAt: Date;
  updatedAt: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  assignedToClientIds: string[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  day: number; // day of the week (1-7)
}

export interface Food {
  id: string;
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
