'use client';

import { FriendRequestsCard } from '@/components/elements';
import { useEffect, useState } from 'react';
import { createImgUrl, notifyMe, pusherClient, toPusherKey } from '@/lib';
import { useSession } from 'next-auth/react';

export const FriendRequests = (
  { incomingFriendRequests, outComingFriendsRequests }: {
    incomingFriendRequests: FriendRequests[],
    outComingFriendsRequests: FriendRequests[]
  }
) => {

  const { data: session } = useSession();
  const [incoming, setIncoming] = useState<FriendRequests[]>(incomingFriendRequests);
  const [outcoming, setOutcoming] = useState<FriendRequests[]>(outComingFriendsRequests);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${session?.user.id}:incoming-friend-requests`)
    );

    const friendRequestHandler = ({ _id, senderId, receiverId }: FriendRequests) => {
      notifyMe('New friend request', `Friend request from ${senderId.name}`, createImgUrl(senderId.image));
      setIncoming((prev) => [...prev, { _id, senderId, receiverId }]);
    };

    pusherClient.bind('incoming-friend-requests', friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${session?.user.id}:incoming-friend-requests`)
      );
      pusherClient.unbind('incoming-friend-requests', friendRequestHandler);
    };
  }, [session?.user.id]);


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 md:space-x-10'>
      <div className='flex flex-col'>
        <h2 className='text-xl text-gray-600 mb-4'>Incoming friend requests</h2>
        {incoming && incoming.length > 0 ?
          incoming.map(req =>
            <FriendRequestsCard key={req._id} type='incoming' incomingRequests={incomingFriendRequests}
                                setIncoming={setIncoming} email={req.senderId.email} name={req.senderId.name}
                                image={req.senderId.image} _id={req.senderId._id}
            />
          )
          :
          <p className='text-gray-500'>
            There is no incoming friend requests at the moment
          </p>
        }
      </div>

      <div className='flex flex-col'>
        <h2 className='text-xl text-gray-600 mb-4'>Out coming friend requests</h2>
        {outcoming && outcoming.length > 0 ?
          outcoming.map(req =>
            <FriendRequestsCard key={req._id} type='outcoming' outcomingRequests={outcoming}
                                setOutcoming={setOutcoming} email={req.receiverId.email} name={req.receiverId.name}
                                image={req.receiverId.image} _id={req.receiverId._id} />
          )
          :
          <p className='text-gray-500'>
            There is no out coming friend requests at the moment
          </p>
        }
      </div>
    </div>
  );
};

