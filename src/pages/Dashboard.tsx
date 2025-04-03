
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, FileText, BarChart as BarChartIcon, Book, FileQuestion } from 'lucide-react';

// Mock data for school analytics
const schoolAnalyticsData = {
  totalStudents: 245,
  activeStudents: 218,
  totalPapers: 32,
  totalAttempts: 1876
};

// Mock data for subject performance
const subjectPerformanceData = [
  { subject: 'Math', averageScore: 72 },
  { subject: 'English', averageScore: 78 },
  { subject: 'Science', averageScore: 65 },
  { subject: 'SST', averageScore: 81 }
];

// Mock data for paper setting templates
const paperTemplates = [
  { id: 1, name: 'End of Term Math Test', questionsCount: 50, timeLimit: 120, subject: 'Math' },
  { id: 2, name: 'English Grammar Quiz', questionsCount: 30, timeLimit: 60, subject: 'English' },
  { id: 3, name: 'Science Mid-Term', questionsCount: 45, timeLimit: 90, subject: 'Science' },
];

// Mock data for student subjects
const studentSubjects = [
  { id: 'math', name: 'Mathematics', icon: '📐', color: 'bg-blue-100 text-blue-700' },
  { id: 'english', name: 'English Language', icon: '📚', color: 'bg-green-100 text-green-700' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'bg-purple-100 text-purple-700' },
  { id: 'sst', name: 'Social Studies', icon: '🌍', color: 'bg-orange-100 text-orange-700' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  
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

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedMode('');
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    navigate(mode === 'learning' ? '/dashboard/learning' : '/dashboard/tests');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isSchool 
              ? 'School performance overview and quick actions' 
              : isStudent 
              ? 'Choose a subject to begin learning or take a test'
              : 'Welcome to your dashboard'}
          </p>
        </div>
        
        {/* School Admin Dashboard */}
        {isSchool && (
          <>
            {/* Analytics Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-education-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolAnalyticsData.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <UserCheck className="h-4 w-4 text-education-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolAnalyticsData.activeStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((schoolAnalyticsData.activeStudents / schoolAnalyticsData.totalStudents) * 100)}% of total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
                  <FileText className="h-4 w-4 text-education-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolAnalyticsData.totalPapers}</div>
                  <p className="text-xs text-muted-foreground">
                    +3 in the last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Student Attempts</CardTitle>
                  <BarChartIcon className="h-4 w-4 text-education-info" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schoolAnalyticsData.totalAttempts}</div>
                  <p className="text-xs text-muted-foreground">
                    +124 from last week
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Subject Performance Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>
                  Average performance across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer 
                    config={{
                      subject: { theme: { light: '#4f46e5', dark: '#6366f1' } }
                    }}
                  >
                    <BarChart data={subjectPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <Bar dataKey="averageScore" name="Average Score" fill="var(--color-subject)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Paper Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Paper Templates</CardTitle>
                <CardDescription>
                  Create a new exam paper quickly using these templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paperTemplates.map((template) => (
                    <div 
                      key={template.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.questionsCount} questions • {template.timeLimit} minutes • {template.subject}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => navigate('/dashboard/papers')}>
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Student Dashboard */}
        {isStudent && (
          <>
            {!selectedSubject ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {studentSubjects.map((subject) => (
                  <Card 
                    key={subject.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSubjectSelect(subject.id)}
                  >
                    <CardHeader className={`flex flex-row items-center gap-2 ${subject.color}`}>
                      <span className="text-2xl">{subject.icon}</span>
                      <CardTitle>{subject.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="min-h-10">
                        Select to begin learning or take a test in {subject.name}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !selectedMode ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedSubject('')}>Back</Button>
                  <h2 className="text-xl font-semibold">
                    {studentSubjects.find(s => s.id === selectedSubject)?.name}
                  </h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleModeSelect('learning')}>
                    <CardHeader className="pb-2 bg-blue-100">
                      <div className="flex items-center gap-2">
                        <Book className="h-6 w-6 text-blue-700" />
                        <CardTitle className="text-lg">Learning Mode</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-gray-600 mb-4">
                        Practice with interactive questions including multiple choice, 
                        checkbox, and drag & drop formats.
                      </CardDescription>
                      <Button className="w-full">Start Learning</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleModeSelect('tests')}>
                    <CardHeader className="pb-2 bg-purple-100">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-6 w-6 text-purple-700" />
                        <CardTitle className="text-lg">Test Mode</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-gray-600 mb-4">
                        Take official tests assigned by your teachers with timed sessions 
                        and graded results.
                      </CardDescription>
                      <Button className="w-full">Start Test</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
