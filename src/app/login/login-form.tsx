'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prefillEmail = searchParams.get('email');
    if (prefillEmail) setEmail(prefillEmail);

    if (searchParams.get('registered') === 'true') {
      toast.success('Account created! Please sign in.');
    }

    if (searchParams.get('confirmed') === 'true') {
      toast.success('Email confirmed! You can now sign in.');
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
          toast.error('Please confirm your email before signing in. Check your inbox for the verification link.');
        } else if (msg.includes('invalid login credentials') || msg.includes('invalid email')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (msg.includes('user not found')) {
          toast.error('No account found with this email. Please register first.');
        } else {
          toast.error(error.message ?? 'Sign in failed');
        }
        return;
      }

      if (!data.user) {
        toast.error('Sign in failed. Please try again.');
        return;
      }

      toast.success('Signed in successfully!');
      // Small delay so Supabase session cookies are fully set before navigation
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);

    } catch (err) {
      console.error('Login error:', err);

      // TypeError: Failed to fetch → network unreachable or CORS block
      if (err instanceof TypeError) {
        toast.error('Network error — cannot reach the server. Check your connection and try again.');
      } else {
        const errorMsg = err instanceof Error ? err.message : '';
        if (errorMsg.toLowerCase().includes('fetch') || errorMsg.toLowerCase().includes('network')) {
          toast.error('Network error. Check your connection and try again.');
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary'>
            <Zap className='h-6 w-6 text-primary-foreground' />
          </div>
          <CardTitle className='text-2xl'>Welcome back</CardTitle>
          <CardDescription>Sign in to your ShortFlow AI account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                required
                autoComplete='email'
                disabled={loading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                required
                autoComplete='current-password'
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <p className='text-sm text-muted-foreground'>
              Don&apos;t have an account?{' '}
              <Link href='/register' className='text-primary hover:underline'>
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}