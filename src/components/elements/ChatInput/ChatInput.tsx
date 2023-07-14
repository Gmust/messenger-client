'use client';
import TextareaAutosize from 'react-textarea-autosize';
import { useRef, useState } from 'react';
import { Button } from '@/components/shared/Button';
import toast from 'react-hot-toast';
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
          content: input
        }
      );
      setInput('');
      textareaRef.current?.focus();
    } catch (e) {
      console.log(e);
      toast.error('Something went wrong, please try again later!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300
                      focus-within:ring-2 focus:ring-violet-600'>
        <TextareaAutosize
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

        <div className='absolute right-0 bottom-0 flex justify-between  py-2 pl-3 pr-2'>
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
