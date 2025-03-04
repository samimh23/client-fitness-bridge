
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Users, Dumbbell, Apple, Clock, PlusCircle } from 'lucide-react';
import ClientCard from '@/components/ClientCard';
import PlanCard from '@/components/PlanCard';
import PageTransition from '@/components/PageTransition';
import { mockClients, mockWorkoutPlans, mockNutritionPlans } from '@/lib/data';

const Dashboard = () => {
  const [recentClients, setRecentClients] = useState(mockClients);
  const [recentWorkouts, setRecentWorkouts] = useState(mockWorkoutPlans);
  const [recentNutrition, setRecentNutrition] = useState(mockNutritionPlans);
  
  // Sort clients by last activity
  useEffect(() => {
    const sortedClients = [...mockClients].sort((a, b) => {
      if (!a.lastActive || !b.lastActive) return 0;
      return b.lastActive.getTime() - a.lastActive.getTime();
    });
    setRecentClients(sortedClients.slice(0, 3));
  }, []);
  
  // Sort plans by creation date
  useEffect(() => {
    const sortedWorkouts = [...mockWorkoutPlans].sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    setRecentWorkouts(sortedWorkouts.slice(0, 2));
    
    const sortedNutrition = [...mockNutritionPlans].sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    setRecentNutrition(sortedNutrition.slice(0, 2));
  }, []);
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your coaching business</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/clients/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Client
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockClients.length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Workout Plans
              </CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockWorkoutPlans.length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nutrition Plans
              </CardTitle>
              <Apple className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNutritionPlans.length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Plans
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockClients.reduce((total, client) => 
                  total + client.workoutPlans.length + client.nutritionPlans.length, 0
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Clients Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Recent Clients</h2>
            <Button variant="outline" asChild>
              <Link to="/clients">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentClients.map(client => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onClick={() => console.log('Navigate to client', client.id)}
              />
            ))}
          </div>
        </div>
        
        <Separator className="my-10" />
        
        {/* Recent Plans Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Workout Plans */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Recent Workout Plans</h2>
              <Button variant="outline" asChild>
                <Link to="/workouts">View All</Link>
              </Button>
            </div>
            
            <div className="space-y-5">
              {recentWorkouts.map(plan => (
                <PlanCard 
                  key={plan.id}
                  id={plan.id}
                  type="workout"
                  name={plan.name}
                  description={plan.description}
                  duration={plan.duration}
                  createdAt={plan.createdAt}
                  clientCount={plan.assignedToClientIds.length}
                  onClick={() => console.log('Navigate to workout plan', plan.id)}
                />
              ))}
            </div>
          </div>
          
          {/* Nutrition Plans */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Recent Nutrition Plans</h2>
              <Button variant="outline" asChild>
                <Link to="/nutrition">View All</Link>
              </Button>
            </div>
            
            <div className="space-y-5">
              {recentNutrition.map(plan => (
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
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
