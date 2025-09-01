import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, Target, Calendar } from 'lucide-react';
import { WorkoutPerformanceEntry } from '@/lib/types';

interface WorkoutPerformanceAnalyticsProps {
  performanceData: WorkoutPerformanceEntry[];
  onAddEntry: () => void;
}

const WorkoutPerformanceAnalytics = ({ performanceData, onAddEntry }: WorkoutPerformanceAnalyticsProps) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [viewMode, setViewMode] = useState<'weight' | 'reps' | 'volume'>('weight');

  // Get unique exercises
  const uniqueExercises = [...new Set(performanceData.map(entry => entry.exerciseName))];

  // Filter data by selected exercise
  const filteredData = selectedExercise 
    ? performanceData.filter(entry => entry.exerciseName === selectedExercise)
    : performanceData;

  // Prepare chart data
  const chartData = filteredData
    .map(entry => {
      const totalWeight = entry.sets.reduce((sum, set) => sum + (set.weight || 0) * set.reps, 0);
      const totalReps = entry.sets.reduce((sum, set) => sum + set.reps, 0);
      const maxWeight = Math.max(...entry.sets.map(set => set.weight || 0));
      
      return {
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: maxWeight,
        reps: totalReps,
        volume: totalWeight,
        fatigue: entry.fatigue || 0,
        difficulty: entry.difficulty || 0,
        fullDate: entry.date
      };
    })
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  // Calculate progress metrics
  const latestEntry = chartData[chartData.length - 1];
  const firstEntry = chartData[0];
  const progressPercentage = latestEntry && firstEntry ? 
    ((latestEntry[viewMode] - firstEntry[viewMode]) / firstEntry[viewMode]) * 100 : 0;

  // Weekly performance summary
  const weeklyData = performanceData.reduce((acc, entry) => {
    const weekStart = new Date(entry.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = { workouts: 0, avgFatigue: 0, avgDifficulty: 0, totalVolume: 0 };
    }
    
    acc[weekKey].workouts++;
    acc[weekKey].avgFatigue += entry.fatigue || 0;
    acc[weekKey].avgDifficulty += entry.difficulty || 0;
    acc[weekKey].totalVolume += entry.sets.reduce((sum, set) => sum + (set.weight || 0) * set.reps, 0);
    
    return acc;
  }, {} as Record<string, any>);

  const weeklyChartData = Object.entries(weeklyData).map(([week, data]) => ({
    week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    workouts: data.workouts,
    avgFatigue: (data.avgFatigue / data.workouts).toFixed(1),
    avgDifficulty: (data.avgDifficulty / data.workouts).toFixed(1),
    totalVolume: data.totalVolume
  }));

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Workout Performance
            </CardTitle>
            <Button onClick={onAddEntry} size="sm">
              <Target className="h-4 w-4 mr-1" />
              Log Workout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {performanceData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No workout data yet</p>
              <Button onClick={onAddEntry} variant="outline" size="sm" className="mt-2">
                Log Your First Workout
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Exercise & View Mode Selectors */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedExercise ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedExercise('')}
                >
                  All Exercises
                </Button>
                {uniqueExercises.map(exercise => (
                  <Button
                    key={exercise}
                    variant={selectedExercise === exercise ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExercise(exercise)}
                    className="text-xs"
                  >
                    {exercise}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                {(['weight', 'reps', 'volume'] as const).map(mode => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className="capitalize"
                  >
                    {mode}
                  </Button>
                ))}
              </div>

              {/* Progress Summary */}
              {latestEntry && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {progressPercentage > 0 ? '+' : ''}{progressPercentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Latest {viewMode}</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {latestEntry[viewMode]} {viewMode === 'weight' ? 'kg' : viewMode === 'volume' ? 'kg' : ''}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Fatigue Level</span>
                    </div>
                    <div className="space-y-1">
                      <Progress value={latestEntry.fatigue * 10} className="h-2" />
                      <p className="text-sm text-muted-foreground">{latestEntry.fatigue}/10</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Chart */}
              {chartData.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value} ${viewMode === 'weight' || viewMode === 'volume' ? 'kg' : ''}`,
                          name === 'weight' ? 'Max Weight' : name === 'reps' ? 'Total Reps' : 'Total Volume'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={viewMode} 
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

      {/* Weekly Summary */}
      {weeklyChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Training Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="hsl(var(--primary))" name="Workouts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutPerformanceAnalytics;