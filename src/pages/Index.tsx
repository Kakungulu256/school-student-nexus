
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-16 py-8">
        {/* Hero section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            School-Student Nexus
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive platform connecting schools and students for enhanced learning and assessment
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-education-primary hover:bg-education-primary/90"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Already have an account? Login
            </Button>
          </div>
        </div>

        {/* Key features section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <School className="h-8 w-8 text-education-primary mb-2" />
                <CardTitle>School Management</CardTitle>
                <CardDescription>
                  Comprehensive tools for school administrators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Student account management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Bulk upload of student data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Custom paper setting for exams</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Detailed performance reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-education-secondary mb-2" />
                <CardTitle>Student Experience</CardTitle>
                <CardDescription>
                  Engaging learning tools for students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Interactive learning mode with multiple question types</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Formal test mode for assessments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to past papers and results</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Progress tracking across subjects</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <svg
                  className="h-8 w-8 text-education-accent mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <CardTitle>Subjects & Assessments</CardTitle>
                <CardDescription>
                  Comprehensive subject coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Mathematics with interactive problems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>English language and comprehension</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Science with visual explanations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Social Studies (SST) with comprehensive content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-education-primary to-education-secondary rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join School-Student Nexus today and transform the educational experience for your school or yourself.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/signup')}
            className="bg-white text-education-primary hover:bg-gray-100"
          >
            Sign Up Now
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
