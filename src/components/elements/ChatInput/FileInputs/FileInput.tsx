import { File, X } from 'lucide-react';

import { FileInputProps } from '@/types/chat';


export const FileInput = ({ setMessageType, file, setFile, setSelectedDataURL, selectedDataURL }: FileInputProps) => {
  return (
    <div className='flex p-4  '>
      <File />
      <span className='overflow-hidden truncate w-36 md:w-72'>
        {file?.name}
      </span>
      <X className='text-red-700 cursor-pointer' onClick={() => {
        setMessageType('text');
        if (setFile && setSelectedDataURL) {
          setFile(null);
          setSelectedDataURL(null);
        }
      }} />
    </div>
  )
    ;
};

