
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AboutMeCardProps {
  bio: string;
}

const AboutMeCard = ({ bio }: AboutMeCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{bio}</p>
      </CardContent>
    </Card>
  );
};

export default AboutMeCard;
