import { Dispatch, SetStateAction } from 'react';
import { Pointer } from 'lucide-react';

import { Message } from '@/types/chat';

interface GeoMessageProps {
  setOpenedMap: Dispatch<SetStateAction<Message | null>>;
  message: Message | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const GeoMessage = ({ message, setOpenedMap, setIsOpen }: GeoMessageProps) => {

  return (
    <div
      className='z-10 bg-violet-50 flex flex-col justify-center items-center p-2 w-40 h-40 sm:w-64 sm:h-64 cursor-pointer'
      onClick={() => {
        setOpenedMap(message!);
        setIsOpen(true);
      }}>
      <span className='text-black text-lg'>Click to open map</span>
      <Pointer className='text-fuchsia-600  ' />
    </div>
  );
};

