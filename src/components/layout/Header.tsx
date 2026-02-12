import { Calendar, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logout } from '@/lib/storage';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  const isOnDashboard = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Event Management System
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.isAdmin && (
              <Button
                variant={isOnDashboard ? "default" : "outline"}
                size="sm"
                onClick={() => navigate(isOnDashboard ? '/' : '/admin')}
                className="gap-2"
              >
                {isOnDashboard ? (
                  <>
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Events</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </>
                )}
              </Button>
            )}
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
                  {currentUser.isAdmin && (
                    <span className="text-xs text-purple-600 font-medium">Admin</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
