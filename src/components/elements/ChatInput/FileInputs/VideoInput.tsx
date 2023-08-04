import { X } from 'lucide-react';

import { FileInputProps } from '@/types/chat';

export const VideoInput = ({ selectedDataURL, setSelectedDataURL, file, setFile }: FileInputProps) => {
  return (
    <div>
      <video width='420' height='340' className='w-[240px]' autoPlay={false} controls={true}>
        <source src={selectedDataURL} />
      </video>
      <div className='flex truncate'>
         <span className='overflow-hidden truncate w-72'>
        {file?.name}
 </span>
        <X className='text-red-700' onClick={() => {
          setFile(null);
          setSelectedDataURL(null);
        }} />
      </div>
    </div>
  );
};

