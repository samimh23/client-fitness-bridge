
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
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  duration: number; // in weeks
  createdAt: Date;
  updatedAt: Date;
  assignedToClientIds: string[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: string;
  duration?: number; // in minutes
  restTime?: number; // in seconds
  instructions?: string;
  day: number; // day of the workout (1-7)
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
