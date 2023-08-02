'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

import { UserCard } from '@/components/elements/UserCard/UserCard';
import { userService } from '@/service/userService';

export const SearchUsers = () => {

  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<User[]>([]);

  const handleFindUser = async (str: string) => {
    setLoading(true);
    try {
      const result = await userService.searchUsers(session?.user.access_token!, str, str);
      setResults(result.fiter((user: User) => user._id !== session?.user.id));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='block text-sm font-medium text-gray-900'>
        Find user by email or name
      </label>
      <input type='text'
             className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-m ring-1 ring-inset ring-gray-300
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
             placeholder='you@example.com || coolname' onChange={(e) => handleFindUser(e.target.value)}
      />
      <div>
        {results.length > 0 ?
          <ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
            {results.map((user) => <UserCard {...user} key={user._id} />)}
          </ul>
          : <div>Nothing to show </div>
        }
      </div>
    </div>

  );
};

