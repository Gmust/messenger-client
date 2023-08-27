'use client';

import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { ProfileImage } from '@/components/pages/ProfilePage/ProfileImage';
import { Button } from '@/components/shared/Button';
import { useAxiosAuth } from '@/lib/hooks';
import { chatService } from '@/service/chatService';
import { userService } from '@/service/userService';
import { AllUserFiles, User } from '@/types/user';

import { DataInformation } from './DataInformation';
import { ProfileBio } from './ProfileBio';
import { ProfileButtons } from './ProfileButtons';
import { ProfileName } from './ProfileName';

type  ProfilePageProps = Omit<User, 'access_token'|'refresh_token'> & {
  userFiles: AllUserFiles
}

export const ProfilePage = ({ _id, name, friends, image, email, bio, userFiles }: ProfilePageProps) => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [newBio, setNewBio] = useState<string>(bio);
  const [newName, setNewName] = useState<string>(name!);
  const [newImage, setNewImage] = useState<File | null>(null);
  const axiosAuth = useAxiosAuth();

  const handleStartMessaging = async () => {
    setLoading(true);
    try {
      const chat = await chatService.getChatByParticipants(axiosAuth, session?.user.id!, _id);
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
        axiosInstance: axiosAuth,
        receiverId: _id,
        senderId: session?.user.id!
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
        axiosInstance: axiosAuth,
        friendEmail: email!,
        userId: session?.user.id!
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
        axiosInstance: axiosAuth,
        data: newName,
        userId: session?.user.id!
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
        axiosInstance: axiosAuth,
        data: newBio,
        userId: session?.user.id!
      });
      toast.success('Bio has changed!');
      setEdit(false);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImage(e.target.files[0]);
    } else {
      console.log('No files found in the event object.');
    }
  };

  const handleUploadImage = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', session?.user.email!);
      formData.append('newPhoto', newImage!);
      const res = await userService.changePhoto(formData, axiosAuth);
      toast.success(res.Msg);
      router.refresh();
      setNewImage(null);
      setEdit(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-16'>
      <div className='p-8 bg-white shadow -mt-8'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <DataInformation friends={friends} userFiles={userFiles} />
          <div className='flex flex-col'>
            <ProfileImage image={image!} name={newName} edit={edit} />
            {edit ?
              <div className='flex flex-col'>
                <div className='flex w-full mt-28 items-center justify-center bg-grey-lighter'>
                  <label
                    className='w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg
                   tracking-wide uppercase border border-blue cursor-pointer hover:bg-fuchsia-700 hover:text-white'>
                    <UploadCloud className='h-8 w-8' />
                    <span className='mt-2 text-base leading-normal'>Change photo</span>
                    <input type='file' className='hidden' onChange={handleFileChange} accept='image/jpeg, image/png' />
                  </label>
                </div>
                {newImage && <div className='p-2 flex'>
                  <span>
                  {newImage.name}
                  </span>
                  <Button onClick={handleUploadImage} className='cursor-pointer'>
                    Send
                  </Button>
                </div>}
              </div>
              : null}
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
        <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-zinc-400 mt-20'>Go back</span>
      </div>
    </div>
  );
};


