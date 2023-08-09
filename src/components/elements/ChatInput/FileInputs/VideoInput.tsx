import { X } from 'lucide-react';

import { FileInputProps } from '@/types/chat';
import { MessageType } from '@/types/enums';

export const VideoInput = ({ selectedDataURL, setSelectedDataURL, file, setFile, setMessageType }: FileInputProps) => {
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
          setMessageType(MessageType.Text);
          setFile(null);
          setSelectedDataURL(null);
        }} />
      </div>
    </div>
  );
};

