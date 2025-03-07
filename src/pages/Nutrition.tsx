
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Apple, Calculator } from 'lucide-react';
import PlanCard from '@/components/PlanCard';
import PageTransition from '@/components/PageTransition';
import { mockNutritionPlans } from '@/lib/data';
import { NutritionPlan } from '@/lib/types';
import CalorieCalculator from '@/components/nutrition/CalorieCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Nutrition = () => {
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(mockNutritionPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('plans');
  
  // Filter nutrition plans based on search query
  const filteredNutritionPlans = nutritionPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Nutrition</h1>
            <p className="text-gray-500 mt-1">Create plans and calculate nutritional needs</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab('calculator')}>
              <Calculator className="mr-2 h-4 w-4" />
              Calorie Calculator
            </Button>
            <Button asChild>
              <Link to="/nutrition/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Plan
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="plans">Nutrition Plans</TabsTrigger>
            <TabsTrigger value="calculator">Calorie Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search nutrition plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:max-w-md glass-card"
                />
              </div>
            </div>
            
            {/* Nutrition Plan List */}
            {filteredNutritionPlans.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredNutritionPlans.map(plan => (
                  <PlanCard 
                    key={plan.id}
                    id={plan.id}
                    type="nutrition"
                    name={plan.name}
                    description={plan.description}
                    duration={plan.duration}
                    createdAt={plan.createdAt}
                    clientCount={plan.assignedToClientIds.length}
                    onClick={() => console.log('Navigate to nutrition plan', plan.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Apple className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No nutrition plans found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? "No nutrition plans match your search criteria." 
                    : "You haven't created any nutrition plans yet."}
                </p>
                <Button asChild>
                  <Link to="/nutrition/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Nutrition Plan
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calculator">
            <CalorieCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Nutrition;
