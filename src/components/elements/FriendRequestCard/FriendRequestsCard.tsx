'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Check, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { createImgUrl, pusherClient, toPusherKey } from '@/lib';
import { userService } from '@/service/userService';


type FriendRequestCardProps = FriendRequest &
  {
    type: 'incoming' | 'outcoming',
    incomingRequests?: FriendRequests[],
    outcomingRequests?: FriendRequests[],
    setIncoming?: SetStateAction<Dispatch<FriendRequests[]>>
    setOutcoming?: SetStateAction<Dispatch<FriendRequests[]>>
  }

export const FriendRequestsCard = ({
                                     _id,
                                     image,
                                     email,
                                     type,
                                     incomingRequests,
                                     outcomingRequests,
                                     setOutcoming,
                                     setIncoming
                                   }: FriendRequestCardProps) => {

  const { data: session } = useSession();
  const router = useRouter();

  const acceptFriend = async (senderId: string) => {
    try {
      const res = await userService.acceptFriendRequest(
        {
          receiverId: session!.user.id,
          senderId: _id,
          access_token: session!.user.access_token
        }
      );
      if (setIncoming) {
        // @ts-ignore
        setIncoming((prev) => prev.filter((req) => req.senderId._id !== senderId));
      }
      router.refresh();
      toast.success('User successfully added to friends ');
    } catch (e) {
      console.log(e);
    }
  };

  const denyFriend = async (senderId: string) => {
    try {
      const res = await userService.declineFriendRequest(
        {
          receiverId: session!.user.id,
          senderId: _id,
          access_token: session!.user.access_token
        }
      );
      if (setOutcoming) {
        // @ts-ignore
        setOutcoming((prev) => prev.filter((req) => req.senderId._id !== senderId));
      }
      router.refresh();
      toast.success(`Friend request from ${email} denied`);
    } catch (e) {
      console.log(e);
    }
  };

  const denyRequest = async (senderId: string) => {
    try {
      const res = await userService.declineRequest(
        {
          receiverId: session!.user.id,
          senderId: _id,
          access_token: session!.user.access_token
        }
      );
      // @ts-ignore
      setOutcoming((prev) => prev.filter((req) => req.senderId._id !== senderId));
      router.refresh();
      toast.success(`Friend request to ${email} denied`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${session?.user.id}:requests`)
    );

    const denyRequestHandler = (sender: User) => {
      // @ts-ignore
      setOutcoming((prev) => prev.filter((req) => req.senderId._id !== sender._id));
    };

    pusherClient.bind('deny-request', denyRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${session?.user.id}:requests`)
      );
      pusherClient.unbind('deny-request', denyRequestHandler);
    };
  }, [session?.user.id]);


  return (
    <div key={_id} className='flex gap-4 items-center'>
        <UserPlus className='text-black' />
       <Image src={createImgUrl(image)} alt='user image' width={30} height={30}
               className='rounded-md' />
        <p className='font-medium text-lg'>{email}</p>
      {type === 'incoming' &&
        <button className='w-8 h-8 bg-violet-600 hover:bg-violet-700 grid place-items-center rounded-full
                                 transition hover:shadow-md' aria-label='accept friend'
                onClick={() => acceptFriend(_id)}
        >
          <Check className='font-semibold text-white w-3/4 h-3/4' />
        </button>
      }
      <button className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full
                                 transition hover:shadow-md' aria-label='denu friend'
              onClick={() => {
                type === 'incoming' ? denyFriend(_id) : denyRequest(_id);
              }}
      >
        <X className='font-semibold text-white w-3/4 h-3/4'
        />
      </button>
    </div>
  );
};

