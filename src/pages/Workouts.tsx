
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Dumbbell } from 'lucide-react';
import PlanCard from '@/components/PlanCard';
import PageTransition from '@/components/PageTransition';
import { mockWorkoutPlans } from '@/lib/data';
import { WorkoutPlan } from '@/lib/types';

const Workouts = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Filter workout plans based on search query
  const filteredWorkoutPlans = workoutPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handlePlanClick = (planId: string) => {
    navigate(`/workouts/${planId}`);
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Workout Plans</h1>
            <p className="text-gray-500 mt-1">Create and manage workout programs</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/workouts/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Plan
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search workout plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:max-w-md glass-card"
            />
          </div>
        </div>
        
        {/* Workout Plan List */}
        {filteredWorkoutPlans.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkoutPlans.map(plan => (
              <PlanCard 
                key={plan.id}
                id={plan.id}
                type="workout"
                name={plan.name}
                description={plan.description}
                duration={plan.duration}
                createdAt={plan.createdAt}
                clientCount={plan.assignedToClientIds.length}
                onClick={() => handlePlanClick(plan.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No workout plans found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? "No workout plans match your search criteria." 
                : "You haven't created any workout plans yet."}
            </p>
            <Button asChild>
              <Link to="/workouts/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Workout Plan
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Workouts;
