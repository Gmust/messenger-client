import { Dispatch, SetStateAction } from 'react';
import { Download } from 'lucide-react';

import { AudioPlayer } from '@/components/shared/AudioPlayer';

export const AudioMessage = ({ content, setMessageType }: {
  content: string,
  setMessageType?: Dispatch<SetStateAction<'text' | 'image' | 'video' | 'audio' | 'geolocation'>>
}) => {
  return (
    <div className='flex'>
      <AudioPlayer setMessageType={setMessageType!} type={'message'} content={content} />
    </div>
  );
};

