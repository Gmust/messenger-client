'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { registerUserValidator } from '@/lib/validations/register-user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/service/authService';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type formData = z.infer<typeof registerUserValidator>

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, setError, formState: { errors }, watch, reset } = useForm<formData>({
    resolver: zodResolver(registerUserValidator),
    mode: 'onChange'
  });

  const router = useRouter();

  const registerUser = async (data: formData) => {
    setIsLoading(true);
    try {
      const res = await authService.registerAccount(data);
      toast.success(res.Msg);
      reset();
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response!.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <Image src='/twitter.svg' className='mb-2' alt='logo' width={50} height={50} />
        <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
          Create account
        </h1>
        <div
          className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit(registerUser)}>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Your
                  email</label>
                <input type='email' id='email'  {...register('email', {})}
                       className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                       placeholder='Email' />
                <p className='text-sm text-red-600 mt-1'>
                  {errors.email?.message}
                </p>
              </div>
              <div>
                <label htmlFor='username' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Your
                  username</label>
                <input type='text' id='username'  {...register('name', { required: true })}
                       className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                       placeholder='CoolUsername' />
                <p className='text-sm text-red-600 mt-1'>
                  {errors.name?.message}
                </p>
              </div>
              <div>
                <label htmlFor='password'
                       className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Password</label>
                <input type='password' id='password' placeholder='••••••••'
                       {...register('password', { required: true })}
                       className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
                <p className='text-sm text-red-600 mt-1'>
                  {errors.password?.message}
                </p>
              </div>
              <div>
                <label htmlFor='confirm-password'
                       className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Confirm password</label>
                <input type='password' id='confirm-password'
                       placeholder='••••••••'{...register('confirmPassword', {
                  required: true,
                  validate: (val: string) => {
                    if (watch('password') != val) {
                      return 'Your passwords do no match';
                    }
                  }
                })}
                       className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
                <p className='text-sm text-red-600 mt-1'>
                  {errors.confirmPassword?.message}
                </p>
              </div>
              <Button className='w-full' type='submit' isLoading={isLoading}>Register</Button>
              <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                Already have an account?
                <Link href='/login'
                      className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer ml-2'>
                  Login
                  here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;