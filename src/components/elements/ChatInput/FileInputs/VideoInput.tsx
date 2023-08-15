import { ChangeEvent, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { VideoWebcam } from '@/components/shared/VideoWebcam';
import { FileInputProps } from '@/types/chat';
import { MessageType } from '@/types/enums';

interface VideoInputProps extends FileInputProps {
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const VideoInput = ({
                             selectedDataURL,
                             setSelectedDataURL,
                             file,
                             setFile,
                             setMessageType,
                             handleFileChange
                           }: VideoInputProps) => {

  const [filmVideo, setFilmVideo] = useState<boolean>(false);

  return (
    <>
      {selectedDataURL
        ?
        <div>
          <video width='420' height='340' className='w-[240px]' autoPlay={false} controls={true}>
            <source src={selectedDataURL} />
          </video>
          <div className='flex truncate'>
            <div className='overflow-hidden truncate w-72'>
              {file?.name}
            </div>
            <X className='text-red-700' onClick={() => {
              setMessageType(MessageType.Text);
              setFile(null);
              setSelectedDataURL(null);
            }} />
          </div>
        </div>
        :
        <div className='p-2 flex items-center'>
          <Button variant='ghost' className='text-blue-500' onClick={() => setFilmVideo(true)}>
            Film video
          </Button> or {' '}
          <Button variant='ghost'>
            <label className='text-blue-500 cursor-pointer' htmlFor='chat-video'>select an existing one</label>
          </Button>
          <input type='file' id='chat-video' className='hidden' onChange={handleFileChange}
                 accept='video/mp4,video/x-m4v,video/*' />
        </div>
      }
      <Modal isOpen={filmVideo} setIsOpen={setFilmVideo}>
        <div>
          <VideoWebcam setFilmVideo={setFilmVideo} setSelectedDataURL={setSelectedDataURL} setFile={setFile} />
        </div>
      </Modal>
    </>
  );
};

