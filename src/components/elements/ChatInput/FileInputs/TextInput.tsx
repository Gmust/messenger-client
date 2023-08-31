import React, { Dispatch, SetStateAction } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { User } from '@/types/user';

interface TextMessageProps {
  sendMessage: () => void,
  input: string,
  setInput: Dispatch<SetStateAction<string>>,
  chatPartner?: User,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  customPlaceholder?: string
}


export const TextInput = ({
                            sendMessage,
                            setInput,
                            input,
                            chatPartner,
                            textareaRef,
                            customPlaceholder
                          }: TextMessageProps) => {
  return (
    <><TextareaAutosize
      //@ts-ignore
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
      placeholder={chatPartner ? `Message ${chatPartner.name}` : customPlaceholder}
      className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0
                     sm:py-1.5 sm:text-base  leading-6 '
    />

      <div onClick={() => textareaRef?.current?.focus()} className='py-2' aria-hidden='true'>
        <div className='py-px'>
          <div className='h-9'></div>
        </div>
      </div>
    </>
  );
};

