
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, FileText, BarChart as BarChartIcon, Book, FileQuestion } from 'lucide-react';

// Mock data for school analytics
const schoolStats = {
  totalStudents: 78,
  activeStudents: 72,
  totalPapers: 15,
  paperAttempts: 320
};

// Mock data for subject performance
const subjectPerformanceData = [
  { subject: 'Math', avgScore: 72 },
  { subject: 'English', avgScore: 68 },
  { subject: 'Science', avgScore: 75 },
  { subject: 'SST', avgScore: 81 }
];

// Mock data for paper templates
const paperTemplates = [
  { id: '1', title: 'Math Mid-Term', questions: 20, subject: 'Math' },
  { id: '2', title: 'English Grammar', questions: 15, subject: 'English' },
  { id: '3', title: 'Science Quiz', questions: 10, subject: 'Science' },
  { id: '4', title: 'SST History Test', questions: 12, subject: 'SST' }
];

// Mock data for student subjects
const studentSubjects = [
  { id: '1', name: 'Math', color: '#1E88E5', icon: <Book className="h-5 w-5" /> },
  { id: '2', name: 'English', color: '#26A69A', icon: <Book className="h-5 w-5" /> },
  { id: '3', name: 'Science', color: '#66BB6A', icon: <Book className="h-5 w-5" /> },
  { id: '4', name: 'SST', color: '#7E57C2', icon: <Book className="h-5 w-5" /> }
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'learning' | 'test' | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Handle school verification
    if (user.userType === 'school' && !user.isVerified) {
      navigate('/verify-token');
    }
    
    /* Appwrite Implementation
    // Check user permissions
    const checkPermissions = async () => {
      try {
        // Fetch user roles from Appwrite
        const userRoles = await databases.listDocuments(
          DATABASE_ID,
          USER_ROLES_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        
        // Redirect based on role
        if (userRoles.documents[0].role === 'school') {
          // Check verification
          if (!userRoles.documents[0].isVerified) {
            navigate('/verify-token');
          }
        }
      } catch (error) {
        console.error('Permission check failed:', error);
      }
    };
    
    checkPermissions();
    */
  }, [user, navigate]);
  
  // Go back to subject selection
  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedMode(null);
  };

  // Handle study mode selection
  const handleModeSelect = (mode: 'learning' | 'test') => {
    setSelectedMode(mode);
    if (mode === 'learning') {
      navigate('/dashboard/learning');
    } else {
      navigate('/dashboard/tests');
    }
  };

  // Display different dashboard based on user type
  const renderDashboardContent = () => {
    if (!user) return null;
    
    switch (user.userType) {
      case 'school':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">School Dashboard</h2>
            
            {/* School analytics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-10 w-10 text-education-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <h3 className="text-2xl font-bold">{schoolStats.totalStudents}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-10 w-10 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                      <h3 className="text-2xl font-bold">{schoolStats.activeStudents}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-10 w-10 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Papers</p>
                      <h3 className="text-2xl font-bold">{schoolStats.totalPapers}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileQuestion className="h-10 w-10 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Paper Attempts</p>
                      <h3 className="text-2xl font-bold">{schoolStats.paperAttempts}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Subject Performance Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Average Subject Performance</CardTitle>
                    <CardDescription>
                      Average scores across all papers by subject
                    </CardDescription>
                  </div>
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          content={(data) => (
                            <div className="text-sm">
                              <div className="font-bold">{data.label}</div>
                              <div className="text-muted-foreground">
                                Average: {data.payload && data.payload[0] ? data.payload[0].value : 0}%
                              </div>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="avgScore" fill="#1E88E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Paper Templates */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Paper Templates</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {paperTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <CardDescription>
                        {template.subject} • {template.questions} Questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" variant="outline" className="w-full">
                        Edit Paper
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'student':
        if (!selectedSubject) {
          // Subject selection view
          return (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Student Dashboard</h2>
              <h3 className="text-xl">Select a subject to start</h3>
              
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {studentSubjects.map((subject) => (
                  <Card 
                    key={subject.id}
                    className="cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setSelectedSubject(subject.id)}
                    style={{ borderTopColor: subject.color, borderTopWidth: '4px' }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        {subject.icon}
                        <Button variant="ghost" size="sm">
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        } else if (!selectedMode) {
          // Mode selection view after subject is selected
          const subject = studentSubjects.find(s => s.id === selectedSubject);
          
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleBackToSubjects}>
                  <span className="sr-only">Back</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </Button>
                <h2 className="text-3xl font-bold">
                  {subject?.name}
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleModeSelect('learning')}>
                  <CardHeader>
                    <CardTitle>Learning Mode</CardTitle>
                    <CardDescription>
                      Study at your own pace with guided lessons and practice questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Book className="h-16 w-16 text-education-primary mb-4" />
                    <p>Features:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Step-by-step explanations</li>
                      <li>Practice questions</li>
                      <li>Immediate feedback</li>
                      <li>No time limits</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleModeSelect('test')}>
                  <CardHeader>
                    <CardTitle>Test Mode</CardTitle>
                    <CardDescription>
                      Challenge yourself with timed tests to assess your knowledge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileText className="h-16 w-16 text-amber-500 mb-4" />
                    <p>Features:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Timed assessments</li>
                      <li>Simulates exam conditions</li>
                      <li>Results and analysis</li>
                      <li>Performance tracking</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        }
        return null;
        
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Welcome to School-Student Nexus</h2>
            <p className="text-lg">Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}
