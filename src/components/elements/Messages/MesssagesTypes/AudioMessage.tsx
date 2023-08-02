import { useState } from 'react';
import { PauseOctagon, PlaySquare } from 'lucide-react';
import useSound from 'use-sound';


export const AudioMessage = ({ content }: { content: string }) => {

  const [play, { pause, duration, sound }] = useSound(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleStop = () => {
    setIsPlaying(false);
    pause();
  };

  const handlePlay = () => {
    setIsPlaying(true);
    play();


  };

  function millisecondsToTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const timeString = millisecondsToTime(duration!);

  return (
    <div className='flex flex-col'>
      <div className='flex  space-x-4 flex items-center'>
        <div className='h-12 w-12 bg-fuchsia-600 flex justify-center items-center'>
          {
            isPlaying ?
              <PauseOctagon onClick={handleStop} />
              :
              <PlaySquare onClick={handlePlay} />
          }
        </div>
        <input type='range' defaultValue={duration!} />
        <span>{timeString}</span>
      </div>
      <div className='text-ellipsis overflow-hidden   max-h-[30px]'>
        {content}
      </div>
    </div>
  );
};

