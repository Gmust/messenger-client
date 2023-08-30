import Image from 'next/image';

import { createImgUrl } from '@/lib';

interface ProfileImageProps {
  image: string,
  name: string,
  edit: boolean
}

export const ProfileImage = ({ image, name, edit }: ProfileImageProps) => {
  return (
    <div className='relative'>
      <div
        className='w-24 h-24 lg:w-48 lg:h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl sm:absolute sm:inset-x-0 sm:top-0
        sm:-mt-24 flex items-center justify-center text-indigo-500'>
       <Image src={createImgUrl(image)} alt={`${name} image`} fill referrerPolicy='no-referrer'
               className='rounded-full' />
      </div>
    </div>
  );
};

