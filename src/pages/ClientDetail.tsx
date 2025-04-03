
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell, Apple, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AssignPlanDialog from '@/components/client/AssignPlanDialog';
import { Client } from '@/lib/types';
import { mockClients, mockWorkoutPlans, mockNutritionPlans } from '@/lib/data';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
  const [isNutritionDialogOpen, setIsNutritionDialogOpen] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundClient = mockClients.find(c => c.id === id);
    if (foundClient) {
      setClient(foundClient);
    }
  }, [id]);
  
  const handleAssignWorkoutPlan = (planId: string) => {
    if (!client) return;
    
    // Clone client to avoid direct state mutation
    const updatedClient = { 
      ...client, 
      workoutPlans: [...client.workoutPlans, planId] 
    };
    
    // Update client (in a real app, this would be an API call)
    setClient(updatedClient);
    toast.success('Workout plan assigned successfully');
  };
  
  const handleAssignNutritionPlan = (planId: string) => {
    if (!client) return;
    
    // Clone client to avoid direct state mutation
    const updatedClient = { 
      ...client, 
      nutritionPlans: [...client.nutritionPlans, planId] 
    };
    
    // Update client (in a real app, this would be an API call)
    setClient(updatedClient);
    toast.success('Nutrition plan assigned successfully');
  };
  
  if (!client) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 text-center">
        <p>Client not found</p>
        <Button 
          variant="link" 
          onClick={() => navigate('/clients')}
          className="mt-4"
        >
          Back to Clients
        </Button>
      </div>
    );
  }
  
  const assignedWorkoutPlans = mockWorkoutPlans.filter(plan => 
    client.workoutPlans.includes(plan.id)
  );
  
  const assignedNutritionPlans = mockNutritionPlans.filter(plan => 
    client.nutritionPlans.includes(plan.id)
  );
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/clients')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-gray-500 mt-1">{client.email}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Client Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  {client.avatar ? (
                    <img 
                      src={client.avatar} 
                      alt={client.name} 
                      className="h-32 w-32 rounded-full object-cover mx-auto border-2 border-white/50"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-4xl mx-auto">
                      {client.name.charAt(0)}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                    <p>{new Date(client.joinedDate).toLocaleDateString()}</p>
                  </div>
                  
                  {client.lastActive && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Active</h3>
                      <p>{new Date(client.lastActive).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  {client.goal && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Goal</h3>
                      <p>{client.goal}</p>
                    </div>
                  )}
                  
                  {client.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                      <p className="text-sm">{client.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="workout" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="workout">Workout Plans</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition Plans</TabsTrigger>
              </TabsList>
              
              <TabsContent value="workout" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Assigned Workout Plans</h2>
                  <Button onClick={() => setIsWorkoutDialogOpen(true)}>
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Assign Plan
                  </Button>
                </div>
                
                {assignedWorkoutPlans.length > 0 ? (
                  <div className="space-y-3">
                    {assignedWorkoutPlans.map(plan => (
                      <Card key={plan.id} className="overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-700"></div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="inline-block text-xs font-medium px-2 py-1 rounded-full mb-1 bg-green-100 text-green-800">
                                {plan.duration} week{plan.duration !== 1 ? 's' : ''}
                              </div>
                              <h3 className="font-semibold">{plan.name}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1">{plan.description}</p>
                            </div>
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No workout plans assigned yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="nutrition" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Assigned Nutrition Plans</h2>
                  <Button onClick={() => setIsNutritionDialogOpen(true)}>
                    <Apple className="mr-2 h-4 w-4" />
                    Assign Plan
                  </Button>
                </div>
                
                {assignedNutritionPlans.length > 0 ? (
                  <div className="space-y-3">
                    {assignedNutritionPlans.map(plan => (
                      <Card key={plan.id} className="overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-700"></div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="inline-block text-xs font-medium px-2 py-1 rounded-full mb-1 bg-blue-100 text-blue-800">
                                {plan.duration} week{plan.duration !== 1 ? 's' : ''}
                              </div>
                              <h3 className="font-semibold">{plan.name}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1">{plan.description}</p>
                            </div>
                            <Check className="h-5 w-5 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No nutrition plans assigned yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <AssignPlanDialog 
        isOpen={isWorkoutDialogOpen} 
        onClose={() => setIsWorkoutDialogOpen(false)}
        onAssign={handleAssignWorkoutPlan}
        planType="workout"
        clientId={client.id}
        assignedPlanIds={client.workoutPlans}
      />
      
      <AssignPlanDialog 
        isOpen={isNutritionDialogOpen} 
        onClose={() => setIsNutritionDialogOpen(false)}
        onAssign={handleAssignNutritionPlan}
        planType="nutrition"
        clientId={client.id}
        assignedPlanIds={client.nutritionPlans}
      />
    </PageTransition>
  );
};

export default ClientDetail;
