
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Food, Meal } from '@/lib/types';
import PlanDetailsForm from '@/components/nutrition/PlanDetailsForm';
import NutritionSummary from '@/components/nutrition/NutritionSummary';
import MealForm from '@/components/nutrition/MealForm';

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
            <PlanDetailsForm
              name={planData.name}
              description={planData.description}
              duration={planData.duration}
              onChange={handlePlanChange}
            />
            
            <NutritionSummary
              calories={totalCalories}
              protein={totalProtein}
              carbs={totalCarbs}
              fat={totalFat}
            />
            
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meals</h2>
              <Button type="button" onClick={addMeal} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Meal
              </Button>
            </div>
            
            {meals.map((meal, mealIndex) => (
              <MealForm
                key={mealIndex}
                meal={meal}
                mealIndex={mealIndex}
                onMealChange={handleMealChange}
                onMealRemove={removeMeal}
                onFoodAdd={addFood}
                onFoodChange={handleFoodChange}
                onFoodRemove={removeFood}
              />
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
