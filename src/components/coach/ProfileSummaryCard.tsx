
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Briefcase, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProfileSummaryCardProps {
  coachData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    experience: number;
    avatar: string;
  };
  profileCompletion: number;
  clientsCount: number;
}

const ProfileSummaryCard = ({ coachData, profileCompletion, clientsCount }: ProfileSummaryCardProps) => {
  return (
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
  );
};

export default ProfileSummaryCard;
