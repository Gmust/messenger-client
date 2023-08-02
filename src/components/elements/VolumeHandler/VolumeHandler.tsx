'use client';

import { useState } from 'react';

export const VolumeHandler = () => {

  const [volume, setVolume] = useState<number>(0.4);

  Howler.volume(volume);

  return (
    <div>
      <input type='range' />
    </div>
  );
};

