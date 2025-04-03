
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, Book, GraduationCap } from "lucide-react";

interface ProfessionalDetailsCardProps {
  specialties: string[];
  certifications: string[];
}

const ProfessionalDetailsCard = ({ specialties, certifications }: ProfessionalDetailsCardProps) => {
  return (
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
            {specialties.map((specialty, index) => (
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
            {certifications.map((cert, index) => (
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
  );
};

export default ProfessionalDetailsCard;
