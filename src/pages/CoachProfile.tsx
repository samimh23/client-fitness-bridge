
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Award, Book, Users, Clock, Save, UserRound, Settings, GraduationCap, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { mockClients } from '@/lib/data';

const CoachProfile = () => {
  const [coachData, setCoachData] = useState({
    name: "Alex Johnson",
    email: "alex@coachpro.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Certified personal trainer with 8+ years of experience specializing in strength training and nutrition. Passionate about helping clients achieve their fitness goals through personalized coaching.",
    specialties: ["Strength Training", "Weight Loss", "Nutrition Planning", "Post-rehabilitation"],
    certifications: ["NASM Certified Personal Trainer", "Precision Nutrition Level 2", "Functional Training Specialist"],
    experience: 8, // years
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...coachData });
  
  const clientsCount = mockClients.length;
  const activeClientsCount = mockClients.filter(client => 
    client.workoutPlans.length > 0 || client.nutritionPlans.length > 0
  ).length;
  
  const handleSave = () => {
    setCoachData(editData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };
  
  const handleCancel = () => {
    setEditData({ ...coachData });
    setIsEditing(false);
  };
  
  // Calculate completion percentage based on filled profile fields
  const calculateProfileCompletion = () => {
    const fields = Object.entries(coachData);
    const requiredFields = fields.filter(([key, value]) => 
      !Array.isArray(value) && value !== "" && 
      ["name", "email", "phone", "location", "bio"].includes(key)
    );
    
    return Math.round((requiredFields.length / 5) * 100);
  };
  
  const profileCompletion = calculateProfileCompletion();
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Coach Profile</h1>
            <p className="text-gray-500 mt-1">Manage your coaching profile and settings</p>
          </div>
          {isEditing ? (
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <UserRound className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary Card */}
              <Card className="col-span-1">
                <CardHeader className="relative text-center">
                  <div className="mx-auto mt-2">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-background">
                      <AvatarImage src={coachData.avatar} alt={coachData.name} />
                      <AvatarFallback>{coachData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="mt-4">{coachData.name}</CardTitle>
                  <CardDescription>Fitness Coach</CardDescription>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Profile Completion</p>
                    <Progress value={profileCompletion} className="h-2 mt-2" />
                    <p className="text-xs text-right mt-1">{profileCompletion}%</p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{coachData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{coachData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{coachData.location}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{coachData.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{clientsCount} total clients</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Profile Details */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                {isEditing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={editData.email}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={editData.phone}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={editData.location}
                            onChange={(e) => setEditData({...editData, location: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea 
                          id="bio"
                          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={editData.bio}
                          onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input 
                          id="experience" 
                          type="number"
                          min="0"
                          value={editData.experience}
                          onChange={(e) => setEditData({...editData, experience: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{coachData.bio}</p>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium flex items-center mb-3">
                        <Award className="h-4 w-4 mr-2" />
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {coachData.specialties.map((specialty, index) => (
                          <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                            {specialty}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center mb-3">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Certifications
                      </h4>
                      <ul className="space-y-2">
                        {coachData.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start">
                            <div className="rounded-full bg-primary/10 text-primary p-1 mr-2 mt-0.5">
                              <Book className="h-3 w-3" />
                            </div>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Clients
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientsCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Clients
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeClientsCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Client Retention
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Plans Created
                  </CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Client Engagement</p>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Workout Plan Usage</p>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Nutrition Plan Usage</p>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default CoachProfile;
