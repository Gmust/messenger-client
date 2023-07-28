'use client';

import { ButtonHTMLAttributes, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/shared/Button';

interface SignOutBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

export const SignOutBtn = ({ ...props }: SignOutBtnProps) => {

  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const router = useRouter();


  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (e) {
      toast.error('There was a problem signing out!');
    } finally {
      setIsSigningOut(false);
    }
  };


  return <Button {...props} variant='ghost' onClick={handleSignOut}>
    {isSigningOut ? <Loader2 className='animate-spin h-4 w-4' /> : <LogOut className='w-4 h-4' />}
  </Button>;
};

