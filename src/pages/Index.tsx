
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Dumbbell, Apple, ClipboardList, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if already logged in
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.isAuthenticated) {
          setIsAuthenticated(true);
          setUserRole(user.role);
        }
      } catch (e) {
        // Invalid JSON, clear it
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const handleMainButtonClick = () => {
    if (isAuthenticated) {
      navigate(userRole === 'coach' ? '/dashboard' : '/client-app');
    } else {
      console.log("Navigating to login page");
      navigate('/login');
    }
  };
  
  const handleLoginClick = () => {
    console.log("Login button clicked, navigating to login page");
    navigate('/login');
  };
  
  const featureItems = [
    {
      icon: Users,
      title: 'Client Management',
      description: 'Efficiently manage your coaching clients with detailed profiles and progress tracking.'
    },
    {
      icon: Dumbbell,
      title: 'Workout Planning',
      description: 'Create customized workout plans with detailed exercises, sets, and reps for your clients.'
    },
    {
      icon: Apple,
      title: 'Nutrition Planning',
      description: 'Design meal plans with nutritional information to help clients achieve their dietary goals.'
    },
    {
      icon: ClipboardList,
      title: 'Assignment System',
      description: 'Easily assign workout and nutrition plans to clients and monitor their progress.'
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-0"></div>
        
        {/* Animated Shapes */}
        <motion.div 
          className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-primary/5 z-0"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full bg-primary/10 z-0"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Elevate Your <span className="text-primary">Coaching</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Streamline client management, workout planning, and nutrition programs in one intuitive platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              onClick={handleMainButtonClick} 
              size="lg" 
              className="group"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            {!isAuthenticated && (
              <Button 
                onClick={handleLoginClick} 
                size="lg" 
                variant="outline"
                className="group"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Button>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Everything You Need</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {featureItems.map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card rounded-2xl p-6 hover-scale"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="rounded-full bg-primary/10 text-primary p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Coaching Business?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Seamlessly manage clients, create personalized workout and nutrition plans, and take your coaching to the next level.</p>
          <Button 
            onClick={handleMainButtonClick} 
            variant="secondary"
            size="lg"
            className="group"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Now'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
