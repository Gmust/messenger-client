import React from 'react';
import { ForgotPassword } from '@/components/elements/ForgotPassword';

export default function page({
                               params,
                               searchParams
                             }: {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <ForgotPassword />
    </section>
  );
}
