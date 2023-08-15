import React, { Dispatch, SetStateAction } from 'react';
import Webcam from 'react-webcam';

import { Button } from '@/components/shared/Button';
import { FileInputProps } from '@/types/chat';


interface VideoWebcamProps extends Pick<FileInputProps, 'setFile' | 'setSelectedDataURL'> {
  setFilmVideo: Dispatch<SetStateAction<boolean>>;
}

const videoConstraints = {
  facingMode: 'user'
};

const audioConstraints = {
  suppressLocalAudioPlayback: true,
  noiseSuppression: true,
  echoCancellation: true
};

export const VideoWebcam = ({ setFile, setSelectedDataURL, setFilmVideo }: VideoWebcamProps) => {

  const webcamRef = React.useRef<Webcam | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef?.current?.stream!, {
      mimeType: 'video/webm; codecs=vp9'
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }: any) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef?.current?.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });
      const file = new File([blob], `user-film-video${Math.random()}.mp4`, { type: 'video/mp4' });
      setFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target!.result as string;
        setSelectedDataURL(dataUrl);
      };
      reader.readAsDataURL(file);
      setFilmVideo(false);
    }
  }, [recordedChunks]);

  return (
    <div onClick={e => e.preventDefault()} className='space-y-4'>
      <Webcam audio={true} ref={webcamRef} videoConstraints={videoConstraints} audioConstraints={audioConstraints} />
      <div className='flex justify-center space-x-4'>
        {capturing ?
          <Button onClick={handleStopCaptureClick}>Stop Capture</Button>
          :
          <Button onClick={handleStartCaptureClick}>Start Capture</Button>
        }
        {recordedChunks.length > 0 &&
          <Button onClick={handleDownload}>Confirm</Button>
        }
      </div>
    </div>
  );
};

