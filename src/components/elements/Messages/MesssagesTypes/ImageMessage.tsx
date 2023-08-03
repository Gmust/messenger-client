import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { Message } from '@/types/chat';

interface ImageMessageProps {
  message: Message,
  setOpenedImg: Dispatch<SetStateAction<string>>,
  setOpenedVideo: Dispatch<SetStateAction<string>>,
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ImageMessage = ({setOpenedVideo,message,setIsOpen,setOpenedImg,}:ImageMessageProps) => {
  return (
    <Image src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`}
           alt={`${message.content} picture`} width={300} height={300}
           onClick={() => {
             setOpenedVideo('');
             setOpenedImg(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`);
             setIsOpen(true);
           }} />
  );
};

