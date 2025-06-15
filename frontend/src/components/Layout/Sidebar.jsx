import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, Home, Users, Settings, 
  ShoppingCart, HelpCircle, LogOut, 
  X, Menu, PlusCircle 
} from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/create-order', icon: PlusCircle, label: 'Create Order' },
    { path: '/suppliers', icon: Users, label: 'Suppliers' },
  ];

  const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Get the token from localStorage or your auth context
      const token = localStorage.getItem('token');
      
      // Call the logout endpoint
      await axios.post('https://inventory-management-for-buisness.onrender.com/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Clear client-side authentication data
      localStorage.removeItem('token');
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we should clear the token and redirect
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden bg-white p-4 shadow flex items-center justify-between">
        <div className="flex items-center">
          <Package className="mr-2" size={24} />
          <h1 className="text-xl font-bold">DistribuHub</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-200 cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isOpen ? 'block fixed inset-0 z-40' : 'hidden'} md:relative md:block md:w-64 bg-white text-black p-4 h-full overflow-y-auto`}>
        <div className="flex items-center mb-8">
          <Package className="mr-2" size={24} />
          <h1 className="text-xl font-bold">DistribuHub</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li 
                key={item.path}
                className={`${isActive(item.path) ? 'bg-gray-300' : 'hover:bg-gray-200'} rounded-2xl p-4 cursor-pointer transition-colors`}
              >
                <Link 
                  to={item.path} 
                  className="flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-2" size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto">
          <ul className="space-y-2">
            {bottomItems.map((item) => (
              <li 
                key={item.path}
                className={`${isActive(item.path) ? 'bg-gray-300' : 'hover:bg-gray-200'} rounded-2xl p-4 cursor-pointer transition-colors`}
              >
                <Link 
                  to={item.path} 
                  className="flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-2" size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="hover:bg-black hover:text-white rounded-2xl p-4 cursor-pointer transition-colors">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center w-full cursor-pointer"
              >
                <LogOut className="mr-2" size={20} />
                <span>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;