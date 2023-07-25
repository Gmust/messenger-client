'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/shared/Button';
import { createImgUrl } from '@/lib';
import { chatService } from '@/service/chatService';
import { userService } from '@/service/userService';

import { DataInformation } from './DataInformation';
import { ProfileBio } from './ProfileBio';
import { ProfileButtons } from './ProfileButtons';
import { ProfileName } from './ProfileName';

type  ProfilePageProps = Omit<User, 'access_token' | 'refresh_token'>

export const ProfilePage = ({ _id, name, friends, image, email, bio }: ProfilePageProps) => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [newBio, setNewBio] = useState<string>(bio);
  const [newName, setNewName] = useState<string>(name);

  const handleStartMessaging = async () => {
    setLoading(true);
    try {
      const chat = await chatService.getChatByParticipants(session?.user.id!, _id, session?.user.access_token!);
      if (!chat) {
        toast.error('Something went wrong!');
        return;
      }
      router.replace(`${url}/dashboard/chat/${chat._id}`);
    } catch (e: any) {
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFriends = async () => {
    setLoading(true);
    try {
      const response = await userService.deleteFromFriends({
        receiverId: _id,
        senderId: session?.user.id!,
        access_token: session?.user.access_token!
      });
      router.refresh();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFriends = async () => {
    setLoading(true);
    try {
      await userService.addFriend({
        friendEmail: email,
        userId: session?.user.id!,
        access_token: session!.user.access_token
      });
      toast('Friend request sent!');
    } catch (e) {
      console.log(e);
      if (e instanceof AxiosError) {
        toast.error(e.response!.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeName = async () => {
    setLoading(true);
    try {
      const res = await userService.changeName({
        data: newName,
        userId: session?.user.id!,
        access_token: session!.user.access_token
      });
      toast.success('Name has changed!');
      setEdit(false);
      setNewName(res);
    } catch (e) {
      console.log(e);
      if (e instanceof AxiosError) {
        toast.error(e.response!.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeBio = async () => {
    setLoading(true);
    try {
      const res = await userService.changeBio({
        data: newBio,
        userId: session?.user.id!,
        access_token: session!.user.access_token
      });
      toast.success('Bio has changed!');
      setEdit(false);
      console.log(res);
      setNewBio(res);
    } catch (e) {
      console.log(e);
      if (e instanceof AxiosError) {
        toast.error(e.response!.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-16'>
      <div className='p-8 bg-white shadow mt-8'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <DataInformation friends={friends} />
          <div className='relative'>
            <div
              className='w-24 h-24 lg:w-48 lg:h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500'>
              <Image src={createImgUrl(image)} alt={`${name} image`} fill referrerPolicy='no-referrer'
                     className='rounded-full' />
            </div>
          </div>
          <ProfileButtons session={session!} _id={_id} loading={loading} friends={friends}
                          handleStartMessaging={handleStartMessaging} setEdit={setEdit} edit={edit}
                          handleAddToFriends={handleAddToFriends} handleRemoveFromFriends={handleRemoveFromFriends} />
        </div>

        <div className='mt-20 text-center border-b pb-12 space-y-4'>
          <ProfileName edit={edit} setEdit={setEdit} newName={newName} setNewName={setNewName}
                       handleChangeName={handleChangeName} />
          <div className='font-light text-xl text-gray-500'>
            {email}
          </div>
        </div>

        <ProfileBio edit={edit} newBio={newBio} bio={bio} setNewBio={setNewBio}
                    setEdit={setEdit} handleChangeBio={handleChangeBio} />
      </div>


      <div className='has-tooltip flex flex-col  items-center '>
        <Button className='flex w-full mt-8' onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-zinc-400 mt-20 '>Go back</span>
      </div>
      ;
    </div>
  )
    ;
};


