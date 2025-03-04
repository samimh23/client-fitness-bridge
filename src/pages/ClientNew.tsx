
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { mockClients } from '@/lib/data';

const ClientNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    // In a real application, we would save the client to a database
    const newClient = {
      id: `client-${mockClients.length + 1}`,
      name: formData.name,
      email: formData.email,
      joinedDate: new Date(),
      workoutPlans: [],
      nutritionPlans: [],
      goal: formData.goal,
      notes: formData.notes
    };
    
    // Simulate adding to the database
    console.log('New client created:', newClient);
    
    toast.success('Client created successfully!');
    navigate('/clients');
  };

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
          <div>
            <h1 className="text-3xl font-bold">Add New Client</h1>
            <p className="text-gray-500 mt-1">Create a profile for your new client</p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal">Fitness Goal</Label>
                    <Input
                      id="goal"
                      name="goal"
                      placeholder="e.g., Lose weight, build muscle, improve endurance"
                      value={formData.goal}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any additional information about the client"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => navigate('/clients')}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Client
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default ClientNew;
