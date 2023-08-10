import dynamic from 'next/dynamic';

interface GeoMessageProps {
  content: string,
  coordinates: number[]
}

export const GeoMessage = ({ content, coordinates }: GeoMessageProps) => {


  const Map = dynamic(() => import('@/components/shared/Map/Map'), {
    loading: () => <p>loading...</p>,
    ssr: false
  });


  return (
    <div>
      <Map clientGeoData={[coordinates[1], coordinates[0]]} type='message'/>
    </div>
  );
};

