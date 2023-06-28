'use client';

import { Check, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { userService } from '@/service/userService';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

type FriendRequestCardProps = FriendRequest & { type: 'incoming' | 'outcoming' }

export const FriendRequestCard = ({ _id, image, email, type }: FriendRequestCardProps) => {

  const { data: session } = useSession();

  const acceptFriend = async () => {
    try {
      const res = userService.acceptFriendRequest(
        {
          receiverId: session!.user.id,
          senderId: _id,
          access_token: session!.user.access_token
        }
      );
      toast.success('User successfully added to friends ');
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const denyFriend = async () => {
    try {
      const res = userService.declineFriendRequest(
        {
          receiverId: session!.user.id,
          senderId: _id,
          access_token: session!.user.access_token
        }
      );
      toast.success(`Friend request from ${email} denied`);
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const denyRequest = () => {
    try {
      const res = userService.declineRequest(
        {
          receiverId: session!.user.id,
          senderId: _id,
          access_token: session!.user.access_token
        }
      );
      toast.success(`Friend request to ${email} denied`);
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  const imageUrl = image.startsWith('https://lh3.googleusercontent.com') ? image : `http://localhost:8080/userimages/${image}`;

  const router = useRouter();
  return (
    <div key={_id} className='flex gap-4 items-center'>
      <UserPlus className='text-black' />
      <Image src={`${imageUrl}`} alt='user image' width={30} height={30}
             className='rounded-md' />
      <p className='font-medium text-lg'>{email}</p>
      {type === 'incoming' &&
        <button className='w-8 h-8 bg-violet-600 hover:bg-violet-700 grid place-items-center rounded-full
                                 transition hover:shadow-md' aria-label='accept friend'
                onClick={() => acceptFriend()}
        >
          <Check className='font-semibold text-white w-3/4 h-3/4' />
        </button>
      }
      <button className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full
                                 transition hover:shadow-md' aria-label='denu friend'
              onClick={() => {
                type === 'incoming' ? denyFriend() : denyRequest();
              }}
      >
        <X className='font-semibold text-white w-3/4 h-3/4'
        />
      </button>
    </div>
  );
};

