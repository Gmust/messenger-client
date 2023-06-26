'use client';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProviderProps) => {
  return (
    <>
      <SessionProvider>
        <Toaster position='top-center' reverseOrder={false} />
        {children}
      </SessionProvider>
    </>
  );
};

