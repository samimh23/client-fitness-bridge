import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { BodyMeasurement } from '@/lib/types';

interface BodyMeasurementsChartProps {
  measurements: BodyMeasurement[];
  onAddMeasurement: () => void;
}

const BodyMeasurementsChart = ({ measurements, onAddMeasurement }: BodyMeasurementsChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<keyof BodyMeasurement['measurements'] | 'weight' | 'bodyFat'>('weight');

  const availableMetrics = [
    { key: 'weight', label: 'Weight', unit: 'kg' },
    { key: 'bodyFat', label: 'Body Fat %', unit: '%' },
    { key: 'muscleMass', label: 'Muscle Mass', unit: 'kg' },
    { key: 'chest', label: 'Chest', unit: 'cm' },
    { key: 'waist', label: 'Waist', unit: 'cm' },
    { key: 'hips', label: 'Hips', unit: 'cm' },
    { key: 'bicep', label: 'Bicep', unit: 'cm' },
    { key: 'thigh', label: 'Thigh', unit: 'cm' },
  ];

  const chartData = measurements
    .filter(m => {
      if (selectedMetric === 'weight') return m.weight !== undefined;
      if (selectedMetric === 'bodyFat') return m.bodyFat !== undefined;
      if (selectedMetric === 'muscleMass') return m.muscleMass !== undefined;
      return m.measurements[selectedMetric] !== undefined;
    })
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: selectedMetric === 'weight' ? m.weight :
             selectedMetric === 'bodyFat' ? m.bodyFat :
             selectedMetric === 'muscleMass' ? m.muscleMass :
             m.measurements[selectedMetric],
      fullDate: m.date
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  const selectedMetricInfo = availableMetrics.find(m => m.key === selectedMetric);
  const latestValue = chartData[chartData.length - 1]?.value;
  const previousValue = chartData[chartData.length - 2]?.value;
  
  const trend = latestValue && previousValue ? 
    (latestValue > previousValue ? 'up' : latestValue < previousValue ? 'down' : 'stable') : null;

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getChangeText = () => {
    if (!latestValue || !previousValue) return null;
    const change = (latestValue - previousValue).toFixed(1);
    const isPositive = parseFloat(change) > 0;
    return (
      <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
        {isPositive ? '+' : ''}{change} {selectedMetricInfo?.unit}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            Body Measurements
          </CardTitle>
          <Button onClick={onAddMeasurement} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Measurement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Metric Selector */}
          <div className="flex flex-wrap gap-2">
            {availableMetrics.map(metric => {
              const hasData = measurements.some(m => {
                if (metric.key === 'weight') return m.weight !== undefined;
                if (metric.key === 'bodyFat') return m.bodyFat !== undefined;
                if (metric.key === 'muscleMass') return m.muscleMass !== undefined;
                return m.measurements[metric.key] !== undefined;
              });
              
              return (
                <Button
                  key={metric.key}
                  variant={selectedMetric === metric.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric(metric.key as any)}
                  disabled={!hasData}
                  className="text-xs"
                >
                  {metric.label}
                </Button>
              );
            })}
          </div>

          {/* Current Value & Trend */}
          {latestValue && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Current {selectedMetricInfo?.label}</p>
                <p className="text-2xl font-bold">
                  {latestValue} {selectedMetricInfo?.unit}
                </p>
              </div>
              {trend && (
                <div className="flex items-center gap-1">
                  {getTrendIcon()}
                  <span className="text-sm">
                    {getChangeText()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} ${selectedMetricInfo?.unit}`, selectedMetricInfo?.label]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Ruler className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No measurements for {selectedMetricInfo?.label.toLowerCase()} yet</p>
              <Button onClick={onAddMeasurement} variant="outline" size="sm" className="mt-2">
                Add Your First Measurement
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyMeasurementsChart;