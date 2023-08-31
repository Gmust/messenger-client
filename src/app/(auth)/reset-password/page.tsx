import React from 'react';

import { ResetPassword } from '@/components/elements/ResetPassword';

export default function page({
                               params,
                               searchParams
                             }: {
  params: { token: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <ResetPassword token={searchParams.token as string} />
    </div>
  );
}
