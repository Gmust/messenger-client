import { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Check } from 'lucide-react';

import { Button } from '@/components/shared/Button';

import 'leaflet-defaulticon-compatibility';

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import toast from 'react-hot-toast';

interface DraggableMarkerProps {
  clientGeoData: [number, number];
  setClientGeoData: Dispatch<SetStateAction<[number, number]>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setConfirmed: Dispatch<SetStateAction<boolean>>,
}

export const DraggableMarker = ({ clientGeoData, setClientGeoData, setIsOpen, setConfirmed }: DraggableMarkerProps) => {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          //@ts-ignore
          setClientGeoData(marker.getLatLng());
        }
      }
    }),
    []
  );

  const handleConfirmLocation = () => {
    // @ts-ignore
    const coords = markerRef.current.getLatLng();
    setClientGeoData([coords.lat, coords.lng]);
    setConfirmed(true);
    setIsOpen(false);
    toast('You can leave private message on marker otherwise instead there will be placeholder\n')
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={clientGeoData}
      ref={markerRef}>
      <Popup minWidth={90}>
        <div className='flex items-center'>
          <div>Confirm location?</div>
          <div>
            <Button variant='ghost' onClick={handleConfirmLocation}>
              <Check className='text-emerald-700' />
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

