
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database, UserPlus, Lock, Mail, User, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);
  
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleResendConfirmation = async () => {
    if (!confirmationEmail) return;
    
    try {
      setResendingEmail(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: confirmationEmail,
      });
      
      if (error) throw error;
      
      toast.success('Confirmation email resent. Please check your inbox.');
    } catch (error: any) {
      console.error('Error resending confirmation:', error);
      toast.error(`Error resending confirmation: ${error.message}`);
    } finally {
      setResendingEmail(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate inputs
      if (!email || !password || !fullName) {
        throw new Error('Please fill in all fields');
      }
      
      // Sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success('Account created successfully! Please check your email for confirmation link.');
      setConfirmationEmail(email);
      setShowConfirmationAlert(true);
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(`Error creating account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          console.log('Email not confirmed error:', error);
          setConfirmationEmail(email);
          setShowConfirmationAlert(true);
          throw new Error('Please confirm your email before signing in. Check your inbox for a confirmation link.');
        }
        
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
      navigate('/');
      
    } catch (error: any) {
      console.error('Sign in error details:', error);
      toast.error(`Error signing in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 rounded-full bg-blue-100">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Headless CMS</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showConfirmationAlert && (
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertTitle className="text-amber-800 flex items-center gap-2">
                Email Confirmation Required
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                <p className="mb-2">
                  Please check your inbox at <strong>{confirmationEmail}</strong> and click the confirmation link.
                </p>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleResendConfirmation}
                    disabled={resendingEmail}
                    className="text-amber-700 border-amber-300 hover:bg-amber-100"
                  >
                    {resendingEmail ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Resend confirmation email'
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">
                    <div className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      Password
                    </div>
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Full Name
                    </div>
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    <div className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      Password
                    </div>
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-gray-500 text-center">
            Secure authentication powered by Supabase
          </p>
          <p className="text-xs text-gray-400 text-center">
            For development purposes, you may want to disable email confirmation in the Supabase settings.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
