
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRound, Award } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import { mockClients } from '@/lib/data';
import useProfileCompletion from '@/hooks/useProfileCompletion';

// Import refactored components
import ProfileSummaryCard from '@/components/coach/ProfileSummaryCard';
import ProfileEditForm from '@/components/coach/ProfileEditForm';
import AboutMeCard from '@/components/coach/AboutMeCard';
import ProfessionalDetailsCard from '@/components/coach/ProfessionalDetailsCard';
import StatisticsOverview from '@/components/coach/StatisticsOverview';
import ProfileHeader from '@/components/coach/ProfileHeader';

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
  
  const profileCompletion = useProfileCompletion(coachData);
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <ProfileHeader 
          isEditing={isEditing} 
          onEdit={() => setIsEditing(true)} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
        
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
              <ProfileSummaryCard 
                coachData={coachData} 
                profileCompletion={profileCompletion} 
                clientsCount={clientsCount} 
              />
              
              {/* Profile Details */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                {isEditing ? (
                  <ProfileEditForm 
                    editData={editData} 
                    setEditData={setEditData} 
                  />
                ) : (
                  <AboutMeCard bio={coachData.bio} />
                )}
                
                <ProfessionalDetailsCard 
                  specialties={coachData.specialties} 
                  certifications={coachData.certifications} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <StatisticsOverview 
              clientsCount={clientsCount}
              activeClientsCount={activeClientsCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default CoachProfile;
