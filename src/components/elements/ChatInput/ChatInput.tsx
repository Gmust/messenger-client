'use client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ImageIcon, ImageOff, Map, Mic, MicOff, Paperclip } from 'lucide-react';

import { AudioInput } from '@/components/elements/ChatInput/FileInputs/AudioInput';
import { FileInput } from '@/components/elements/ChatInput/FileInputs/FileInput';
import { GeoInput } from '@/components/elements/ChatInput/FileInputs/GeoInput';
import { ImageInput } from '@/components/elements/ChatInput/FileInputs/ImageInput';
import { TextInput } from '@/components/elements/ChatInput/FileInputs/TextInput';
import { VideoInput } from '@/components/elements/ChatInput/FileInputs/VideoInput';
import { VoiceInput } from '@/components/elements/ChatInput/FileInputs/VoiceInput';
import { Button } from '@/components/shared/Button';
import { chatService } from '@/service/chatService';
import { MessageType } from '@/types/enums';


interface ChatInput {
  chatPartner: User;
  chatId: string;
  user: User;
}


export const ChatInput = ({ chatPartner, chatId, user }: ChatInput) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>(MessageType.Text);
  const [file, setFile] = useState<File | null>(null);
  const [selectedDataURL, setSelectedDataURL] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([51.505, -0.09]);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [geoMessageInput, setGeoMessageInput] = useState<string>('');

  useEffect(() => {
    if (file) {
      if (file.type.startsWith('video')) setMessageType(MessageType.Video);
      if (file.type.startsWith('audio')) setMessageType(MessageType.Audio);
      if (file.type.startsWith('image')) setMessageType(MessageType.Image);
      if (file && messageType === 'text' && file.type!.startsWith('image' || 'audio' || 'video')) setMessageType(MessageType.File);
      if (file.type.startsWith('application')) setMessageType(MessageType.File);
      if (messageType === MessageType.Voice) setMessageType(MessageType.Voice);
      if (!file) setMessageType(MessageType.Text);
    }
  }, [file, messageType]);

  const sendMessageWithFile = async () => {
    if (!file) {
      setMessageType(MessageType.Text);
      if (input) await sendMessage();
      return;
    }
    setIsLoading(true);
    try {
      setMessageType(MessageType.Text);
      const formData = new FormData();
      formData.append('chat', chatId);
      //@ts-ignore
      formData.append('sender', user.id);
      formData.append('recipient', chatPartner._id);
      formData.append('content', '');
      formData.append('messageType', messageType);
      formData.append('file', file!);
      await chatService.sendMessageWithFile(formData, user.access_token, chatId);
      setMessageType(MessageType.Text);
      setFile(null);
      setSelectedDataURL(null);
    } catch (e) {
      toast.error('Something went wrong, please try again later!');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      await chatService.sendMessage(
        {
          chat: chatId,
          access_token: user.access_token,
          //@ts-ignore
          sender: user.id,
          recipient: chatPartner._id,
          content: input,
          messageType: MessageType.Text
        }
      );
      setInput('');
      textareaRef.current?.focus();
    } catch (e) {
      toast.error('Something went wrong, please try again later!');
    } finally {
      setMessageType(MessageType.Text);
      setIsLoading(false);
    }
  };

  const sendGeolocation = async () => {
    if (!markerPosition) return;
    if (!confirmed) return;
    setIsLoading(true);
    try {
      const coordinates = markerPosition.reverse();
      await chatService.sendMessage(
        {
          chat: chatId,
          access_token: user.access_token,
          //@ts-ignore
          sender: user.id,
          recipient: chatPartner._id,
          content: geoMessageInput ? geoMessageInput : `I am sharing my position with you  longitude: ${markerPosition[0]}, latitude: ${markerPosition[1]}`,
          messageType: MessageType.GeoLocation,
          geoLocation: { type: 'Point', coordinates: [coordinates[0], coordinates[1]] }
        }
      );
      setMarkerPosition([51.505, -0.09]);
      setConfirmed(false);
      setGeoMessageInput('');
      textareaRef.current?.focus();
    } catch (e) {
      toast.error('Something went wrong, please try again later!');
    } finally {
      setMessageType(MessageType.Text);
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target!.result as string;
        setSelectedDataURL(dataUrl);
        console.log(selectedDataURL);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      console.log('No files found in the event object.');
    }
  };

  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-3 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300
                      focus-within:ring-2 focus:ring-violet-600'>
        {selectedDataURL && messageType !== MessageType.Text && messageType !== MessageType.Image ?
          <>
            {messageType === 'audio' &&
              <AudioInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile} setMessageType={setMessageType} />}
            {messageType === 'video' &&
              <VideoInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile} setMessageType={setMessageType} />}
            {messageType === 'file' &&
              <FileInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                         setFile={setFile}
                         setMessageType={setMessageType} />
            }
          </>
          :
          <>
            {messageType === MessageType.Voice &&
              <VoiceInput setMessageType={setMessageType} file={file} setFile={setFile}
                //@ts-ignore
                          id={user.id} chatId={chatId}
              />}
            {messageType === MessageType.Text &&
              <TextInput setInput={setInput} input={input} chatPartner={chatPartner} sendMessage={sendMessage}
                         textareaRef={textareaRef} />}
            {messageType === MessageType.GeoLocation &&
              <GeoInput setIsOpen={setIsOpen} isOpen={isOpen} setMessageType={setMessageType} confirmed={confirmed}
                        markerPosition={markerPosition} setConfirmed={setConfirmed}
                        setMarkerPosition={setMarkerPosition} geoMessageInput={geoMessageInput}
                        setGeoMessageInput={setGeoMessageInput} sendMessage={sendGeolocation} teatAreaRef={textareaRef}
              />}
            {messageType === MessageType.Image &&
              <ImageInput setMessageType={setMessageType}
                          file={file} selectedDataURL={selectedDataURL!} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile} handleFileChange={handleFileChange}
              />
            }
          </>
        }
        <div className='absolute right-0 bottom-0 flex justify-between items-center py-1 pl-3 pr-2 space-x-3'>
          <div>
            <Map onClick={() => {
              setIsOpen(true);
              setMessageType(MessageType.GeoLocation);
            }} className='cursor-pointer' />
          </div>
          <div>
            {
              messageType === MessageType.Image ?
                <ImageOff className='cursor-pointer' onClick={() => {
                  setMessageType(MessageType.Text);
                }} />
                :
                <ImageIcon onClick={() => {
                  setMessageType(MessageType.Image);
                }} className='cursor-pointer' />
            }
          </div>
          <div>
            <label htmlFor='chat-file'>
              <Paperclip className='cursor-pointer' />
            </label>
            <input type='file' id='chat-file' className='hidden' onChange={handleFileChange} />
          </div>
          <div>
            <label>
              {
                messageType === 'voice' ?
                  <MicOff onClick={() => setMessageType(MessageType.Text)} />
                  :
                  <Mic onClick={() => setMessageType(MessageType.Voice)} />
              }
            </label>
          </div>
          <div className='flex-shrink-0'>
            <Button onClick={() => {
              messageType === 'text' && sendMessage();
              (messageType === 'image' || messageType === 'audio' || messageType === 'video' || messageType === 'file' || messageType === 'voice')
              && sendMessageWithFile();
              messageType === MessageType.GeoLocation && sendGeolocation();
            }} className='text-lg' isLoading={isLoading}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) ;
};

