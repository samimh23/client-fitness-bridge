
import { Client, WorkoutPlan, NutritionPlan, Exercise, Meal, Food } from './types';

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    joinedDate: new Date('2023-01-15'),
    workoutPlans: ['1'],
    nutritionPlans: ['1'],
    lastActive: new Date('2023-06-01'),
    goal: 'Lose 10kg and improve overall fitness',
    notes: 'Prefers morning workouts. Has shoulder injury to be mindful of.'
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    joinedDate: new Date('2023-02-20'),
    workoutPlans: ['2'],
    nutritionPlans: ['2'],
    lastActive: new Date('2023-05-28'),
    goal: 'Build muscle mass and improve strength',
    notes: 'Competitive athlete. Needs high-intensity program.'
  },
  {
    id: '3',
    name: 'Sophia Chen',
    email: 'sophia@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    joinedDate: new Date('2023-03-10'),
    workoutPlans: [],
    nutritionPlans: ['3'],
    lastActive: new Date('2023-05-30'),
    goal: 'Maintain weight and increase endurance',
    notes: 'Vegetarian. Prefers home workouts with minimal equipment.'
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael@example.com',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    joinedDate: new Date('2023-04-05'),
    workoutPlans: ['3'],
    nutritionPlans: [],
    lastActive: new Date('2023-06-02'),
    goal: 'Prepare for marathon',
    notes: 'Experienced runner. Focusing on endurance and recovery.'
  }
];

// Mock Workout Plans
export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Beginner Strength Training',
    description: 'A foundational strength program designed for beginners focusing on proper form and building baseline strength.',
    exercises: [
      {
        id: 'ex1',
        name: 'Squats',
        sets: 3,
        reps: 10,
        weight: 'bodyweight',
        instructions: 'Stand with feet shoulder-width apart, lower your body as if sitting back into a chair.',
        day: 1
      },
      {
        id: 'ex2',
        name: 'Push-ups',
        sets: 3,
        reps: 8,
        instructions: 'Start in plank position, lower chest to floor, push back up.',
        day: 1
      },
      {
        id: 'ex3',
        name: 'Walking Lunges',
        sets: 2,
        reps: 10,
        instructions: 'Step forward with one leg, lowering your hips until both knees are bent at 90 degrees.',
        day: 2
      },
      {
        id: 'ex4',
        name: 'Plank',
        sets: 3,
        reps: 1,
        duration: 30,
        instructions: 'Hold body in straight line from head to heels, engaging core.',
        day: 2
      }
    ],
    duration: 4,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
    assignedToClientIds: ['1']
  },
  {
    id: '2',
    name: 'Hypertrophy Program',
    description: 'Focused on building muscle mass through progressive overload and targeted muscle group training.',
    exercises: [
      {
        id: 'ex5',
        name: 'Barbell Bench Press',
        sets: 4,
        reps: 8,
        weight: '70% 1RM',
        restTime: 90,
        instructions: 'Lie on bench, grip barbell slightly wider than shoulders, lower to chest and press up.',
        day: 1
      },
      {
        id: 'ex6',
        name: 'Deadlift',
        sets: 3,
        reps: 6,
        weight: '75% 1RM',
        restTime: 120,
        instructions: 'Stand with feet hip-width apart, bend at hips and knees to grip bar, stand up straight.',
        day: 3
      }
    ],
    duration: 8,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
    assignedToClientIds: ['2']
  },
  {
    id: '3',
    name: 'Endurance Runner',
    description: 'Training program for distance runners focusing on building endurance and improving race times.',
    exercises: [
      {
        id: 'ex7',
        name: 'Tempo Run',
        sets: 1,
        reps: 1,
        duration: 40,
        instructions: 'Run at a comfortably hard pace (about 80% of max effort) for the full duration.',
        day: 2
      },
      {
        id: 'ex8',
        name: 'Interval Training',
        sets: 6,
        reps: 1,
        duration: 3,
        restTime: 90,
        instructions: 'Run at 90% effort for duration, then active recovery (walking or slow jog) during rest period.',
        day: 4
      },
      {
        id: 'ex9',
        name: 'Long Run',
        sets: 1,
        reps: 1,
        duration: 90,
        instructions: 'Run at a comfortable, conversational pace for the full duration.',
        day: 6
      }
    ],
    duration: 12,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-04-15'),
    assignedToClientIds: ['4']
  }
];

// Mock Nutrition Plans
export const mockNutritionPlans: NutritionPlan[] = [
  {
    id: '1',
    name: 'Weight Loss Nutrition',
    description: 'Balanced calorie-deficit plan designed for sustainable weight loss while maintaining energy levels.',
    meals: [
      {
        id: 'meal1',
        name: 'Breakfast',
        time: '7:00 AM',
        foods: [
          {
            id: 'food1',
            name: 'Greek Yogurt',
            amount: '200g',
            calories: 130,
            protein: 22,
            carbs: 6,
            fat: 0
          },
          {
            id: 'food2',
            name: 'Berries',
            amount: '100g',
            calories: 50,
            protein: 1,
            carbs: 12,
            fat: 0
          }
        ],
        day: 1
      },
      {
        id: 'meal2',
        name: 'Lunch',
        time: '12:30 PM',
        foods: [
          {
            id: 'food3',
            name: 'Grilled Chicken Salad',
            amount: '350g',
            calories: 320,
            protein: 35,
            carbs: 10,
            fat: 15
          }
        ],
        day: 1
      }
    ],
    duration: 6,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
    totalCalories: 1800,
    totalProtein: 120,
    totalCarbs: 150,
    totalFat: 60,
    assignedToClientIds: ['1']
  },
  {
    id: '2',
    name: 'Muscle Building Plan',
    description: 'High protein, calorie surplus plan designed to support muscle growth and recovery.',
    meals: [
      {
        id: 'meal3',
        name: 'Breakfast',
        time: '6:30 AM',
        foods: [
          {
            id: 'food4',
            name: 'Protein Oatmeal',
            amount: '300g',
            calories: 400,
            protein: 30,
            carbs: 50,
            fat: 10
          }
        ],
        day: 1
      },
      {
        id: 'meal4',
        name: 'Post-Workout',
        time: '10:00 AM',
        foods: [
          {
            id: 'food5',
            name: 'Protein Shake with Banana',
            amount: '1 serving',
            calories: 300,
            protein: 25,
            carbs: 30,
            fat: 5
          }
        ],
        day: 1
      }
    ],
    duration: 8,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
    totalCalories: 3000,
    totalProtein: 180,
    totalCarbs: 300,
    totalFat: 90,
    assignedToClientIds: ['2']
  },
  {
    id: '3',
    name: 'Vegetarian Maintenance',
    description: 'Plant-based nutrition plan designed to maintain weight and provide all necessary nutrients.',
    meals: [
      {
        id: 'meal5',
        name: 'Breakfast',
        time: '8:00 AM',
        foods: [
          {
            id: 'food6',
            name: 'Tofu Scramble with Vegetables',
            amount: '250g',
            calories: 280,
            protein: 20,
            carbs: 15,
            fat: 18
          }
        ],
        day: 1
      },
      {
        id: 'meal6',
        name: 'Dinner',
        time: '6:30 PM',
        foods: [
          {
            id: 'food7',
            name: 'Lentil and Vegetable Curry with Brown Rice',
            amount: '400g',
            calories: 450,
            protein: 22,
            carbs: 65,
            fat: 10
          }
        ],
        day: 1
      }
    ],
    duration: 4,
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15'),
    totalCalories: 2200,
    totalProtein: 110,
    totalCarbs: 280,
    totalFat: 70,
    assignedToClientIds: ['3']
  }
];
