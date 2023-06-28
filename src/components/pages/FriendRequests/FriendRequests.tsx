import { FriendRequestCard } from '@/components/elements';

export const FriendRequests = (
  { incomingFriendRequests, outComingFriendsRequests }: {
    incomingFriendRequests: FriendRequests[],
    outComingFriendsRequests: FriendRequests[]
  }
) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 md:space-x-10'>
      <div className='flex flex-col'>
        <h2 className='text-xl text-gray-600 mb-4'>Incoming friend requests</h2>
        {incomingFriendRequests && incomingFriendRequests.length > 0 ?
          incomingFriendRequests.map(req =>
            <FriendRequestCard {...req.senderId} key={req._id} type='incoming' />
          )
          :
          <p className='text-gray-500'>
            There is no incoming friend requests at the moment
          </p>
        }
      </div>

      <div className='flex flex-col'>
        <h2 className='text-xl text-gray-600 mb-4'>Out coming friend requests</h2>
        {outComingFriendsRequests && outComingFriendsRequests.length > 0 ?
          outComingFriendsRequests.map(req =>
            <FriendRequestCard {...req.receiverId} key={req._id} type='outcoming' />
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

