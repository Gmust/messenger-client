import { Dispatch, SetStateAction } from 'react';
import { Play } from 'lucide-react';

import { Message } from '@/types/chat';

interface VideoMessageProps {
  message: Message,
  setOpenedImg: Dispatch<SetStateAction<string>>,
  setOpenedVideo: Dispatch<SetStateAction<string>>,
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const VideoMessage = ({setOpenedVideo,message,setIsOpen,setOpenedImg}: VideoMessageProps) => {
  return (
    <div className='relative'>
      <video width={420} height={384} onPlay={() => {
      }} autoPlay={false} controls={false}
             onClick={(e) => {
               e.preventDefault();
               setOpenedImg('');
               setOpenedVideo(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`);
               setIsOpen(true);
             }} className='h-full'
      >
        <source src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`} />
      </video>
      <Play className='absolute bottom-2' />
    </div>
  );
};

