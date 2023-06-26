'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Page = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('test3@gmail.com');
  const [password, setPassword] = useState<string>('password');
  const router = useRouter();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
      // router.replace('http://localhost:8080/auth/google/login')
    } catch (e) {
      toast.error('Something went wrong with your login.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async () => {
    setIsLoading(true);
    try {
      await signIn('credentials', { email, password });
      // router.replace('http://localhost:8080/auth/google/login')
    } catch (e) {
      toast.error('Something went wrong with your login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full flex flex-col items-center max-w-md space-y-8'>
          <div className='flex flex-col items-center'>
            <Image src='/twitter.svg' alt='logo' width={50} height={50} />
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              Sign in to your account
            </h2>
          </div>
          <Button isLoading={isLoading} type='button' className='max-w-sm mx-auto w-full text-2xl space-x-2'
                  onClick={loginWithGoogle}>
            {
              isLoading ? null :
                <Image src={'GoogleLogo.svg'} alt={'google logo'} width={20} height={20} />
            }
            <span>Google</span>
          </Button>

          <div>
            <input name='email' type='email' value={email} onChange={e => setEmail(e.currentTarget.value)} />
            <input name='password' type='password' value={password}
                   onChange={e => setPassword(e.currentTarget.value)} />
            <Button isLoading={isLoading} type='button' onClick={loginWithCredentials}>
              Log in
            </Button>
          </div>
        </div>
      </div>
    </>
  );

};

export default Page;