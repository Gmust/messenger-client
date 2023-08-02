import { useState } from 'react';
import { PauseOctagon, PlaySquare, X } from 'lucide-react';
import useSound from 'use-sound';

import { FileInputProps } from '@/types/chat';

export const AudioInput = ({ file, setFile, setSelectedDataURL, selectedDataURL }: FileInputProps) => {

  const [play, { pause }] = useSound(selectedDataURL);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleStop = () => {
    setIsPlaying(false);
    pause();
  };

  const handlePlay = () => {
    setIsPlaying(true);
    play();
  };

  return (
    <div className='flex'>
      <div className='h-12 w-12 bg-fuchsia-600 flex justify-center items-center'>
        {
          isPlaying ?
            <PauseOctagon onClick={handleStop} />
            :
            <PlaySquare onClick={handlePlay} />
        }
      </div>
      <div className='flex truncate max-w-md'>
        {file?.name}
        <X className='text-red-700' onClick={() => {
          setFile(null);
          setSelectedDataURL(null);
        }} />
      </div>
    </div>
  );
};

