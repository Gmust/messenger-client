import { Dispatch, SetStateAction } from 'react';

import { AudioPlayer } from '@/components/shared/AudioPlayer';
import { MessageType } from '@/types/enums';

export const VoiceMessage = ({ content, setMessageType }: {
  content: string,
  setMessageType?: Dispatch<SetStateAction<MessageType>>
}) => {
  return (
    <div className='flex'>
      <AudioPlayer setMessageType={setMessageType!} type={'message'} content={content} />
      Voice
    </div>
  );
};