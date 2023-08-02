import { Dispatch, SetStateAction } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { FileInputProps } from '@/types/chat';



export const ImageInput = ({ selectedDataURL, setSelectedDataURL, setFile, file }: FileInputProps) => {
  return (
    <>
      <div className='relative h-32 w-32'>
        <Image src={selectedDataURL!} alt={file?.name!} fill={true} />
      </div>
      <div className='flex truncate'>
        {file?.name}
        <X className='text-red-700' onClick={() => {
          setFile(null);
          setSelectedDataURL(null);
        }} />
      </div>
    </>
  );
};

