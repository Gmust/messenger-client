'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import { resetPasswordValidator } from '@/lib/validations/reset-password';
import { authService } from '@/service/authService';

interface ResetPasswordInputs {
  password: string,
  confirmPassword: string
}

export const ResetPassword = ({ token }: { token: string }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordInputs>({ resolver: zodResolver(resetPasswordValidator) });
  const router = useRouter();

  const resetPassword = async ({ confirmPassword, password }: ResetPasswordInputs) => {
    setLoading(true);
    try {
      const res = await authService.resetPassword(
        { newPassword: password, confirmPassword: confirmPassword, token: token }
      );
      toast.success(`${res.Msg}. You will be redirected in 1 second`);
      setTimeout(() => {
        router.replace('/login');
      }, 1000);
    } catch (e: any) {
      if (e instanceof AxiosError) {
        toast.error(e.response!.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <Image src='/twitter.svg' alt='logo' width={50} height={50} className='mt-5'
      />
      <div
        className='w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8'>
        <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
          Recover Password
        </h2>
        <form className='mt-4 space-y-4 lg:mt-5 md:space-y-5' onSubmit={handleSubmit(resetPassword)}>
          <div>
            <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>New
              Password</label>
            <input type='password' id='password' {...register('password', {})}
                   className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                   placeholder='********' />
            <p className='text-sm text-red-600 mt-1'>
              {errors.password?.message}
            </p>
          </div>
          <div>
            <label htmlFor='confirmPassword' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Confirm
              Password</label>
            <input type='password' id='confirmPassword' {...register('confirmPassword', {})}
                   className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                   placeholder='********' />
            <p className='text-sm text-red-600 mt-1'>
              {errors.password?.message}
            </p>
          </div>
          <Button type='submit' isLoading={loading}>
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

