'use client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import dynamic from 'next/dynamic';

import Modal from '@/components/shared/Modal';
import { MessageType } from '@/types/enums';
import { Button } from '@/components/shared/Button';
import toast from 'react-hot-toast';

interface GeoInputProps {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  setMessageType: Dispatch<SetStateAction<MessageType>>,
  markerPosition: [number, number],
  setMarkerPosition: Dispatch<SetStateAction<[number, number]>>,
  confirmed: boolean,
  setConfirmed: Dispatch<SetStateAction<boolean>>,
}

export const GeoInput = ({
                           isOpen,
                           setIsOpen,
                           setMessageType,
                           confirmed,
                           setConfirmed,
                           markerPosition,
                           setMarkerPosition
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
      {confirmed && <div className='my-5 mx-2 flex'>
        I am sharing my position with you longitude: ${markerPosition[1]}, latitude: ${markerPosition[0]}
      </div>}
    </div>
  );
};

