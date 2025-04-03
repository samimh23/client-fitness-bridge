
interface CoachData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  [key: string]: any;
}

export const useProfileCompletion = (coachData: CoachData): number => {
  const requiredFields = ['name', 'email', 'phone', 'location', 'bio'];
  
  const completedFields = requiredFields.filter(field => 
    typeof coachData[field] === 'string' && coachData[field].trim() !== ''
  );
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

export default useProfileCompletion;
