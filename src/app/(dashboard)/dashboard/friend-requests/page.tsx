import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { userService } from '@/service/userService';
import { FriendRequests } from '@/components/pages/FriendRequests/FriendRequests';

const page = async () => {

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { outComingReq, incomingReq } = await userService.getFriendRequests(
    { userId: session.user.id, access_token: session.user.access_token }
  );

  return (
    <section>
      <h1 className='text-4xl font-bold mb-8'>Incoming/Out-coming friend requests</h1>
      <FriendRequests incomingFriendRequests={incomingReq} outComingFriendsRequests={outComingReq} />
    </section>
  );

};


export default page;