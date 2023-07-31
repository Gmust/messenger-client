import { X } from 'lucide-react';

import { FileInputProps } from '@/types/chat';

export const VideoInput = ({ selectedDataURL, setSelectedDataURL, file, setFile }: FileInputProps) => {
  return (
    <div>
      <video width="420" height="340"  autoPlay={false} controls={true}>
        <source src={selectedDataURL}/>
      </video>
      <div className='flex truncate'>
        {file?.name}
        <X className='text-red-700' onClick={() => {
          setFile(null);
          setSelectedDataURL(null);
        }} />
      </div>
    </div>
  );
};

