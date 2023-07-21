'use client';

import { Button } from '@/components/shared/Button';
import Image from 'next/image';
import { createImgUrl } from '@/lib';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { chatService } from '@/service/chatService';
import { useSession } from 'next-auth/react';

type  ProfilePageProps = Omit<User, 'access_token' | 'refresh_token'>

export const ProfilePage = ({ _id, name, friends, image, email }: ProfilePageProps) => {

  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const handleStartMessaging = async () => {
    setLoading(true);
    try {
      const chat = await chatService.getChatByParticipants(session?.user.id!, _id, session?.user.access_token!);

      if (!chat) {
        toast.error('Something went wrong!');
        return;
      }

      router.replace(`dashboard/chat/${chat._id}`);
    } catch (e: any) {
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-16'>
      <div className='p-8 bg-white shadow mt-8'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <div className='grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0'>
            <div>
              <p className='font-bold text-gray-700 text-xl'>{friends.length}</p>
              <p className='text-gray-400'>Friends</p>
            </div>
            <div>
              <p className='font-bold text-gray-700 text-xl'>10</p>
              <p className='text-gray-400'>Image</p>
            </div>
            <div>
              <p className='font-bold text-gray-700 text-xl'>89</p>
              <p className='text-gray-400'>Files</p>
            </div>
          </div>
          <div className='relative'>
            <div
              className='w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500'>
              <Image src={createImgUrl(image)} alt={`${name} image`} fill referrerPolicy='no-referrer'
                     className='rounded-full' />
            </div>
          </div>
          <div className='space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center'>
            {friends.some((friend) => friend._id === session?.user.id) ?
              <Button className='py-7 px-4 uppercase font-medium  bg-red-500 hover:bg-red-700' isLoading={loading}>
                Delete from friends
              </Button>
              :
              <Button className='py-7 px-4 uppercase font-medium  bg-indigo-700' isLoading={loading}>
                Add to friends
              </Button>
            }
            <Button className='py-7 px-4 uppercase font-medium' onClick={handleStartMessaging} isLoading={loading}>
              Message
            </Button>
          </div>
        </div>

        <div className='mt-20 text-center border-b pb-12 space-y-4'>
          <h1 className='text-4xl font-medium text-gray-700'>{name}</h1>
          <div className='font-light text-xl text-gray-500'>
            {email}
          </div>
        </div>

        <div className='mt-12 flex flex-col justify-center'>
          <p className='text-gray-600 text-center font-light lg:px-16'>An artist of considerable range, Ryan — the name
            taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music,
            giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.</p>
        </div>
      </div>


      <div className='has-tooltip flex flex-col  items-center '>
        <Button className='flex w-full mt-8' onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-zinc-400 mt-20 '>Go back</span>
      </div>
    </div>
  );
};

