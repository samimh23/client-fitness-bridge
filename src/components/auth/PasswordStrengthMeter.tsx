
import { useEffect, useState } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback('');
      return;
    }

    // Calculate password strength
    let currentStrength = 0;
    
    // Length check
    if (password.length >= 8) currentStrength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) currentStrength += 1;
    if (/[a-z]/.test(password)) currentStrength += 1;
    if (/[0-9]/.test(password)) currentStrength += 1;
    if (/[^A-Za-z0-9]/.test(password)) currentStrength += 1;

    setStrength(currentStrength);

    // Set feedback based on strength
    switch (currentStrength) {
      case 0:
      case 1:
        setFeedback('Weak');
        break;
      case 2:
      case 3:
        setFeedback('Moderate');
        break;
      case 4:
        setFeedback('Strong');
        break;
      case 5:
        setFeedback('Very Strong');
        break;
      default:
        setFeedback('');
    }
  }, [password]);

  // Don't show anything if password is empty
  if (!password) return null;

  const getColorClass = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-green-600';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="mt-1 space-y-1">
      <div className="flex h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <div 
          className={`${getColorClass()} transition-all duration-300 ease-in-out`} 
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <p className={`text-xs ${getColorClass().replace('bg-', 'text-')}`}>
        {feedback}
      </p>
    </div>
  );
}
