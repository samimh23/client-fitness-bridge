
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { Food } from '@/lib/types';

interface FoodFormProps {
  food: Partial<Food>;
  foodIndex: number;
  mealIndex: number;
  onFoodChange: (mealIndex: number, foodIndex: number, field: keyof Food, value: any) => void;
  onFoodRemove: (mealIndex: number, foodIndex: number) => void;
}

const FoodForm = ({ food, foodIndex, mealIndex, onFoodChange, onFoodRemove }: FoodFormProps) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Food Name</Label>
          <Input
            placeholder="e.g., Chicken Breast"
            value={food.name || ''}
            onChange={(e) => onFoodChange(mealIndex, foodIndex, 'name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            placeholder="e.g., 100g, 1 cup"
            value={food.amount || ''}
            onChange={(e) => onFoodChange(mealIndex, foodIndex, 'amount', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Calories</Label>
          <Input
            type="number"
            min={0}
            value={food.calories || 0}
            onChange={(e) => onFoodChange(mealIndex, foodIndex, 'calories', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Protein (g)</Label>
          <Input
            type="number"
            min={0}
            value={food.protein || 0}
            onChange={(e) => onFoodChange(mealIndex, foodIndex, 'protein', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Carbs (g)</Label>
          <Input
            type="number"
            min={0}
            value={food.carbs || 0}
            onChange={(e) => onFoodChange(mealIndex, foodIndex, 'carbs', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Fat (g)</Label>
          <Input
            type="number"
            min={0}
            value={food.fat || 0}
            onChange={(e) => onFoodChange(mealIndex, foodIndex, 'fat', e.target.value)}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0"
        onClick={() => onFoodRemove(mealIndex, foodIndex)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};

export default FoodForm;
