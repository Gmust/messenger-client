import { useState } from 'react';

import { UserCard } from '@/components/elements/UserCard/UserCard';
import { useAxiosAuth } from '@/lib/hooks';
import { AllUserFiles, User } from '@/types/user';
import { DropdownList } from '@/components/shared/Dropdown';
import { Menu } from '@headlessui/react';
import { ImageMessageCard } from '@/components/shared/ImageMessageCard';


export const DataInformation = ({ friends, userFiles }: { friends: User[], userFiles: AllUserFiles }) => {

  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className='grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0'>
      <>
        <div
          className='peer hover:bg-gray-300 text-white cursor-pointer'>
          <p className='font-bold text-gray-700 text-xl'>{friends.length}</p>
          <p className='text-gray-400'>Friends</p>
        </div>
        <ul
          className='p-2 hidden absolute peer-hover:flex hover:flex w-[200px] mt-12 flex-col bg-white drop-shadow-lg
        divide-y max-h-52 overflow-auto scroll-auto'>
          {friends.map((friend) => <UserCard {...friend} key={friend._id} />)}
        </ul>
      </>
      <>
        <DropdownList count={userFiles.imageMessages.length} title='Images'>
          {userFiles.imageMessages.map((message) =>
            <Menu.Item key={message._id}>
              <ImageMessageCard content={message.content} key={message._id}
                                timestamp={message.timestamp}
                                loading={loading} />
            </Menu.Item>
          )}
        </DropdownList>
        {/*<div*/}
        {/*  className='hover:bg-gray-300 text-white cursor-pointer'>*/}
        {/*  <p className='font-bold text-gray-700 text-xl'>{userFiles.imageMessages.length}</p>*/}
        {/*  <p className='text-gray-400'>Images</p>*/}
        {/*</div>*/}
        {/*<ul*/}
        {/*  className='p-2 hidden absolute peer-hover:flex hover:flex w-[400px] mt-12 flex-col bg-white drop-shadow-lg*/}
        {/*divide-y max-h-52 overflow-auto scroll-auto'>*/}
        {/*  {userFiles.imageMessages.map((message) =>*/}
        {/*    <ImageMessageCard content={message.content} key={message._id}*/}
        {/*                      timestamp={message.timestamp}*/}
        {/*                      loading={loading} />)}*/}
        {/*</ul>*/}
      </>
      <div>
        <p className='font-bold text-gray-700 text-xl'>89</p>
        <p className='text-gray-400'>Files</p>
      </div>
    </div>
  );
};

