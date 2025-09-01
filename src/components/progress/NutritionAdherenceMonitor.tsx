import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Apple, CheckCircle, XCircle, Target, TrendingUp } from 'lucide-react';
import { NutritionAdherenceEntry } from '@/lib/types';

interface NutritionAdherenceMonitorProps {
  adherenceData: NutritionAdherenceEntry[];
  onAddEntry: () => void;
}

const NutritionAdherenceMonitor = ({ adherenceData, onAddEntry }: NutritionAdherenceMonitorProps) => {
  const [viewPeriod, setViewPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Filter data by period
  const now = new Date();
  const filteredData = adherenceData.filter(entry => {
    const entryDate = new Date(entry.date);
    const daysDiff = (now.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
    
    if (viewPeriod === 'week') return daysDiff <= 7;
    if (viewPeriod === 'month') return daysDiff <= 30;
    return true;
  });

  // Calculate overall statistics
  const totalEntries = filteredData.length;
  const averageAdherence = totalEntries > 0 
    ? filteredData.reduce((sum, entry) => sum + entry.adherencePercentage, 0) / totalEntries 
    : 0;

  const completedMeals = filteredData.reduce((sum, entry) => sum + entry.mealsCompleted, 0);
  const totalMeals = filteredData.reduce((sum, entry) => sum + entry.totalMeals, 0);
  const mealCompletionRate = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

  // Calorie tracking
  const calorieData = filteredData.filter(entry => entry.caloriesConsumed && entry.targetCalories);
  const averageCalorieAdherence = calorieData.length > 0
    ? calorieData.reduce((sum, entry) => sum + (entry.caloriesConsumed! / entry.targetCalories!) * 100, 0) / calorieData.length
    : 0;

  // Chart data
  const chartData = filteredData
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      adherence: entry.adherencePercentage,
      mealsCompleted: entry.mealsCompleted,
      totalMeals: entry.totalMeals,
      calorieAdherence: entry.caloriesConsumed && entry.targetCalories 
        ? (entry.caloriesConsumed / entry.targetCalories) * 100 
        : null,
      fullDate: entry.date
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  // Adherence distribution for pie chart
  const adherenceRanges = [
    { name: 'Excellent (90-100%)', count: 0, color: '#22c55e' },
    { name: 'Good (70-89%)', count: 0, color: '#3b82f6' },
    { name: 'Fair (50-69%)', count: 0, color: '#f59e0b' },
    { name: 'Poor (<50%)', count: 0, color: '#ef4444' }
  ];

  filteredData.forEach(entry => {
    if (entry.adherencePercentage >= 90) adherenceRanges[0].count++;
    else if (entry.adherencePercentage >= 70) adherenceRanges[1].count++;
    else if (entry.adherencePercentage >= 50) adherenceRanges[2].count++;
    else adherenceRanges[3].count++;
  });

  const pieData = adherenceRanges.filter(range => range.count > 0);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-primary" />
              Nutrition Adherence
            </CardTitle>
            <Button onClick={onAddEntry} size="sm">
              <Target className="h-4 w-4 mr-1" />
              Log Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {adherenceData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Apple className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No nutrition data yet</p>
              <Button onClick={onAddEntry} variant="outline" size="sm" className="mt-2">
                Start Tracking Nutrition
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Period Selector */}
              <div className="flex gap-2">
                {(['week', 'month', 'all'] as const).map(period => (
                  <Button
                    key={period}
                    variant={viewPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewPeriod(period)}
                    className="capitalize"
                  >
                    {period === 'all' ? 'All Time' : `This ${period}`}
                  </Button>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Average Adherence</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {averageAdherence.toFixed(1)}%
                  </p>
                  <Progress value={averageAdherence} className="mt-2 h-2" />
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Meal Completion</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {mealCompletionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {completedMeals}/{totalMeals} meals
                  </p>
                </div>

                {calorieData.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Calorie Target</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {averageCalorieAdherence.toFixed(1)}%
                    </p>
                    <Progress value={averageCalorieAdherence} className="mt-2 h-2" />
                  </div>
                )}
              </div>

              {/* Adherence Trend Chart */}
              {chartData.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Adherence']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="adherence" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adherence Distribution */}
      {pieData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Adherence Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Days']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                {pieData.map((range, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: range.color }}
                    />
                    <span className="text-sm">{range.name}</span>
                    <span className="text-sm font-medium ml-auto">{range.count} days</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutritionAdherenceMonitor;