import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';

import { Button } from '@/components/shared/Button';
import { FileInputProps } from '@/types/chat';


interface PhotoWebcamProps extends Pick<FileInputProps, 'setFile' | 'setSelectedDataURL'> {
  setTakePhoto: Dispatch<SetStateAction<boolean>>;
}

export const PhotoWebcam = ({ setFile, setSelectedDataURL, setTakePhoto }: PhotoWebcamProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [img, setImg] = useState<string | null>();

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot({ width: 1920, height: 1080 });
    setImg(imageSrc);
  }, [webcamRef]);

  const confirmPhoto = () => {
    let arr = img?.split(','), mime = arr![0].match(/:(.*?);/)![1],
      bstr = atob(arr![1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const file = new File([blob], `user-take-photo${Math.random()}`, { type: 'image/webp' });
    setSelectedDataURL(img!);
    setFile(file);
    setTakePhoto(false);
  };

  return (
    <div onClick={e => e.preventDefault()}>
      {img ?
        <div>
          <div className='relative w-[300px] h-[250px] sm:w-[700px] sm:h-[600px] '>
            <Image src={img} alt='webcam image' fill={true} />
          </div>
          <div className='flex justify-center mt-5 space-x-10'>
            <Button onClick={confirmPhoto}>Confirm</Button>
            <Button onClick={() => setImg(null)}>Take another</Button>
          </div>
        </div>
        :
        <div className='flex flex-col space-y-6'>
          <Webcam height={500} width={600} ref={webcamRef} />
          <Button onClick={capturePhoto}>Capture photo</Button>
        </div>
      }
    </div>
  );
};

