
import React from 'react';

interface NutritionSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionSummary = ({ calories, protein, carbs, fat }: NutritionSummaryProps) => {
  return (
    <div className="mb-8 p-4 bg-primary/5 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Nutrition Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Calories</div>
          <div className="text-xl font-bold">{calories}</div>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Protein</div>
          <div className="text-xl font-bold">{protein}g</div>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Carbs</div>
          <div className="text-xl font-bold">{carbs}g</div>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="text-sm text-gray-500">Fat</div>
          <div className="text-xl font-bold">{fat}g</div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
