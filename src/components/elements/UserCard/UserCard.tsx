import Image from 'next/image';
import Link from 'next/link';

import { createImgUrl } from '@/lib';

export const UserCard = ({ _id, image, bio, email, friends, name }: Omit<User, 'refresh_token' | 'access_token'>) => {
  return (
    <li className='pt-3 pb-0 sm:pt-4 hover:bg-gray-100 rounded-md'>
      <Link href={`http://localhost:3000/dashboard/profile/${_id}`} replace={true}>
        <div className='flex items-center space-x-4'>
          <div className='flex-shrink-0'>
            <Image className='w-8 h-8 rounded-full' height={32} width={32} src={createImgUrl(image)}
                   alt={`${email} image`} />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
              {name}
            </p>
            <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
              {email}
            </p>
          </div>

        </div>
      </Link>
    </li>
  );
};

