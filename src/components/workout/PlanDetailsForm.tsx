
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PlanDetailsFormProps {
  name: string;
  description: string;
  duration: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PlanDetailsForm = ({ name, description, duration, onChange }: PlanDetailsFormProps) => {
  return (
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
              placeholder="e.g., Beginner Strength Training"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the goals and focus of this workout plan"
              rows={3}
              value={description}
              onChange={onChange}
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
              value={duration}
              onChange={onChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanDetailsForm;
