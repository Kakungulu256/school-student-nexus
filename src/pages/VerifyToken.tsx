
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Shield } from 'lucide-react';

export default function VerifyToken() {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user, verifySchoolToken } = useAuth();
  const navigate = useNavigate();

  // If user is not a school or is already verified, redirect to dashboard
  if (!user || user.userType !== 'school' || user.isVerified) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const isVerified = await verifySchoolToken(token);
      if (isVerified) {
        navigate('/dashboard');
      } else {
        setError('Invalid token. Please try again or contact support.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Shield className="h-8 w-8 text-education-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Verify Your School</CardTitle>
            <CardDescription className="text-center">
              Please enter the verification token provided by the site administrator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Verification Token</Label>
                  <Input
                    id="token"
                    placeholder="Enter verification token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">For testing purposes:</p>
                  <p>Use token "VALID_TOKEN" to verify your school account.</p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify School Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
