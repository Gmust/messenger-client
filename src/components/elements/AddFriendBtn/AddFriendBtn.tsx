'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { z } from 'zod';

import { Button } from '@/components/shared/Button';
import { useAxiosAuth } from '@/lib/hooks';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { userService } from '@/service/userService';

type FormData = z.infer<typeof addFriendValidator>

export const AddFriendBtn = () => {

  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, resetField, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator)
  });
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const axiosAuth = useAxiosAuth();

  const addFriend = async ({ email }: FormData) => {
    setLoading(true);
    try {
      const { email: validatedEmail } = addFriendValidator.parse({ email });
      await userService.addFriend({
        friendEmail: validatedEmail,
        userId: session?.user.id!,
        axiosInstance: axiosAuth
      });
      setShowSuccessState(true);
      resetField('email');
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError('email', {
          message: e.message
        });
        return;
      }
      if (e instanceof AxiosError) {
        setError('email', {
          message: e.response!.data.message
        });
        return;
      }
      setError('email', {
        message: 'Something went wrong'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='max-w-sm' onSubmit={handleSubmit(addFriend)}>
      <label htmlFor='email' className='block text-sm font-medium text-gray-900'>
        Add friend by E-Mail
      </label>
      <div className='mt-2 flex gap-4 '>
        <input type='text'
               {...register('email', {})}
               className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-m ring-1 ring-inset ring-gray-300
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
               placeholder='you@example.com'
        />
        <Button isLoading={loading}>Add</Button>
      </div>
      <p className='text-sm text-red-600 mt-1'>
        {errors.email?.message}
      </p>
      {showSuccessState && <p className='text-sm text-green-600 mt-1'>
        Friend request sent!
      </p>}
    </form>
  );
};

