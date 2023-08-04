import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ReactHowler from 'react-howler';
import { saveAs } from 'file-saver';
import { Download, PauseOctagon, PlaySquare, X } from 'lucide-react';

import { getLastItem } from '@/lib';


interface AudioPlayerProps {
  selectedDataURL?: string,
  file?: File | null,
  setFile?: Dispatch<SetStateAction<File | null>>,
  setSelectedDataURL?: Dispatch<SetStateAction<string | null>>,
  content?: string,
  type: 'message' | 'input',
  setMessageType: Dispatch<SetStateAction<'text' | 'image' | 'video' | 'audio' | 'geolocation'>>
}


export const AudioPlayer = ({
                              file,
                              setFile,
                              setSelectedDataURL,
                              selectedDataURL,
                              content,
                              type,
                              setMessageType
                            }: AudioPlayerProps) => {
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
        src={type === 'input' ? selectedDataURL! : `${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`}
        onLoad={handleOnLoad}
        loop={false}
        onEnd={handleOnEnd}
        playing={playing}
        ref={playerRef}
      />
      <div className='flex flex-col'>
        <div className='flex  space-x-4  items-center'>
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
          {type === 'input' ?
            <div className='flex space-x-2'>
              <span className='overflow-hidden truncate w-72'>
              {file?.name}
              </span>
              <X className='text-red-700' onClick={() => {
                setCurrentTime(0);
                setDuration(0);
                setPlaying(false);
                setMessageType('text');
                if (setFile && setSelectedDataURL) {
                  setFile(null);
                  setSelectedDataURL(null);
                }
              }} />
            </div>
            :
            <div className='flex'>
              <span className='w-64 truncate"'>
                {content}
              </span>
              <Download className='w-6 h-6 cursor-pointer'
                        onClick={(e) => {
                          e.preventDefault();
                          saveAs(content!, `${getLastItem(content!)}`, { autoBom: true });
                        }} />
            </div>

          }
        </div>
      </div>

    </div>
  );
};

