
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Users, Dumbbell, Apple, Home, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Get user info
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUserEmail(user.email || 'Coach');
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Nutrition', path: '/nutrition', icon: Apple },
  ];
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                CoachPro
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-4 md:items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'inline-flex items-center text-sm font-medium transition-colors px-4 py-2 rounded-full',
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
            
            {/* User info and logout */}
            {userEmail && (
              <div className="flex items-center ml-4">
                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mr-2">
                  {userEmail}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          'md:hidden absolute top-16 inset-x-0 transition transform origin-top duration-300 ease-in-out bg-white shadow-md',
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
        )}
      >
        <div className="px-2 pt-2 pb-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'block px-3 py-2 rounded-md text-base font-medium flex items-center',
                location.pathname === item.path
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
          
          {/* Mobile logout button */}
          {userEmail && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="px-3 py-1 text-sm text-gray-500">
                Logged in as: <span className="font-medium">{userEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
