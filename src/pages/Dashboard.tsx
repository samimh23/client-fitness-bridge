import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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
  
  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your coaching business</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button asChild className="btn-primary">
              <Link to="/clients/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Client
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-enhanced group">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clients
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:animate-bounce-soft">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockClients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active coaching relationships</p>
            </CardContent>
          </Card>
          
          <Card className="card-enhanced group">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Workout Plans
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:animate-bounce-soft">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockWorkoutPlans.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Training programs created</p>
            </CardContent>
          </Card>
          
          <Card className="card-enhanced group">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nutrition Plans
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:animate-bounce-soft">
                <Apple className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{mockNutritionPlans.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Meal plans designed</p>
            </CardContent>
          </Card>
          
          <Card className="card-enhanced group">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Plans
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:animate-bounce-soft">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {mockClients.reduce((total, client) => 
                  total + client.workoutPlans.length + client.nutritionPlans.length, 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Currently assigned</p>
            </CardContent>
          </Card>
        </div>
        
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
                onClick={() => handleClientClick(client.id)}
              />
            ))}
          </div>
        </div>
        
        <Separator className="my-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
