
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, FileText, BarChart, Book, FileQuestion, History } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If school is not verified, redirect to verification page
    if (user?.userType === 'school' && !user.isVerified) {
      navigate('/verify-token');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const isSchool = user.userType === 'school';
  const isStudent = user.userType === 'student';
  
  // Dashboard items based on user type
  const dashboardItems = isSchool
    ? [
        { 
          name: 'User Management', 
          description: 'Add, remove, or manage student accounts', 
          icon: UserPlus, 
          href: '/dashboard/users',
          color: 'bg-blue-100 text-blue-700'
        },
        { 
          name: 'Paper Setting', 
          description: 'Create and manage examination papers', 
          icon: FileText, 
          href: '/dashboard/papers',
          color: 'bg-green-100 text-green-700'
        },
        { 
          name: 'Reports', 
          description: 'View student performance reports', 
          icon: BarChart, 
          href: '/dashboard/reports',
          color: 'bg-purple-100 text-purple-700'
        },
      ]
    : isStudent
    ? [
        { 
          name: 'Learning Mode', 
          description: 'Practice with interactive questions', 
          icon: Book, 
          href: '/dashboard/learning',
          color: 'bg-blue-100 text-blue-700'
        },
        { 
          name: 'Test Mode', 
          description: 'Take tests assigned by your school', 
          icon: FileQuestion, 
          href: '/dashboard/tests',
          color: 'bg-green-100 text-green-700'
        },
        { 
          name: 'Past Papers', 
          description: 'Review your previous attempts', 
          icon: History, 
          href: '/dashboard/past-papers',
          color: 'bg-purple-100 text-purple-700'
        },
      ]
    : [
        { 
          name: 'Dashboard', 
          description: 'View your learning progress', 
          icon: BarChart, 
          href: '/dashboard',
          color: 'bg-blue-100 text-blue-700'
        },
      ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isSchool 
              ? 'Manage your school, students, and exams' 
              : isStudent 
              ? 'Access your learning materials and tests'
              : 'Welcome to your dashboard'}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item) => (
            <Card key={item.name} className="overflow-hidden">
              <CardHeader className={`p-4 ${item.color}`}>
                <div className="flex items-center">
                  <item.icon className="h-6 w-6 mr-2" />
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardDescription className="text-gray-600 mb-4">
                  {item.description}
                </CardDescription>
                <Button onClick={() => navigate(item.href)} className="w-full">
                  Go to {item.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Welcome message and getting started tips */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Tips to help you get the most out of School-Student Nexus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isSchool && (
                <div className="space-y-2">
                  <h3 className="font-medium">For Schools:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Start by adding your students in the User Management section</li>
                    <li>Create examination papers by selecting questions from our database</li>
                    <li>Monitor student performance in the Reports section</li>
                  </ul>
                </div>
              )}
              
              {isStudent && (
                <div className="space-y-2">
                  <h3 className="font-medium">For Students:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Practice using Learning Mode to improve your skills</li>
                    <li>Take assigned tests in Test Mode</li>
                    <li>Review your past papers to track your progress</li>
                  </ul>
                </div>
              )}
              
              {!isSchool && !isStudent && (
                <div className="space-y-2">
                  <h3 className="font-medium">For Individual Users:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Explore learning materials and practice questions</li>
                    <li>Track your progress over time</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
