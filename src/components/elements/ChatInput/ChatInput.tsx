'use client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Paperclip } from 'lucide-react';

import { AudioInput } from '@/components/elements/ChatInput/FileInputs/AudioInput';
import { FileInput } from '@/components/elements/ChatInput/FileInputs/FileInput';
import { ImageInput } from '@/components/elements/ChatInput/FileInputs/ImageInput';
import { TextMessage } from '@/components/elements/ChatInput/FileInputs/TextMessage';
import { VideoInput } from '@/components/elements/ChatInput/FileInputs/VideoInput';
import { Button } from '@/components/shared/Button';
import { chatService } from '@/service/chatService';

interface ChatInput {
  chatPartner: User;
  chatId: string;
  user: User;
}

export const ChatInput = ({ chatPartner, chatId, user }: ChatInput) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messageType, setMessageType] = useState<'text' | 'image' | 'video' | 'audio' | 'geolocation' | 'file'>('text');
  const [file, setFile] = useState<File | null>(null);
  const [selectedDataURL, setSelectedDataURL] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      if (file.type.startsWith('video')) setMessageType('video');
      if (file.type.startsWith('audio')) setMessageType('audio');
      if (file.type.startsWith('image')) setMessageType('image');
      if (file.type.startsWith('application')) setMessageType('file');
      if (file && messageType === 'text' && file.type!.startsWith('image' || 'audio' || 'video')) setMessageType('file');
      if (!file) setMessageType('text');
    }
  }, [file, messageType]);

  const sendMessageWithFile = async () => {
    if (!file) {
      setMessageType('text');
      if (input) await sendMessage();
      return;
    }
    setIsLoading(true);
    try {
      console.log('send file');
      setMessageType('text');
      const formData = new FormData();
      formData.append('chat', chatId);
      //@ts-ignore
      formData.append('sender', user.id);
      formData.append('recipient', chatPartner._id);
      formData.append('content', '');
      formData.append('messageType', messageType);
      formData.append('file', file!);
      await chatService.sendMessageWithFile(formData, user.access_token, chatId);
      setMessageType('text');
      setFile(null);
      setSelectedDataURL(null);
    } catch (e) {
      toast.error('Something went wrong, please try again later!');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    console.log('send text message');
    if (!input) return;
    setIsLoading(true);
    setMessageType('text');
    try {
      await chatService.sendMessage(
        {
          chat: chatId,
          access_token: user.access_token,
          //@ts-ignore
          sender: user.id,
          recipient: chatPartner._id,
          content: input,
          messageType: 'text'
        }
      );
      setInput('');
      textareaRef.current?.focus();
    } catch (e) {
      toast.error('Something went wrong, please try again later!');
    } finally {
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
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      console.log('No files found in the event object.');
    }
  };

  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300
                      focus-within:ring-2 focus:ring-violet-600'>

        {selectedDataURL ?
          <>
            {messageType === 'audio' &&
              <AudioInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile} setMessageType={setMessageType} />}
            {messageType === 'video' &&
              <VideoInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile} setMessageType={setMessageType} />}
            {messageType === 'image' &&
              <ImageInput setMessageType={setMessageType}
                          file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile}
              />
            }
            {messageType === 'file' &&
              <FileInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                         setFile={setFile}
                         setMessageType={setMessageType} />
            }
          </>
          :
          <TextMessage setInput={setInput} input={input} chatPartner={chatPartner} sendMessage={sendMessage}
                       textareaRef={textareaRef} />
        }
        <div className='absolute right-0 bottom-0 flex justify-between items-center py-2 pl-3 pr-2 space-x-3'>
          <div>
            <label htmlFor='chat-file'>
              <Paperclip className='cursor-pointer' />
            </label>
            <input type='file' id='chat-file' className='hidden' onChange={handleFileChange} />
          </div>
          <div className='flex-shrink-0'>
            <Button onClick={() => {
              messageType === 'text' && sendMessage();
              (messageType === 'image' || messageType === 'audio' || messageType === 'video' || messageType === 'file')
              && sendMessageWithFile();
            }} className='text-lg' isLoading={isLoading}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

