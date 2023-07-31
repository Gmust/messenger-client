'use client';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Modal from '@/components/shared/Modal';
import { cn, createImgUrl, pusherClient, toPusherKey } from '@/lib';
import { Message } from '@/types/chat';
import { Play } from 'lucide-react';

interface MessagesProps {
  initialMessages: Message[],
  sessionId: string,
  sessionImg: string,
  chatPartnerImg: string,
  chatId: string
}

export const Messages = ({ initialMessages, sessionId, sessionImg, chatPartnerImg, chatId }: MessagesProps) => {

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openedImg, setOpenedImg] = useState<string>('');
  const [openedVideo, setOpenedVideo] = useState<string>('');
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
          const avatar = createImgUrl(isCurrentUser ? (sessionImg as string) : (chatPartnerImg as string));
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
                   {message.messageType === 'image' &&
                     <Image src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`}
                            alt={`${message.content} picture`} width={300} height={300}
                            onClick={() => {
                              setOpenedVideo('');
                              setOpenedImg(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`);
                              setIsOpen(true);
                            }} />}
                    {message.messageType === 'video' &&
                      <div className='relative'>
                        <video width={420} height={384} onPlay={() => {
                        }} autoPlay={false} controls={false}
                               onClick={(e) => {
                                 e.preventDefault();
                                 setOpenedImg('');
                                 setOpenedVideo(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`);
                                 setIsOpen(true);
                               }} className='h-full'
                        >
                          <source src={`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${message.content}`} />
                        </video>
                        <Play className='absolute bottom-2'/>
                      </div>
                    }
                    {message.messageType === 'text' && message.content}{' '}
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
                  <Image src={avatar}
                         alt={isCurrentUser ? 'User image' : 'Chat partner image'} fill referrerPolicy='no-referrer'
                         className='rounded-full' />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>{openedImg &&
          <div className='relative h-60 w-60 sm:h-96 sm:w-96'>
            <Image src={openedImg} alt={openedImg} fill />
          </div>
        }
          {openedVideo &&
            <div className='video-wrapper w-96'>
              <iframe
                src={openedVideo}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen>
              </iframe>
            </div>
          }</div>
      </Modal>
    </div>
  );
};

