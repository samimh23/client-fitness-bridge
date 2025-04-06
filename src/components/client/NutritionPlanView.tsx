
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockNutritionPlans } from '@/lib/data';
import { Meal } from '@/lib/types';
import NutritionSummary from '../nutrition/NutritionSummary';

const NutritionPlanView = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  // Find the plan from mock data
  const plan = mockNutritionPlans.find(p => p.id === planId);
  
  if (!plan) {
    return (
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          Nutrition plan not found
        </div>
        <Button onClick={() => navigate('/client-app')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  // Group meals by day
  const mealsByDay: Record<number, Meal[]> = {};
  plan.meals.forEach(meal => {
    if (!mealsByDay[meal.day]) {
      mealsByDay[meal.day] = [];
    }
    mealsByDay[meal.day].push(meal);
  });
  
  // Sort meals within each day by time
  Object.keys(mealsByDay).forEach(day => {
    mealsByDay[Number(day)].sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
  });
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-20">
      <Button 
        variant="outline" 
        onClick={() => navigate('/client-app')}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <Apple className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{plan.name}</h1>
          <p className="text-gray-500">{plan.description}</p>
        </div>
      </div>
      
      <NutritionSummary 
        calories={plan.totalCalories}
        protein={plan.totalProtein}
        carbs={plan.totalCarbs}
        fat={plan.totalFat}
      />
      
      <div className="space-y-6">
        {Object.keys(mealsByDay).map((day) => (
          <Card key={day} className="w-full">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg">Day {day}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {mealsByDay[Number(day)].map((meal) => (
                <div key={meal.id} className="p-4 border-b last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{meal.name}</h3>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {meal.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {meal.foods.map((food) => (
                      <div key={food.id} className="flex justify-between bg-gray-50 p-2 rounded text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{food.name}</div>
                          <div className="text-gray-500">{food.amount}</div>
                        </div>
                        <div className="text-right text-gray-700">
                          <div>{food.calories} cal</div>
                          <div className="text-xs text-gray-500">
                            P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NutritionPlanView;
