import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { chatService } from '@/service/chatService';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createImgUrl } from '@/lib';

const Dashboard = async () => {

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const chats = await chatService.getAllUserChats(session.user.id, session.user.access_token);


  return (
    <div className='container py-12'>
      <h1 className='text-5xl font-bold mb-8'>Recent chats</h1>
      {chats?.length! > 0 ? chats?.map(async (chat) => {

          const chatInfo = await chatService.getChatInfo(chat._id, session.user.access_token);
          const chatPartner = await chatInfo!.participants.filter((user) => {
            return user._id === session.user.id ? null : user;
          }).sort()[0];

          return (
            <div key={chat._id} className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
              <div className='absolute right-4 inset-y-0 flex items-center'>
                <ChevronRight className='h-7 w-7 text-zinc-400' />
              </div>
              <Link href={`/dashboard/chat/${chat._id}`}
                    className='relative sm:flex'>
                <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                  <div className='relative h-6 w-6'>
                    <Image src={createImgUrl(chatPartner.image)} alt={`${chatPartner.name} avatar`} fill
                           referrerPolicy='no-referrer'
                           className='rounded-full' />
                  </div>
                </div>
                {chatInfo?.messages ?
                  <div>
                    <h4 className='text-lg font-semibold'>
                      {chatPartner.name}
                    </h4>
                    <p className='mt-1 max-w-md '>
                    <span className='text-zinc-400'>
                      {
                        chatInfo?.messages.at(-1)!.sender === session.user.id
                          ? 'You: '
                          : ''
                      }
                    </span>
                      {
                        chatInfo.messages.at(-1)!.content
                      }
                    </p>
                  </div>
                  : <div>Nothing to show </div>}
              </Link>
            </div>
          );
        }
      ) : <div>Nothing to show </div>}
    </div>
  );
};


export default Dashboard;