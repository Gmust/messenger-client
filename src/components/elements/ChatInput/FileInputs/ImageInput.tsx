'use client';

import { ChangeEvent, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { PhotoWebcam } from '@/components/shared/PhotoWebcam';
import { FileInputProps } from '@/types/chat';

interface ImageInputProps extends FileInputProps {
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ImageInput = ({
                             selectedDataURL,
                             setSelectedDataURL,
                             setFile,
                             file,
                             handleFileChange
                           }: ImageInputProps) => {

  const [takePhoto, setTakePhoto] = useState<boolean>(false);


  return (
    <>
      {!selectedDataURL ?
        <div className='p-2 flex items-center mb-8 sm:mb-0'>
          <Button variant='ghost' className='text-blue-500' onClick={() => setTakePhoto(true)}>
            Take a photo
          </Button> or {' '}
          <Button variant='ghost'>
            <label className='text-blue-500 cursor-pointer' htmlFor='chat-image'>select an existing one</label>
          </Button>
          <input type='file' id='chat-image' className='hidden' onChange={handleFileChange} accept='image/*' />
        </div>
        :
        <div className='mb-10 sm:mb-0'>
          <div className='relative h-32 w-32 '>
            <Image src={selectedDataURL!} alt={file?.name!} fill={true} />
          </div>
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
      }
      <Modal isOpen={takePhoto} setIsOpen={setTakePhoto}>
        <div>
          <PhotoWebcam setTakePhoto={setTakePhoto} setFile={setFile} setSelectedDataURL={setSelectedDataURL} />
        </div>
      </Modal>
    </>
  );
};

