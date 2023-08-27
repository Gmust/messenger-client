import Image from 'next/image';

import { Message } from '@/types/chat';

type ImageMessageCard = Pick<Message, 'content' | 'timestamp'> & {
  loading: boolean
}

export const ImageMessageCard = ({ content, timestamp, loading }: ImageMessageCard) => {
  return (
    <>
      <div className='w-24 h-24'>
        <div className='relative w-20 h-20'>
          <Image src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`} alt={content} fill />
        </div>
      </div>
    </>
  );
};

