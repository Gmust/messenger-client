'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import Link from 'next/link';

interface FriendRequestsSidebarOption {
  initialUnseenRequestsCount: number;
  userId: string;
}

export const FriendRequestsSidebarOption = ({ initialUnseenRequestsCount, userId }: FriendRequestsSidebarOption) => {

  const [unseenRequestsCount, setUnseenRequestsCount] = useState<number>(initialUnseenRequestsCount);
  const router = useRouter();

  return (
    <Link href='/dashboard/friend-requests'
          className='text-gray-700 hover:text-violet-700 hover:bg-gray-50 group flex
                    items-center gap-x-3 rounded-md p-2 text-base leading-6 font-semibold'>
      <div className='text-gray-400 border-gray-200 group-hover:border-violet-700 group-hover:text-violet-700 flex h-6 w-6
                      shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
        <User className='h-4 w-4' />
      </div>
      <p className='truncate'>Friend requests</p>
      {unseenRequestsCount > 0 ?
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-violet-700'>
          {unseenRequestsCount}
        </div>
        : null
      }
    </Link>
  );
};

