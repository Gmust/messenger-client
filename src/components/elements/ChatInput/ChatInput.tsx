'use client';
import { ChangeEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip, X } from 'lucide-react';
import Image from 'next/image';

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
  const [selectedImageDataURL, setSelectedImageDataURL] = useState<string | null>(null);

  const sendMessage = async () => {
    if (messageType === 'text') {
      if (!input) return;
    }
    setIsLoading(true);
    try {
      if (messageType === 'text') {
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
      }
      if (messageType === 'image') {
        const formData = new FormData();
        formData.append('chat', chatId);
        //@ts-ignore
        formData.append('sender', user.id);
        formData.append('recipient', chatPartner._id);
        formData.append('content', '');
        formData.append('messageType', 'image');
        formData.append('file', file!);
        console.log(formData);
        await chatService.sendMessageWithFile(formData, user.access_token, chatId);
        setMessageType('text');
        setFile(null);
        setSelectedImageDataURL(null);
      }
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong, please try again later!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMessageType('image');
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageDataURL = event.target!.result as string;
        setSelectedImageDataURL(imageDataURL);
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

        {selectedImageDataURL ?
          <>
           <div className='relative h-32 w-32'>
              <Image src={selectedImageDataURL!} alt={file?.name!} fill={true} />
            </div>
            <div className='flex truncate'>
              {file?.name}
              <X className='text-red-700' onClick={() => {
                setFile(null);
                setSelectedImageDataURL(null);
              }} />
            </div>
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
            <Button onClick={() => sendMessage()} type='submit' className='text-lg' isLoading={isLoading}>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

