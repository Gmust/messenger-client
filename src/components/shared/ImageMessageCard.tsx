import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { formatTimeToDate } from '@/lib';
import { Message } from '@/types/chat';

type ImageMessageCard = Pick<Message, 'content' | 'timestamp'> & {
  loading: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  setOpenedImg: Dispatch<SetStateAction<string>>,
  close: () => void
}

export const ImageMessageCard = ({ content, timestamp, loading, setIsOpen, setOpenedImg, close }: ImageMessageCard) => {

  const handleOpenImage = () => {
    setIsOpen(true);
    setOpenedImg(content);
    close();
  };

  return (
    <>
      <div className='w-24 h-24 sm:ml-1'>
        <div className='relative w-20 h-20 cursor-pointer' onClick={handleOpenImage}>
          <Image src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`} alt={content} fill />
          <div className='absolute text-fuchsia-800 text-xs'>{formatTimeToDate(timestamp!)}</div>
        </div>
      </div>
    </>
  );
};

