'use client';

import { useSearchParams } from 'next/navigation';

const Page = async () => {

  const searchParams = useSearchParams();
  const email = searchParams?.get('email');

  return (
    <div>
      {email}
    </div>
  );
};

export default Page;