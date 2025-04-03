
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Dumbbell, Apple, Check } from 'lucide-react';
import { mockWorkoutPlans, mockNutritionPlans } from '@/lib/data';
import { WorkoutPlan, NutritionPlan } from '@/lib/types';

interface AssignPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (planId: string) => void;
  planType: 'workout' | 'nutrition';
  clientId: string;
  assignedPlanIds: string[];
}

const AssignPlanDialog = ({
  isOpen,
  onClose,
  onAssign,
  planType,
  clientId,
  assignedPlanIds
}: AssignPlanDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [plans, setPlans] = useState<(WorkoutPlan | NutritionPlan)[]>([]);

  useEffect(() => {
    // Load plans based on type
    if (planType === 'workout') {
      setPlans(mockWorkoutPlans);
    } else {
      setPlans(mockNutritionPlans);
    }
  }, [planType]);

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getTypeIcon = () => {
    return planType === 'workout' 
      ? <Dumbbell className="h-4 w-4" /> 
      : <Apple className="h-4 w-4" />;
  };

  const handleAssign = (planId: string) => {
    onAssign(planId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getTypeIcon()}
            <span className="ml-2">
              Assign {planType === 'workout' ? 'Workout' : 'Nutrition'} Plan
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={`Search ${planType} plans...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {filteredPlans.length > 0 ? (
              filteredPlans.map(plan => {
                const isAssigned = assignedPlanIds.includes(plan.id);
                
                return (
                  <div 
                    key={plan.id} 
                    className="flex items-start justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{plan.description}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        {plan.duration} week{plan.duration !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {isAssigned ? (
                      <div className="flex items-center text-xs text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Assigned
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssign(plan.id)}
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center py-6 text-gray-500">
                {searchQuery 
                  ? `No ${planType} plans match your search.`
                  : `No ${planType} plans available.`}
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPlanDialog;
