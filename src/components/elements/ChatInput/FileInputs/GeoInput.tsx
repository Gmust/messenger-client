'use client';
import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

import { Button } from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { MessageType } from '@/types/enums';
import { MapIcon } from 'lucide-react';
import { TextInput } from '@/components/elements/ChatInput/FileInputs/TextInput';

interface GeoInputProps {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  setMessageType: Dispatch<SetStateAction<MessageType>>,
  markerPosition: [number, number],
  setMarkerPosition: Dispatch<SetStateAction<[number, number]>>,
  confirmed: boolean,
  setConfirmed: Dispatch<SetStateAction<boolean>>,
  setGeoMessageInput: Dispatch<SetStateAction<string>>,
  geoMessageInput: string,
  sendMessage: () => void,
  teatAreaRef: RefObject<HTMLTextAreaElement | null>
}

export const GeoInput = ({
                           isOpen,
                           setIsOpen,
                           setMessageType,
                           confirmed,
                           setConfirmed,
                           markerPosition,
                           setMarkerPosition,
                           geoMessageInput,
                           setGeoMessageInput,
                           sendMessage,
                           teatAreaRef
                         }: GeoInputProps) => {


  const Map = dynamic(() => import('@/components/shared/Map/Map'), {
    loading: () => <p>loading...</p>,
    ssr: false
  });

  useEffect(() => {
    console.log(markerPosition);
  }, [markerPosition]);

  const handleGetPosition = () => {
    const successCallback = (position: GeolocationPosition) => {
      setMarkerPosition([position.coords.latitude, position.coords.longitude]);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      toast.error(error.message);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  return (
    <div>
      <div>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} setMessageType={setMessageType}>
          <div onClick={(e) => e.preventDefault()}>
            <Map clientGeoData={markerPosition} setClientGeoData={setMarkerPosition} setConfirmed={setConfirmed}
                 setIsOpen={setIsOpen} type='input' />
            <Button onClick={handleGetPosition}>Point my position</Button>
          </div>
        </Modal>
      </div>
      {confirmed && <div className='p-2 flex space-x-4 items-center mb-6 sm:mb-0'>
        <MapIcon className='text-2xl' />
        <TextInput input={geoMessageInput} setInput={setGeoMessageInput} sendMessage={sendMessage}
                   textareaRef={teatAreaRef}
                   customPlaceholder={`I am sharing my position with you longitude: ${markerPosition[1]}, latitude: ${markerPosition[0]}`}
        />
      </div>}
    </div>
  );
};

