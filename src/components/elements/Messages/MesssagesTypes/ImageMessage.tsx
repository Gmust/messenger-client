import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { Message } from '@/types/chat';

interface ImageMessageProps {
  message: Message,
  setOpenedImg: Dispatch<SetStateAction<string>>,
  setOpenedVideo: Dispatch<SetStateAction<string>>,
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ImageMessage = ({ setOpenedVideo, message, setIsOpen, setOpenedImg }: ImageMessageProps) => {
  return (
    <div className='relative w-52 h-72 sm:w-72 sm:h-96'>
      <Image src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`}
             alt={`${message.content} picture`} fill={true}
             sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
             onClick={() => {
               setOpenedVideo('');
               setOpenedImg(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`);
               setIsOpen(true);
             }} />
    </div>
  );
};

