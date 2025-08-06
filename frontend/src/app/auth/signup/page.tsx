'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authService, SignupData } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Music, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupData & { confirmPassword: string }>();
  const password = watch('password');

  const onSubmit = async (data: SignupData & { confirmPassword: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const { confirmPassword, ...signupData } = data;
      await authService.signup(signupData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/landing" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create your account
          </h2>
          <p className="text-slate-600">
            Join Music Level and start creating AI-powered music
          </p>
        </div>
        
        <Card variant="elevated" className="backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                icon={<User className="h-5 w-5" />}
                {...register('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                error={errors.name?.message}
              />
              
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={<Mail className="h-5 w-5" />}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                icon={<Lock className="h-5 w-5" />}
                helperText="Must be at least 6 characters"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
              />
              
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={<Lock className="h-5 w-5" />}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
              />
              
              <Button
                type="submit"
                loading={loading}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                Create Account
              </Button>
            </form>
            
            {/* Features */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">What you'll get:</h4>
              <div className="space-y-2">
                {[
                  'Unlimited AI music generation',
                  'Save and organize your compositions',
                  'Export as professional MIDI files',
                  'Access to all instruments'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Already have an account?</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="w-full">
                  Sign In Instead
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-slate-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}