'use client';
import { Dispatch, SetStateAction } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { DraggableMarker } from '@/components/shared/Map/DraggableMarker';

import 'leaflet-defaulticon-compatibility';

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface ClientMapProps {
  clientGeoData: [number, number];
  setClientGeoData?: Dispatch<SetStateAction<[number, number]>>;
  setConfirmed?: Dispatch<SetStateAction<boolean>>,
  setIsOpen?: Dispatch<SetStateAction<boolean>>,
  type: 'input' | 'message',
  content?: string
}


const ClientMap = ({ clientGeoData, setClientGeoData, setConfirmed, setIsOpen, type, content }: ClientMapProps) => {
  return (
    <MapContainer center={clientGeoData} zoom={3} scrollWheelZoom={true} className='z-50'>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {
        type === 'input' &&
        <DraggableMarker clientGeoData={clientGeoData} setClientGeoData={setClientGeoData!} setConfirmed={setConfirmed!}
                         setIsOpen={setIsOpen!} />
      }
      {
        type === 'message' && <Marker position={clientGeoData}>
          <Popup>
            {content}
          </Popup>
        </Marker>
      }
    </MapContainer>
  );
};

export default ClientMap;

