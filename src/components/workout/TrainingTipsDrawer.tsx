
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

// Pro tips data organized in categories
export const PRO_TIPS = {
  programming: [
    "Group exercises by muscle groups to optimize recovery",
    "Include both compound and isolation exercises for complete development",
    "Implement progressive overload by gradually increasing weight, reps, or sets",
    "Allow 48-72 hours rest between training the same muscle group",
    "Periodize your program (4-6 weeks) before changing intensity to avoid plateaus"
  ],
  technique: [
    "Start with compound movements when your energy is highest",
    "Use a proper warm-up protocol before heavy lifting to prevent injury",
    "Focus on proper form over heavy weights to prevent injuries",
    "Use tempo variations to increase time under tension for hypertrophy",
    "Alternate between pushing and pulling movements for balanced development"
  ],
  recovery: [
    "Listen to your body and avoid overtraining - rest is when growth occurs",
    "Incorporate mobility and stretching exercises to maintain flexibility",
    "Include deload weeks (lighter training) every 4-6 weeks for recovery",
    "Stay hydrated (aim for 3-4 liters daily) during training periods",
    "Consume protein within 30 minutes post-workout for optimal recovery"
  ],
  planning: [
    "Track your progress with a workout journal or fitness app",
    "Consider your experience level when selecting exercise difficulty",
    "Plan your workout splits based on your weekly availability",
    "Adjust volume based on your recovery capacity and stress levels",
    "Balance your program with cardiovascular training for heart health"
  ]
};

interface TrainingTipsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrainingTipsDrawer = ({ isOpen, onOpenChange }: TrainingTipsDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center text-amber-800">
            <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
            Professional Training Tips
          </DrawerTitle>
          <DrawerDescription>
            Expert advice to optimize your workout plan
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <Accordion type="multiple" className="w-full">
            {Object.entries(PRO_TIPS).map(([category, tips]) => (
              <AccordionItem value={category} key={category} className="border-amber-100">
                <AccordionTrigger className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-md px-2">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  <ul className="space-y-2">
                    {tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex gap-2 group hover:bg-amber-50 p-2 rounded-lg transition-colors">
                        <Badge variant="outline" className="shrink-0 mt-0.5 bg-amber-100 text-amber-800 border-amber-200 h-5 group-hover:bg-amber-200">
                          {String(tipIndex + 1).padStart(2, '0')}
                        </Badge>
                        <span className="text-amber-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TrainingTipsDrawer;
