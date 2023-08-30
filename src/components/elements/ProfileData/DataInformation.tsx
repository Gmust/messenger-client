import { useState } from 'react';
import { saveAs } from 'file-saver';
import Image from 'next/image';

import { FilesList } from '@/components/elements/ProfileData/FilesList';
import { ImagesList } from '@/components/elements/ProfileData/ImagesList';
import { UserCard } from '@/components/elements/UserCard/UserCard';
import { Button } from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { useAxiosAuth } from '@/lib/hooks';
import { AllUserFiles, User } from '@/types/user';


export const DataInformation = ({ friends, userFiles }: { friends: User[], userFiles: AllUserFiles }) => {

  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openedImg, setOpenedImg] = useState<string>('');

  return (
    <div className='grid grid-cols-3 text-center order-last md:order-first mt-10 sm:mt-20 md:mt-0'>
      <div className='flex items-center w-full justify-between mx-auto space-x-10'>
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
          <ImagesList imageMessages={userFiles.imageMessages} loading={loading} setIsOpen={setIsOpen}
                      setOpenedImg={setOpenedImg} />
        </>
        <>
          <FilesList fileMessages={userFiles.fileMessages} loading={loading} />
        </>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} setOpenedImg={setOpenedImg}>
        <div onClick={e => {
          e.preventDefault();
          openedImg && setOpenedImg('');
        }}>
          <div
            className='relative h-80 w-80 min-h-[240px] min-w-[240px] sm:min-w-[384px] sm:min-h-[384px] sm:h-full sm:w-full '>
            <Image src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${openedImg}`} alt={openedImg} fill />
          </div>
          <div className='mt-6 cursor-pointer'>
            <Button onClick={(e) => {
              e.preventDefault();
              saveAs(
                `${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${openedImg}`,
                `openedImg`
              );
            }}>Download</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

