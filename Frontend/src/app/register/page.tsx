'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth/register-form';
import { ThemeToggle } from '@/components/theme-toggle';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAndRedirect = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const response = await api.get('/auth/verify');
        if (response.data.valid) {
          router.push('/notes');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setChecking(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setChecking(false);
      }
    };

    verifyAndRedirect();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <RegisterForm />
    </div>
  );
}


