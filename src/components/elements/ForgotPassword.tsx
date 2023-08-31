'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import { forgotPassword } from '@/lib/validations/forgot-password';
import { authService } from '@/service/authService';

interface ForgotPasswordInput {
  email: string;
}

export const ForgotPassword = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<ForgotPasswordInput>({ mode: 'onSubmit', resolver: zodResolver(forgotPassword) });

  const router = useRouter();

  const handleForgotPassword = async ({ email }: ForgotPasswordInput) => {
    if (!email) return setError('email', { type: 'required', message: 'Provide email' });
    setLoading(true);
    console.log(email);
    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.Msg);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        toast.error(e.response!.data.message);
      } else {
        toast.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <div className='flex flex-row justify-start align-baseline w-2/5 mb-5'>
        <ArrowLeft className='text-fuchsia-600 cursor-pointer hover:text-fuchsia-500 transform transition duration-200'
                   onClick={() => router.back()}
                   width={40} height={40} />
        <div className='flex flex-row justify-center w-full'>
          <Image src='/twitter.svg' alt='logo' width={50} height={50}
          />
        </div>
      </div>
      <div
        className='w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8'>
        <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
          Recover Password
        </h2>
        <form className='mt-4 space-y-4 lg:mt-5 md:space-y-5' onSubmit={handleSubmit(handleForgotPassword)}>
          <div>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Your
              email</label>
            <input type='email' id='email' {...register('email', {})}
                   className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                   placeholder='name@company.com' />
            <p className='text-sm text-red-600 mt-1'>
              {errors.email?.message}
            </p>
          </div>

          <Button type='submit' isLoading={loading}>
            Send recovery link
          </Button>
        </form>
      </div>
    </div>
  );
};

