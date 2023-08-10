import React, { useEffect, useRef, useState } from 'react';
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
import { Play, StopCircle, X } from 'lucide-react';
import useSound from 'use-sound';

import { Button } from '@/components/shared/Button';
import { FileInputProps } from '@/types/chat';
import { RecordingStatus } from '@/types/enums';

const mimeType = 'audio/webm';

type VoiceInputProps = Pick<FileInputProps, 'setFile' | 'file' | 'setMessageType'> & { id: string, chatId: string }

export const VoiceInput = ({ setFile, file, setMessageType, id, chatId }: VoiceInputProps) => {
  const [permission, setPermission] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>(
    RecordingStatus.Inactive
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [mediaRecorderVis, setMediaRecorderVis] = useState<MediaRecorder | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [play, { pause }] = useSound(audioUrl!, {
    onend: () => {
      setIsPlaying(false);
    }
  });

  const startRecording = async () => {
    await getMicrophonePermission();
    if (permission) {
      setRecordingStatus(RecordingStatus.Recording);
      const media = new MediaRecorder(stream!, { mimeType });
      setMediaRecorderVis(media);
      mediaRecorder.current = media;
      mediaRecorder.current?.start();
      const localAudioChunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };
      setAudioChunks(localAudioChunks);
    }
    return;
  };

  const stopRecording = () => {
    setRecordingStatus(RecordingStatus.Inactive);
    const currentMediaRecorder = mediaRecorder.current;
    if (currentMediaRecorder) {
      currentMediaRecorder.stop();
      currentMediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setBlob(audioBlob);
        setAudio(audioUrl);
        const file = new File([audioBlob], `voice-message-${id}-${Math.random()}-${chatId}.webm`);
        setFile(file);
        setAudioChunks([]);
      };
    }
  };


  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };

  return (
    <div className='py-10 px-2 sm:p-4 flex flex-col'>
      {
        audio ?
          <div className='flex flex-col sm:flex-row sm:items-center sm: space-x-4'>
            <audio src={audio} controls controlsList='play timeline volume nodownload'></audio>
            <X onClick={() => {
              setAudioChunks([]);
              setAudio(null);
            }} className='text-red-700 cursor-pointer' />
          </div>
          // <div className='flex flex-col sm:flex-row space-x-4 sm:items-center'>
          //   <div className='flex items-center justify-around'>
          //     {
          //       !isPlaying ?
          //         <Play onClick={() => {
          //           play();
          //           setIsPlaying(true);
          //         }} /> :
          //         <StopCircle onClick={() => {
          //           pause();
          //           setIsPlaying(false);
          //         }} />
          //     }
          //     <AudioVisualizer blob={blob!} width={200} height={50} />
          //   </div>
          //   <X onClick={() => {
          //     setAudioChunks([]);
          //     setAudio(null);
          //     setBlob(null);
          //   }} className='text-red-700 cursor-pointer' />
          // </div>
          :
          <div className='flex'>
            {
              recordingStatus === RecordingStatus.Inactive &&
              <Button variant='ghost' type='button'
                      className='border border-emerald-300 transition hover:scale-110 hover:bg-emerald-300'
                      onClick={startRecording}>
                Record
              </Button>
            }
            {
              recordingStatus === RecordingStatus.Recording &&
              <div className='flex flex-col sm:flex-row sm:space-x-4'>
                <Button variant='ghost' type='button'
                        className='border border-red-500 transition hover:scale-110 hover:bg-red-500'
                        onClick={stopRecording}>
                  Stop Recording
                </Button>
                <LiveAudioVisualizer mediaRecorder={mediaRecorderVis!} width={200} height={50} />
              </div>
            }
          </div>
      }
    </div>
  );
};

