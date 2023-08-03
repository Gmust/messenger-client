import React, { useEffect, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { PauseOctagon, PlaySquare } from 'lucide-react';

export const AudioMessage = ({ content }: { content: string }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    if (playing) {
      updateProgress();
    }
  }, [playing]);

  const handleOnLoad = () => {
    // @ts-ignore
    const duration = playerRef.current.duration();
    setDuration(duration);
  };

  const updateProgress = () => {
    // @ts-ignore
    setCurrentTime(playerRef.current.seek());
    if (playing) {
      requestAnimationFrame(updateProgress);
    }
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleOnEnd = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: any) => {
    // @ts-ignore
    playerRef.current.seek(e.target.value);
    setCurrentTime(e.target.value);
  };

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div>
      <ReactHowler
        src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`}
        onLoad={handleOnLoad}
        loop={false}
        onEnd={handleOnEnd}
        playing={playing}
        ref={playerRef}
      />
      <div className='flex flex-col'>
        <div className='flex  space-x-4 flex items-center'>
          <div className='h-12 w-12 bg-fuchsia-600 flex justify-center items-center'>
            {
              playing ?
                <PauseOctagon onClick={handlePause} />
                :
                <PlaySquare onClick={handlePlay} />
            }
          </div>
          <input
            type='range'
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <div>{formatTime(Math.round(currentTime))}/{formatTime(Math.round(duration))}</div>
        </div>
        <div className='text-ellipsis overflow-hidden   max-h-[30px]'>
          {content}
        </div>
      </div>

    </div>
  );
};

