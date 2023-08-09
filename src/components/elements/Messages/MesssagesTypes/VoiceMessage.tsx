import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { MessageType } from '@/types/enums';
import { AudioVisualizer } from 'react-audio-visualize';
import useSound from 'use-sound';
import { Play, StopCircle } from 'lucide-react';

export const VoiceMessage = ({ content, setMessageType }: {
  content: string,
  setMessageType?: Dispatch<SetStateAction<MessageType>>
}) => {
  const [voiceMessage, setVoiceMessage] = useState<Blob | null>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [play, {
    sound,
    pause,
    duration,
    stop
  }] = useSound(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`, {
    onend: () => {
      setIsPlaying(false);
    }
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`)
      .then(response => response.blob())
      .then(blob => {
        setVoiceMessage(blob);
      })
      .catch(error => {
        console.error('Error fetching the file:', error);
      });
  }, []);

  return (
    <div className='flex items-center bg-violet-500'>
      {
        isPlaying ?
          <StopCircle className='cursor-pointer' onClick={() => {
            pause();
            setIsPlaying(false);
          }} />
          :
          <Play className='cursor-pointer' onClick={() => {
            play();
            setIsPlaying(true);
          }} />
      }
      <AudioVisualizer height={50} width={200} blob={voiceMessage!} barColor={'white'} />
    </div>
  );
};