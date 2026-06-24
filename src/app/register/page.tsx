'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Zap, Loader2, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? 'Registration failed');
        setLoading(false);
        return;
      }

      // Show the "check your email" screen
      setEmailSent(true);
    } catch (err) {
      console.error('Register error:', err);
      toast.error('Network error. Check your connection and try again.');
      setLoading(false);
    }
  }

  // ── Email sent confirmation screen ──────────────────────────────────────────
  if (emailSent) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background p-4'>
        <Card className='w-full max-w-md text-center'>
          <CardHeader>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
              <MailCheck className='h-8 w-8 text-primary' />
            </div>
            <CardTitle className='text-2xl'>Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to{' '}
              <span className='font-medium text-foreground'>{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 text-sm text-muted-foreground'>
            <p>Click the link in the email to verify your account.</p>
            <p>After confirming, you can sign in to your account.</p>
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <Button asChild className='w-full'>
              <Link href='/login'>Go to Sign In</Link>
            </Button>
            <p className='text-xs text-muted-foreground'>
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                className='text-primary underline underline-offset-2'
                onClick={() => setEmailSent(false)}
              >
                try again
              </button>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────────────────────────
  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary'>
            <Zap className='h-6 w-6 text-primary-foreground' />
          </div>
          <CardTitle className='text-2xl'>Create account</CardTitle>
          <CardDescription>Start scheduling your short-form videos</CardDescription>
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
                autoComplete='new-password'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='••••••••'
                required
                autoComplete='new-password'
              />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              Create Account
            </Button>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link href='/login' className='text-primary hover:underline'>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
