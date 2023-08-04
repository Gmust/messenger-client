'use client';

import { useEffect, useState } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

import { cn } from '@/lib';

export const VolumeHandler = () => {

  const [volume, setVolume] = useState<number>(0.5);

  Howler.volume(volume);
  useEffect(() => {
    volume === 0 && Howler.mute(true);
    volume > 0 && Howler.mute(false);
  }, [volume]);

  return (
    <div className='flex flex-col jusify-center space-y-2'>
      <div className='flex justify-between mx-3'>
        <VolumeX className={cn('', {
          'text-red-500': volume === 0
        })} />
        {
          volume > 0.5 ?
            <Volume2 className={cn('', {
              'text-emerald-600': volume === 1,
              'text-orange-400': volume > 0.5 && volume < 1
            })} />
            :
            <Volume1 className={cn('', {
              'text-yellow-600': volume > 0 && volume < 0.5
            })} />
        }
      </div>
      <input type='range' step={0.01} max={1} min={0} onChange={(e) => setVolume(Number(e.target.value))}
             className='appearance-none bg-gray-100 [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-purple-500 mx-3'
      />
    </div>
  );
};

