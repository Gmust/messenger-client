'use client';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn, createImgUrl, pusherClient, toPusherKey } from '@/lib';

interface MessagesProps {
  initialMessages: Message[],
  sessionId: string,
  sessionImg: string,
  chatPartnerImg: string,
  chatId: string
}

export const Messages = ({ initialMessages, sessionId, sessionImg, chatPartnerImg, chatId }: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const formatTimestamp = (timestamp: number | Date) => {
    const timestampParsed = Date.parse(String(timestamp));
    return format(timestampParsed, 'HH:mm');
  };

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    );

    const messageHandler = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      );
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [chatId]);


  return (
    <div id='messages'
         className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded
                    scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      <div ref={scrollDownRef}>
        {messages.map((message, index) => {
          const isCurrentUser = message.sender === sessionId;
          const hasNextMessageFromSameUser = messages[index - 1]?.sender === messages[index].sender;

          return (
            <div className='chat-message' key={`${message._id}-${message.timestamp}`}>
              <div className={cn('flex items-end m-2', {
                'justify-end': isCurrentUser
              })}>
                <div className={cn('flex flex-col space-y-4 text-base max-w-xs mx-2', {
                  'order-1 items-end': isCurrentUser,
                  'order-2 items-start': !isCurrentUser
                })}>
                  <span className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-violet-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser
                  })}>
                    {message.content}{' '}
                    <span className='ml-2 text-xs text-gray-400'>
                      {formatTimestamp(message.timestamp!)}
                    </span>
                  </span>
                </div>
                <div className={cn('relative w-8 h-8', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  'invisible': hasNextMessageFromSameUser
                })}>
                  <Image src={createImgUrl(isCurrentUser ? (sessionImg as string) : (chatPartnerImg as string))}
                         alt={isCurrentUser ? 'User image' : 'Chat partner image'} fill referrerPolicy='no-referrer'
                         className='rounded-full' />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

