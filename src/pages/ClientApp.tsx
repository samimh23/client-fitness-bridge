
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Dumbbell, Apple } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockNutritionPlans, mockWorkoutPlans } from '@/lib/data';

export default function ClientApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workouts');
  const [userEmail, setUserEmail] = useState('');
  
  // Get user data
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserEmail(user.email || 'Client');
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <User className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold">{userEmail}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        <main className="container mx-auto px-4 pt-20 pb-20">
          {/* Client app content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="workouts">
                <Dumbbell className="h-4 w-4 mr-2" />
                Workouts
              </TabsTrigger>
              <TabsTrigger value="nutrition">
                <Apple className="h-4 w-4 mr-2" />
                Nutrition
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="workouts" className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Your Workout Plans</h2>
              
              {mockWorkoutPlans.slice(0, 3).map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-gray-500 text-sm my-1">{plan.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{plan.duration} week plan</span>
                    <Button size="sm" variant="outline">View Plan</Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="nutrition" className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Your Nutrition Plans</h2>
              
              {mockNutritionPlans.slice(0, 3).map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <p className="text-gray-500 text-sm my-1">{plan.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {plan.totalCalories} cal
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {plan.totalProtein}g protein
                      </span>
                    </div>
                    <Button size="sm" variant="outline">View Plan</Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Mobile navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto grid grid-cols-2">
            <button 
              className={`flex flex-col items-center justify-center py-2 ${activeTab === 'workouts' ? 'text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('workouts')}
            >
              <Dumbbell className="h-5 w-5" />
              <span className="text-xs mt-1">Workouts</span>
            </button>
            <button 
              className={`flex flex-col items-center justify-center py-2 ${activeTab === 'nutrition' ? 'text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('nutrition')}
            >
              <Apple className="h-5 w-5" />
              <span className="text-xs mt-1">Nutrition</span>
            </button>
          </div>
        </nav>
      </div>
    </PageTransition>
  );
}
