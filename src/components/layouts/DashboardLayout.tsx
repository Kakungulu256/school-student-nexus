
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  UserPlus, 
  FileText, 
  BarChart, 
  Book, 
  FileQuestion, 
  History,
  School,
  GraduationCap,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const isSchool = user.userType === 'school';
  const isStudent = user.userType === 'student';
  
  // Navigation items based on user type
  const navigationItems = isSchool
    ? [
        { name: 'User Management', icon: UserPlus, href: '/dashboard/users' },
        { name: 'Paper Setting', icon: FileText, href: '/dashboard/papers' },
        { name: 'Reports', icon: BarChart, href: '/dashboard/reports' },
      ]
    : isStudent
    ? [
        { name: 'Learning Mode', icon: Book, href: '/dashboard/learning' },
        { name: 'Test Mode', icon: FileQuestion, href: '/dashboard/tests' },
        { name: 'Past Papers', icon: History, href: '/dashboard/past-papers' },
      ]
    : [
        { name: 'Dashboard', icon: BarChart, href: '/dashboard' },
      ];
      
  const getUserIcon = () => {
    switch (user.userType) {
      case 'school':
        return <School className="h-5 w-5 mr-2" />;
      case 'student':
        return <GraduationCap className="h-5 w-5 mr-2" />;
      default:
        return <User className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2 lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link to="/" className="text-xl font-bold text-education-primary flex items-center">
              <span className="hidden sm:inline">School-Student Nexus</span>
              <span className="sm:hidden">SSN</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden md:inline">
              Welcome, {user.name}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  {getUserIcon()}
                  <span className="hidden sm:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-gray-50 border-r border-gray-200 w-64 md:w-60 lg:w-64 flex-shrink-0 transition-all duration-300 fixed md:sticky top-[57px] md:top-[57px] h-[calc(100vh-57px)] z-20 overflow-y-auto",
            isSidebarOpen ? "left-0" : "-left-64"
          )}
        >
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-education-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <main className={cn(
          "flex-1 p-4 md:p-6",
          isSidebarOpen ? "md:ml-0" : "ml-0"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
