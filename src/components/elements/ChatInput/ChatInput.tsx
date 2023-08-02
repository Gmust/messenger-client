'use client';
import { ChangeEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip } from 'lucide-react';

import { AudioInput } from '@/components/elements/ChatInput/FileInputs/AudioInput';
import { ImageInput } from '@/components/elements/ChatInput/FileInputs/ImageInput';
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
  const [messageType, setMessageType] = useState<'text' | 'image' | 'video' | 'audio' | 'geolocation'>('text');
  const [file, setFile] = useState<File | null>(null);
  const [selectedDataURL, setSelectedDataURL] = useState<string | null>(null);

  const sendMessageWithFile = async () => {
    setIsLoading(true);
    try {
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
    setFile(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith('video')) {
        setMessageType('video');
      }
      if (selectedFile.type.startsWith('audio')) {
        setMessageType('audio');
      }
      if (selectedFile.type.startsWith('image')) {
        setMessageType('image');
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target!.result as string;
        setSelectedDataURL(dataUrl);
      };

      reader.readAsDataURL(selectedFile);
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
            {file?.type.startsWith('audio') &&
              <AudioInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile} />}
            {file?.type.startsWith('video') &&
              <VideoInput file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL}
                          setFile={setFile} />}
            {file?.type.startsWith('image') &&
              <ImageInput
                file={file} selectedDataURL={selectedDataURL} setSelectedDataURL={setSelectedDataURL} setFile={setFile}
              />
            }
          </>
          :
          <><TextareaAutosize
            ref={textareaRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${chatPartner.name}`}
            className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0
                     sm:py-1.5 sm:text-base  leading-6 '
          />

            <div onClick={() => textareaRef.current?.focus()} className='py-2' aria-hidden='true'>
              <div className='py-px'>
                <div className='h-9'></div>
              </div>
            </div>
          </>
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
              (messageType === 'image' || messageType === 'audio' || messageType === 'video') && sendMessageWithFile();
            }} className='text-lg' isLoading={isLoading}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

