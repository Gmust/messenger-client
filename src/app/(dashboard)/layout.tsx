import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignOutBtn } from '@/components/elements';
import { FriendRequestsSidebarOption } from '@/components/elements/FriendRequestsSidebar/FriendRequestsSidebarOption';
import { MobileChatLayout } from '@/components/elements/MobileChatLayout';
import { SidebarChatList } from '@/components/elements/SidebarChatList/SidebarChatList';
import { VolumeHandler } from '@/components/elements/VolumeHandler/VolumeHandler';
import { Icon, Icons } from '@/components/icons/icons';
import { createImgUrl } from '@/lib';
import { authOptions } from '@/lib/auth';
import { chatService } from '@/service/chatService';
import { userService } from '@/service/userService';

interface LayoutProps {
  children: React.ReactNode;
}

export interface SidebarOption {
  id: number,
  name: string,
  href: string
  Icon: Icon,
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus'
  }
];

export const metadata = {
  title: 'FriendZone | Dashboard',
  description: 'Your dashboard'
};

const Layout = async ({ children }: LayoutProps) => {

  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const { incomingReq } = await userService.getFriendRequests(
    { userId: session!.user.id, access_token: session!.user.access_token }
  );
  const userChats = await chatService.getAllUserChats(session.user.id, undefined, session.user.access_token);
  const imageUrl = createImgUrl(session.user.image!);


  return (
    <div className='w-full h-screen flex'>
      <div className='md:hidden'>
        <MobileChatLayout session={session}
                          image={imageUrl}
                          friends={session.user.friends}
                          sidebarOptions={sidebarOptions}
                          unseenRequestCount={incomingReq}
                          chats={userChats}
        />
      </div>
      <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200
                      bg-white px-6 '>
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
          <Icons.Twitter className='h-10 w-auto text-violet-600' />
        </Link>

        {session.user.friends.length > 0 ? <div className='text-base font-semibold leading-6 text-gray-400'>
          Your chats
        </div> : null}

        <nav className='flex flex-1 flex-col'>
          <ul role='link' className='flex flex-1 flex-col gap-y-7'>
            {userChats && <li>
              <SidebarChatList chats={userChats} session={session} />
            </li>}
            <li>
              <div className='text-base font-semibold leading-6 text-gray-400'>
                Overview
              </div>
              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {sidebarOptions.map(item => {
                  const Icon = Icons[item.Icon];
                  return (
                    <li key={item.id}>
                      <Link href={item.href}
                            className='group  text-gray-700 hover:text-violet-700-600 hover:bg-gray-50  flex gap-3
                             rounded-md p-2 text-base leading-6 font-semibold'
                      >
                        <span
                          className='text-gray-400 border-gray-200 group-hover:border-violet-700 group-hover:text-violet-700 flex
                                     h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                            <Icon className='h-4 w-4' />
                        </span>
                        <span
                          className='truncate group-hover:border-violet-700 group-hover:text-violet-700'>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}

                <li>
                  <FriendRequestsSidebarOption userId={session?.user.id!}
                                               initialUnseenRequestsCount={incomingReq.length} />
                </li>
              </ul>
            </li>


            <li className='-mx-6 mt-auto flex flex-col '>

              <VolumeHandler />

              <div className='flex items-center justify-between'>
                <div
                  className='flex items-center text-base font-semibold leading-6 text-gray-400
                   space-x-4 justify-around p-2'>
                  <Link href={`http://localhost:3000/dashboard/profile/${session.user.id}`} replace={true}
                        className='relative h-8 w-8 bg-gray-50'>
                    <Image fill referrerPolicy='no-referrer' className='rounded-full'
                           src={imageUrl} sizes=''
                           alt='Your profile picture' />
                  </Link>
                  <span className='sr-only'>Your profile</span>
                  <div className='flex flex-col w-[180px]'>
                  <span aria-hidden={true} className='truncate'>
                    {session?.user?.name}
                  </span>
                    <span className='text-base text-zinc-400 truncate' aria-hidden={true}>
                    {session?.user?.email}
                  </span>
                  </div>
                </div>
                <SignOutBtn className='h-full aspect-square' />
              </div>

            </li>
          </ul>
        </nav>
      </div>

      <aside className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </aside>
    </div>
  );
};

export default Layout;