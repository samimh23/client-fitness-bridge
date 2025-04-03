
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/lib/types';
import { ChevronRight, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const hasWorkout = client.workoutPlans.length > 0;
  const hasNutrition = client.nutritionPlans.length > 0;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/clients/${client.id}`);
    }
  };
  
  return (
    <div 
      className={cn(
        'glass-card rounded-2xl overflow-hidden transition-all duration-300 ease-out cursor-pointer',
        isHovered ? 'translate-y-[-4px] shadow-xl' : 'shadow-md'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-center space-x-4">
          {client.avatar ? (
            <img 
              src={client.avatar} 
              alt={client.name} 
              className="h-14 w-14 rounded-full object-cover border-2 border-white/50"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {client.name.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{client.name}</h3>
            <p className="text-sm text-gray-500 truncate">{client.email}</p>
          </div>
          
          <ChevronRight 
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform", 
              isHovered ? "translate-x-1" : ""
            )} 
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Joined {formatDate(client.joinedDate)}</span>
          </div>
          
          {hasWorkout && (
            <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Workout Plan</span>
            </div>
          )}
          
          {hasNutrition && (
            <div className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Nutrition Plan</span>
            </div>
          )}
        </div>
        
        {client.goal && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 line-clamp-2">
              <span className="font-medium">Goal:</span> {client.goal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCard;
