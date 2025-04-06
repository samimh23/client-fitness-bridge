
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Apple } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import { mockNutritionPlans } from '@/lib/data';
import { NutritionPlan } from '@/lib/types';

const NutritionPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundPlan = mockNutritionPlans.find(p => p.id === id);
    if (foundPlan) {
      setPlan(foundPlan);
    }
  }, [id]);

  if (!plan) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 text-center">
        <p>Nutrition plan not found</p>
        <Button 
          variant="link" 
          onClick={() => navigate('/nutrition')}
          className="mt-4"
        >
          Back to Nutrition Plans
        </Button>
      </div>
    );
  }
  
  // Group meals by day
  const mealsByDay: Record<number, typeof plan.meals> = {};
  plan.meals.forEach(meal => {
    if (!mealsByDay[meal.day]) {
      mealsByDay[meal.day] = [];
    }
    mealsByDay[meal.day].push(meal);
  });
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/nutrition')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{plan.name}</h1>
            <p className="text-gray-500 mt-1">{plan.description}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardTitle>Nutrition Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Calories</p>
                  <p className="text-xl font-bold">{plan.totalCalories} kcal</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Protein</p>
                  <p className="text-xl font-bold">{plan.totalProtein}g</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Carbs</p>
                  <p className="text-xl font-bold">{plan.totalCarbs}g</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Fat</p>
                  <p className="text-xl font-bold">{plan.totalFat}g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {Object.keys(mealsByDay).map((day) => (
            <div key={day}>
              <h2 className="text-xl font-semibold mb-4">Day {day}</h2>
              <div className="space-y-4">
                {mealsByDay[Number(day)].map((meal) => (
                  <Card key={meal.id} className="w-full">
                    <CardHeader className="bg-gray-50 border-b flex flex-row justify-between items-center">
                      <CardTitle className="text-lg">{meal.name}</CardTitle>
                      <span className="text-sm text-gray-500">{meal.time}</span>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Food</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Calories</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Protein</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Carbs</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase">Fat</th>
                            </tr>
                          </thead>
                          <tbody>
                            {meal.foods.map((food) => (
                              <tr key={food.id} className="border-b">
                                <td className="p-3 text-sm">{food.name}</td>
                                <td className="p-3 text-sm">{food.amount}</td>
                                <td className="p-3 text-sm">{food.calories} kcal</td>
                                <td className="p-3 text-sm">{food.protein}g</td>
                                <td className="p-3 text-sm">{food.carbs}g</td>
                                <td className="p-3 text-sm">{food.fat}g</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default NutritionPlanDetail;
