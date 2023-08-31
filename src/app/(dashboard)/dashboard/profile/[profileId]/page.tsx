import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { ProfilePage } from '@/components/pages/ProfilePage/ProfilePage';
import { authOptions } from '@/lib/auth';
import { authService } from '@/service/authService';
import { userService } from '@/service/userService';

interface ProfilePageProps {
  params: {
    profileId: string
  };
}

const page = async ({ params }: ProfilePageProps) => {

  const session = await getServerSession(authOptions);
  if (!session || !params.profileId) return notFound();
  const user = await authService.getUserById(params.profileId, session.user.access_token);
  const userFiles = await userService.getAllUserFiles(params.profileId, session.user.access_token);
  return (
    <>
      <div className=''>
        <ProfilePage {...user} userFiles={userFiles!} />
      </div>
    </>

  );
};

export default page;