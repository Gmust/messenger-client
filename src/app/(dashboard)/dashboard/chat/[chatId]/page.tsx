import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { ChatInput, Messages } from '@/components/elements';
import { createImgUrl } from '@/lib';
import { authOptions } from '@/lib/auth';
import { chatService } from '@/service/chatService';
import { User } from '@/types/user';

interface ChatPageProps {
  params: {
    chatId: string
  };
}


const page = async ({ params }: ChatPageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const chatInfo = await chatService.getChatInfo(chatId, undefined, session.user.access_token);
  if (!chatInfo) notFound();
  const initialMessages = chatInfo!.messages;
  const chatPartner = chatInfo!.participants.filter((user: User) => {
    return user._id === session.user.id ? null : user;
  }).sort()[0];


  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <Link href={`/dashboard/profile/${chatPartner._id}`}>
              <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                <Image fill src={createImgUrl(chatPartner.image)} referrerPolicy='no-referrer'
                       alt={`${chatPartner.name} profile picture `} className='rounded-full' />
              </div>
            </Link>
          </div>
          <div className='flex flex-col leadwing-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>{chatPartner.name}</span>
            </div>
            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages
        initialMessages={initialMessages} sessionId={session.user.id}
        chatPartnerImg={chatPartner.image} sessionImg={session.user.image!} chatId={chatId} />
      <ChatInput chatPartner={chatPartner} chatId={chatId}
        //@ts-ignore
                 user={session.user} />
    </div>
  );
};

export default page;