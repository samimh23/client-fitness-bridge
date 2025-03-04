
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import FoodForm from './FoodForm';
import { Food, Meal } from '@/lib/types';

interface MealFormProps {
  meal: Partial<Meal>;
  mealIndex: number;
  onMealChange: (mealIndex: number, field: string, value: any) => void;
  onMealRemove: (mealIndex: number) => void;
  onFoodAdd: (mealIndex: number) => void;
  onFoodChange: (mealIndex: number, foodIndex: number, field: keyof Food, value: any) => void;
  onFoodRemove: (mealIndex: number, foodIndex: number) => void;
}

const MealForm = ({
  meal,
  mealIndex,
  onMealChange,
  onMealRemove,
  onFoodAdd,
  onFoodChange,
  onFoodRemove
}: MealFormProps) => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex-1">
          <Input
            placeholder="Meal Name"
            value={meal.name || ''}
            onChange={(e) => onMealChange(mealIndex, 'name', e.target.value)}
            className="font-semibold text-lg border-none focus-visible:ring-0 p-0 h-auto"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onMealRemove(mealIndex)}
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
              value={meal.time || ''}
              onChange={(e) => onMealChange(mealIndex, 'time', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Day</Label>
            <Input
              type="number"
              min={1}
              max={7}
              value={meal.day || 1}
              onChange={(e) => onMealChange(mealIndex, 'day', e.target.value)}
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
              onClick={() => onFoodAdd(mealIndex)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Food
            </Button>
          </div>
          
          <div className="space-y-6">
            {(meal.foods || []).map((food, foodIndex) => (
              <React.Fragment key={food.id}>
                {foodIndex > 0 && <Separator className="my-4" />}
                <FoodForm
                  food={food}
                  foodIndex={foodIndex}
                  mealIndex={mealIndex}
                  onFoodChange={onFoodChange}
                  onFoodRemove={onFoodRemove}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealForm;
