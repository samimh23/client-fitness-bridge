
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

const activityMultipliers = {
  'sedentary': 1.2,      // Little or no exercise
  'light': 1.375,        // Light exercise 1-3 days per week
  'moderate': 1.55,      // Moderate exercise 3-5 days per week
  'active': 1.725,       // Heavy exercise 6-7 days per week
  'very-active': 1.9     // Very heavy exercise, physical job or training twice a day
};

type Goal = 'lose' | 'maintain' | 'gain';

const goalAdjustments = {
  'lose': -500,        // Calorie deficit for weight loss
  'maintain': 0,       // No adjustment for maintenance
  'gain': 500          // Calorie surplus for weight gain
};

const CalorieCalculator = () => {
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [result, setResult] = useState<{
    bmr: number,
    tdee: number,
    goalCalories: number,
    protein: number,
    carbs: number,
    fat: number
  } | null>(null);

  const calculateCalories = () => {
    // BMR calculation using the Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Total Daily Energy Expenditure
    const tdee = bmr * activityMultipliers[activityLevel];
    
    // Adjust based on goal
    const goalCalories = tdee + goalAdjustments[goal];
    
    // Calculate macronutrients (rough estimates)
    // Protein: 2g per kg for active individuals
    const protein = weight * 2;
    // Fat: 25% of calories, 1g = 9 calories
    const fat = (goalCalories * 0.25) / 9;
    // Remaining calories from carbs, 1g = 4 calories
    const carbs = (goalCalories - (protein * 4) - (fat * 9)) / 4;
    
    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calorie Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={gender}
                onValueChange={(value: 'male' | 'female') => setGender(value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={15}
                max={100}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={40}
                max={200}
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min={140}
                max={220}
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select
                value={activityLevel}
                onValueChange={(value: ActivityLevel) => setActivityLevel(value)}
              >
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light Activity (1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate Activity (3-5 days/week)</SelectItem>
                  <SelectItem value="active">Very Active (6-7 days/week)</SelectItem>
                  <SelectItem value="very-active">Extra Active (physical job or 2x training)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Select
                value={goal}
                onValueChange={(value: Goal) => setGoal(value)}
              >
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full" 
                onClick={calculateCalories}
              >
                Calculate
              </Button>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-background rounded shadow-sm">
                <p className="text-sm text-muted-foreground">Daily Calories</p>
                <p className="text-2xl font-bold">{result.goalCalories}</p>
                <p className="text-xs text-muted-foreground">calories/day</p>
              </div>
              <div className="p-3 bg-background rounded shadow-sm">
                <p className="text-sm text-muted-foreground">BMR</p>
                <p className="text-lg font-medium">{result.bmr}</p>
                <p className="text-xs text-muted-foreground">calories at rest</p>
              </div>
              <div className="p-3 bg-background rounded shadow-sm">
                <p className="text-sm text-muted-foreground">TDEE</p>
                <p className="text-lg font-medium">{result.tdee}</p>
                <p className="text-xs text-muted-foreground">calories with activity</p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Recommended Macros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-background rounded shadow-sm">
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-lg font-medium">{result.protein}g</p>
                <p className="text-xs text-muted-foreground">{Math.round(result.protein * 4)} calories</p>
              </div>
              <div className="p-3 bg-background rounded shadow-sm">
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-lg font-medium">{result.carbs}g</p>
                <p className="text-xs text-muted-foreground">{Math.round(result.carbs * 4)} calories</p>
              </div>
              <div className="p-3 bg-background rounded shadow-sm">
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="text-lg font-medium">{result.fat}g</p>
                <p className="text-xs text-muted-foreground">{Math.round(result.fat * 9)} calories</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalorieCalculator;
