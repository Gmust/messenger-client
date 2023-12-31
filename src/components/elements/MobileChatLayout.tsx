'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';

import { SidebarOption } from '@/app/(dashboard)/layout';
import { FriendRequestsSidebarOption } from '@/components/elements/FriendRequestsSidebar/FriendRequestsSidebarOption';
import { SidebarChatList } from '@/components/elements/SidebarChatList/SidebarChatList';
import { SignOutBtn } from '@/components/elements/SignOutBtn/SignOutBtn';
import { VolumeHandler } from '@/components/elements/VolumeHandler/VolumeHandler';
import { Icon, Icons } from '@/components/icons/icons';
import { Button, buttonVariants } from '@/components/shared/Button';
import { Chat } from '@/types/chat';

interface MobileChatLayoutProps {
  friends: string[],
  session: Session,
  sidebarOptions: SidebarOption[],
  unseenRequestCount: number,
  image: string,
  chats: Chat[] | undefined
}

export const MobileChatLayout = ({
                                   session,
                                   friends,
                                   unseenRequestCount,
                                   sidebarOptions,
                                   image,
                                   chats
                                 }: MobileChatLayoutProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const pathName = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathName]);

  return (
    <div className='fixed bg-zinc-50 border-b border-zinc-200 top-0 inset-x-0 py-2 px-4'>
      <div className='w-full flex justify-between items-center'>
        <Link
          href='/dashboard'
          className={buttonVariants({ variant: 'ghost' })}>
          <Icons.Twitter className='h-6 w-auto text-indigo-600' />
        </Link>
        <Button onClick={() => setOpen(true)} className='gap-4'>
          Menu <Menu className='h-6 w-6' />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <div className='fixed inset-0' />

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'>
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-base font-semibold leading-6 text-gray-900'>
                            Dashboard
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                              onClick={() => setOpen(false)}>
                              <span className='sr-only'>Close panel</span>
                              <X className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {friends.length > 0 ? (
                          <div className='text-xs font-semibold leading-6 text-gray-400'>
                            Your chats
                          </div>
                        ) : null}

                        <nav className='flex flex-1 flex-col'>
                          <ul
                            role='list'
                            className='flex flex-1 flex-col gap-y-7'>
                            <li>
                              {
                                chats &&
                                <SidebarChatList
                                  chats={chats!}
                                  session={session}
                                />}
                            </li>
                            <li>
                              <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Overview
                              </div>
                              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sidebarOptions.map((option) => {
                                  const Icon = Icons[option.Icon];
                                  return (
                                    <li key={option.name}>
                                      <Link
                                        href={option.href}
                                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                                        <span
                                          className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                          <Icon className='h-4 w-4' />
                                        </span>
                                        <span className='truncate'>
                                          {option.name}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}

                                <li>
                                  <FriendRequestsSidebarOption
                                    userId={session.user.id}
                                    initialUnseenRequestsCount={unseenRequestCount}
                                  />
                                </li>
                              </ul>
                            </li>

                            <li className='absolute bottom-0 -ml-6 mt-auto flex flex-col'>
                              <VolumeHandler/>
                              <div
                                className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                  <Link href={`http://localhost:3000/dashboard/profile/${session.user.id}`}
                                        replace={true}>
                                    <Image
                                      fill
                                      referrerPolicy='no-referrer'
                                      className='rounded-full'
                                      src={image}
                                      alt='Your profile picture'
                                    />
                                  </Link>
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                  <span aria-hidden='true'>
                                    {session.user.name}
                                  </span>
                                  <span
                                    className='text-xs text-zinc-400'
                                    aria-hidden='true'>
                                    {session.user.email}
                                  </span>
                                </div>
                                <SignOutBtn className='h-full aspect-square' />
                              </div>

                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};
