'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createImgUrl, getLastItem, notifyMe, pusherClient, toPusherKey } from '@/lib';
import { Session } from 'next-auth';
import toast from 'react-hot-toast';
import { UnseenChatToast } from '@/components/elements/UnseenChatToast/UnseenChatToast';

interface SidebarChatList {
  chats: Chat[],
  session: Session
}

interface ExtendedMessage {
  senderImage: string,
  senderName: string,
  message: Message
}

export const SidebarChatList = ({ chats, session }: SidebarChatList) => {

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`));
    const chatHandler = (extendedMessage: ExtendedMessage) => {
      const shouldNotify = chats.some((chat) => chat._id !== getLastItem(pathname!));
      if (!shouldNotify) return;
      toast.custom((t) => (
        <UnseenChatToast t={t} sessionId={session.user.id} senderId={extendedMessage.message.sender}
                         senderImg={extendedMessage.senderImage} senderName={extendedMessage.senderName}
                         senderMessage={extendedMessage.message.content} chatId={extendedMessage.message.chat} />
      ));
      notifyMe(extendedMessage.senderName, extendedMessage.message.content, createImgUrl(extendedMessage.senderImage));
      setUnseenMessages((prev) => [...prev, extendedMessage.message]);
    };
    const newFriendHandler = () => {
      router.refresh();
    };

    pusherClient.bind('new-message', chatHandler);
    pusherClient.bind('new-friend', newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:friends`));
      pusherClient.unbind('new-message', chatHandler);
      pusherClient.unbind('new-friend', newFriendHandler);
    };

  }, [pathname, session.user.id, router]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev?.filter((msg) => !pathname.includes(msg.chat));
      });
    }
  }, [pathname]);

  return (
    <ul role='link' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {
        chats.sort().map((chat) => {
          const chatName = chat.participants.map((member) => {
            return member._id === session.user.id ? null : member.name;
          });

          const friend = chat.participants.find((member) => member._id !== session.user.id);
          const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
            return unseenMsg.sender === friend!._id;
          }).length;

          return (
            <li key={chat._id} className='flex'>
              <a href={`/dashboard/chat/${chat._id}`}
                 className='text-gray-700 hover:text-violet-600 hover:bg-gray-50 group flex items-center gap-y-3
                  rounded-md p-2 text-base leading-6 font-semibold'>
                {chatName}
                {unseenMessagesCount! > 0 ?
                  <div className='bg-violet-600 font-medium text-sm text-white w-4 h-4 rounded-full flex justify-center
                                 items-center p-2 ml-1'>
                    {unseenMessagesCount}
                  </div>
                  : null}
              </a>
            </li>
          );
        })
      }
    </ul>
  );
};

