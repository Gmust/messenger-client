'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';

import { Button } from '@/components/shared/Button';
import { loginUserValidator } from '@/lib/validations/login-user';


type formData = z.infer<typeof loginUserValidator>

const Page = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<formData>({
    resolver: zodResolver(loginUserValidator)
  });

  const router = useRouter();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (e) {
      toast.error('Something went wrong with your login.');
    } finally {
      setIsLoading(false);
    }
  };


  const loginWithCredentials = async ({ email, password }: formData) => {
      if (!email) return setError('email', { type: 'required', message: 'Provide email' });
      if (!password) return setError('password', { type: 'required', message: 'Provide password' });
      setIsLoading(true);
      signIn('credentials',
        { email, password, redirect: true })
        // @ts-ignore
        .then(({ ok, error }) => {
          if (ok) {
            router.push('/dashboard');
          } else {
            console.log(error);
            toast.error('Credentials do not match!');
          }
        })
        .finally(() => setIsLoading(false))
      ;
    }
  ;

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

          <div className='w-full max-w-xs'>
            <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
                  onSubmit={handleSubmit(loginWithCredentials)}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                  Email
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                   focus:outline-none focus:shadow-outline' id='email' placeholder='Email' type='email'
                  {...register('email', { required: true })}
                />
                <p className='text-sm text-red-600 mt-1'>
                  {errors.email?.message}
                </p>
              </div>
              <div className='mb-6'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                  Password
                </label>
                <input
                  className='shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3
                  leading-tight focus:outline-none focus:shadow-outline' id='password'
                  placeholder='******************' type='password' {...register('password', { required: true })}
                />
                <p className='text-sm text-red-600 mt-1'>
                  {errors.password?.message}
                </p>
              </div>
              <div className='flex items-center justify-between'>
                <Button isLoading={isLoading} type='submit'>
                  Log in
                </Button>
                <Link
                  className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer'
                  href='#'>
                  Forgot Password?
                </Link>
              </div>
              <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                Already have an account?
                <Link href='/registration'
                      className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer ml-2'>
                  Register
                  here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );

};

export default Page;