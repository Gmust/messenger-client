'use client';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { FileMessage } from '@/components/elements/Messages/MesssagesTypes/FileMessage';
import { GeoMessage } from '@/components/elements/Messages/MesssagesTypes/GeoMessage';
import { ImageMessage } from '@/components/elements/Messages/MesssagesTypes/ImageMessage';
import { VideoMessage } from '@/components/elements/Messages/MesssagesTypes/VideoMessage';
import { VoiceMessage } from '@/components/elements/Messages/MesssagesTypes/VoiceMessage';
import { Button } from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { cn, createImgUrl, getLastItem, pusherClient, toPusherKey } from '@/lib';
import { Message } from '@/types/chat';
import { MessageType } from '@/types/enums';

import { AudioMessage } from './MesssagesTypes/AudioMessage';

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
  const [openedMap, setOpenedMap] = useState<Message | null>(null);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const Map = dynamic(() => import('@/components/shared/Map/Map'), {
    loading: () => <p>loading...</p>,
    ssr: false
  });

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
         className='flex h-full flex-1 flex-col-reverse gap-4 p-1 sm:p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded
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
                     <ImageMessage message={message} setOpenedImg={setOpenedImg} setOpenedVideo={setOpenedVideo}
                                   setIsOpen={setIsOpen} />
                   }
                    {message.messageType === 'video' &&
                      <VideoMessage message={message} setOpenedImg={setOpenedImg} setOpenedVideo={setOpenedVideo}
                                    setIsOpen={setIsOpen} />}
                    {message.messageType === 'audio' &&
                      <AudioMessage content={message.content} />
                    }
                    {message.messageType === 'file' &&
                      <FileMessage content={message.content} />
                    }
                    {
                      message.messageType === MessageType.Voice &&
                      <VoiceMessage content={message.content} isCurrentUser={isCurrentUser} />
                    }
                    {
                      message.messageType === MessageType.GeoLocation &&
                      <GeoMessage message={message} setOpenedMap={setOpenedMap} setIsOpen={setIsOpen} />
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
        <div onClick={e => e.preventDefault()}>{openedImg &&
          <>
            <div
              className='relative h-80 w-80 min-h-[240px] min-w-[240px] sm:min-w-[384px] sm:min-h-[384px] sm:h-full sm:w-full '>
              <Image src={openedImg} alt={openedImg} fill />
            </div>
            <div className='mt-6'>
              <Button onClick={(e) => {
                e.preventDefault();
                saveAs(openedImg, `${getLastItem(openedImg)}`);
              }}>Download</Button>
            </div>
          </>
        }
          {openedVideo &&
            <div className='video-wrapper w-96 h-96'>
              <iframe
                src={openedVideo}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen>
              </iframe>
              <div className='mt-6'>
                <Button onClick={(e) => {
                  e.preventDefault();
                  saveAs(openedVideo, `${getLastItem(openedVideo)}`);
                }}>Download</Button>
              </div>
            </div>
          }
          {
            openedMap &&
            <div className='z-10'>
              <Map clientGeoData={[openedMap.geoLocation?.coordinates[1]!, openedMap.geoLocation?.coordinates[0]!]!}
                   type='message' content={openedMap.content} />
            </div>
          }
        </div>
      </Modal>
    </div>
  );
};

