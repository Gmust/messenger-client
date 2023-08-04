import { AudioPlayer } from '@/components/shared/AudioPlayer';
import { FileInputProps } from '@/types/chat';

export const AudioInput = ({ setFile, file, setSelectedDataURL, selectedDataURL, setMessageType }: FileInputProps) => {
  return (
    <AudioPlayer type={'input'} setFile={setFile} file={file} selectedDataURL={selectedDataURL}
                 setSelectedDataURL={setSelectedDataURL} setMessageType={setMessageType} />
  );
};

