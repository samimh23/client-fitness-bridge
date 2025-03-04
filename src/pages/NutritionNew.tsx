
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Food, Meal } from '@/lib/types';

const NutritionNew = () => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    duration: 4
  });
  
  const [meals, setMeals] = useState<Partial<Meal>[]>([
    { 
      name: 'Breakfast', 
      time: '08:00', 
      day: 1,
      foods: [{ id: `temp-${Date.now()}-0`, name: '', amount: '', calories: 0, protein: 0, carbs: 0, fat: 0 }] 
    }
  ]);

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  const handleMealChange = (mealIndex: number, field: string, value: any) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      [field]: field === 'day' ? parseInt(value) || 0 : value
    };
    setMeals(updatedMeals);
  };

  const handleFoodChange = (mealIndex: number, foodIndex: number, field: keyof Food, value: any) => {
    const updatedMeals = [...meals];
    const foods = [...(updatedMeals[mealIndex].foods || [])];
    
    foods[foodIndex] = {
      ...foods[foodIndex],
      [field]: ['calories', 'protein', 'carbs', 'fat'].includes(field)
        ? parseFloat(value) || 0
        : value
    };
    
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      foods
    };
    
    setMeals(updatedMeals);
  };

  const addMeal = () => {
    setMeals([
      ...meals,
      { 
        name: 'Meal', 
        time: '12:00', 
        day: 1,
        foods: [{ id: `temp-${Date.now()}-${meals.length}`, name: '', amount: '', calories: 0, protein: 0, carbs: 0, fat: 0 }] 
      }
    ]);
  };

  const removeMeal = (index: number) => {
    if (meals.length === 1) {
      toast.error("You need at least one meal");
      return;
    }
    
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
  };

  const addFood = (mealIndex: number) => {
    const updatedMeals = [...meals];
    const currentFoods = updatedMeals[mealIndex].foods || [];
    
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      foods: [
        ...currentFoods,
        { 
          id: `temp-${Date.now()}-${mealIndex}-${currentFoods.length}`,
          name: '', 
          amount: '', 
          calories: 0, 
          protein: 0, 
          carbs: 0, 
          fat: 0 
        }
      ]
    };
    
    setMeals(updatedMeals);
  };

  const removeFood = (mealIndex: number, foodIndex: number) => {
    const updatedMeals = [...meals];
    const foods = updatedMeals[mealIndex].foods || [];
    
    if (foods.length === 1) {
      toast.error("Each meal needs at least one food item");
      return;
    }
    
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      foods: foods.filter((_, i) => i !== foodIndex)
    };
    
    setMeals(updatedMeals);
  };

  const calculateTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    meals.forEach(meal => {
      (meal.foods || []).forEach(food => {
        totalCalories += food.calories || 0;
        totalProtein += food.protein || 0;
        totalCarbs += food.carbs || 0;
        totalFat += food.fat || 0;
      });
    });
    
    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!planData.name.trim()) {
      toast.error('Please enter a plan name');
      return;
    }
    
    const incompleteMeals = meals.some(meal => 
      !meal.name || !meal.time || 
      (meal.foods || []).some(food => !food.name)
    );
    
    if (incompleteMeals) {
      toast.error('Please complete all meal and food information');
      return;
    }
    
    // In a real application, we would save the nutrition plan to a database
    const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals();
    const newNutritionPlan = {
      id: `nutrition-${Date.now()}`,
      name: planData.name,
      description: planData.description,
      duration: planData.duration,
      meals: meals.map((meal, mealIndex) => ({
        ...meal,
        id: `meal-${Date.now()}-${mealIndex}`,
        foods: (meal.foods || []).map((food, foodIndex) => ({
          ...food,
          id: `food-${Date.now()}-${mealIndex}-${foodIndex}`
        }))
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedToClientIds: [],
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    };
    
    // Simulate adding to the database
    console.log('New nutrition plan created:', newNutritionPlan);
    
    toast.success('Nutrition plan created successfully!');
    navigate('/nutrition');
  };

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals();

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
            <h1 className="text-3xl font-bold">Create Nutrition Plan</h1>
            <p className="text-gray-500 mt-1">Design a new meal plan</p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Weight Loss Meal Plan"
                      value={planData.name}
                      onChange={handlePlanChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the goals and focus of this nutrition plan"
                      rows={3}
                      value={planData.description}
                      onChange={handlePlanChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (weeks)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min={1}
                      max={52}
                      value={planData.duration}
                      onChange={handlePlanChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-8 p-4 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Nutrition Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Calories</div>
                  <div className="text-xl font-bold">{totalCalories}</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Protein</div>
                  <div className="text-xl font-bold">{totalProtein}g</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Carbs</div>
                  <div className="text-xl font-bold">{totalCarbs}g</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-sm text-gray-500">Fat</div>
                  <div className="text-xl font-bold">{totalFat}g</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meals</h2>
              <Button type="button" onClick={addMeal} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Meal
              </Button>
            </div>
            
            {meals.map((meal, mealIndex) => (
              <Card key={mealIndex} className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Meal Name"
                      value={meal.name}
                      onChange={(e) => handleMealChange(mealIndex, 'name', e.target.value)}
                      className="font-semibold text-lg border-none focus-visible:ring-0 p-0 h-auto"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeal(mealIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={meal.time}
                        onChange={(e) => handleMealChange(mealIndex, 'time', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Input
                        type="number"
                        min={1}
                        max={7}
                        value={meal.day}
                        onChange={(e) => handleMealChange(mealIndex, 'day', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Food Items</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addFood(mealIndex)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Food
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {(meal.foods || []).map((food, foodIndex) => (
                        <div key={foodIndex} className="relative">
                          {foodIndex > 0 && <Separator className="my-4" />}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Food Name</Label>
                              <Input
                                placeholder="e.g., Chicken Breast"
                                value={food.name}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Amount</Label>
                              <Input
                                placeholder="e.g., 100g, 1 cup"
                                value={food.amount}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'amount', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Calories</Label>
                              <Input
                                type="number"
                                min={0}
                                value={food.calories}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'calories', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Protein (g)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={food.protein}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'protein', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Carbs (g)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={food.carbs}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'carbs', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Fat (g)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={food.fat}
                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, 'fat', e.target.value)}
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0"
                            onClick={() => removeFood(mealIndex, foodIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate('/nutrition')}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Nutrition Plan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default NutritionNew;
