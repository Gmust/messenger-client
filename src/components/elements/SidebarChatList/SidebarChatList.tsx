'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLastItem, pusherClient, toPusherKey } from '@/lib';
import { Session } from 'next-auth';
import toast from 'react-hot-toast';
import { UnseenChatToast } from '@/components/elements/UnseenChatToast/UnseenChatToast';

interface SidebarChatList {
  chats: Chat[],
  session: Session
}

interface ExtendedMessage extends Message {
  senderImage: string,
  senderName: string
}

export const SidebarChatList = ({ chats, session }: SidebarChatList) => {

  const [unseenMessages, setUnseenMessages] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`));

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify = chats.some((chat) => chat._id === getLastItem(pathname!));
      alert('here')
      console.log(shouldNotify);
      console.log(pathname);
      console.log('--------------------------');
      console.log(getLastItem(pathname!));
      if (!shouldNotify) return;
      toast.custom((t) => (
        <UnseenChatToast t={t} sessionId={session.user.id} senderId={message.sender} senderImg={message.senderImage}
                         senderName={message.senderName} senderMessage={message.content} chatId={message.chat} />
      ));
      setUnseenMessages((prev) => [...prev, message]);
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
        return prev?.filter((msg) => !pathname.includes(msg.senderId));
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
          return (
            <li key={chat._id} className='flex'>
              <a href={`/dashboard/chat/${chat._id}`}
                 className='text-gray-700 hover:text-violet-600 hover:bg-gray-50 group flex items-center gap-y-3
                  rounded-md p-2 text-base leading-6 font-semibold'>
                {chatName}
                {/*     {unseenMessagesCount! > 0 ?
                  <div className='bg-violet-600 font-medium text-sm text-white w-4 h-4 rounded-full flex justify-center
                                 items-center p-2 ml-1'>
                    {unseenMessagesCount}
                  </div>
                  : null}*/}
              </a>
            </li>
          );
        })
      }
    </ul>
  );
};

