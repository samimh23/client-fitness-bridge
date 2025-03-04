
import { useState } from 'react';
import { ChevronRight, Calendar, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  id: string;
  type: 'workout' | 'nutrition';
  name: string;
  description: string;
  duration: number;
  createdAt: Date;
  clientCount: number;
  onClick?: () => void;
}

const PlanCard = ({ 
  id, 
  type, 
  name, 
  description, 
  duration, 
  createdAt, 
  clientCount, 
  onClick 
}: PlanCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getTypeColor = () => {
    return type === 'workout' 
      ? 'from-green-500 to-emerald-700' 
      : 'from-blue-500 to-indigo-700';
  };
  
  return (
    <div 
      className={cn(
        'glass-card rounded-2xl overflow-hidden transition-all duration-300 ease-out',
        isHovered ? 'translate-y-[-4px] shadow-xl' : 'shadow-md'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`h-2 bg-gradient-to-r ${getTypeColor()}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className={`inline-block text-xs font-medium px-2 py-1 rounded-full mb-2 ${
              type === 'workout' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {type === 'workout' ? 'Workout Plan' : 'Nutrition Plan'}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          </div>
          <ChevronRight 
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform", 
              isHovered ? "translate-x-1" : ""
            )} 
          />
        </div>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
        
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Created {formatDate(createdAt)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{duration} week{duration !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{clientCount} client{clientCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
