
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CoachData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  experience: number;
  specialties: string[];
  certifications: string[];
  avatar: string;
}

interface ProfileEditFormProps {
  editData: CoachData;
  setEditData: (data: CoachData) => void;
}

const ProfileEditForm = ({ editData, setEditData }: ProfileEditFormProps) => {
  return (
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
  );
};

export default ProfileEditForm;
