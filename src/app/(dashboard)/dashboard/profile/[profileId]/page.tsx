import { authService } from '@/service/authService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { ProfilePage } from '@/components/pages/ProfilePage/ProfilePage';

interface ProfilePageProps {
  params: {
    profileId: string
  };
}

const page = async ({ params }: ProfilePageProps) => {

  const session = await getServerSession(authOptions);
  if (!session || !params.profileId) return notFound();
  const user = await authService.getUserById(params.profileId, session.user.access_token);


  return (
    <>
      <ProfilePage {...user} />
    </>
  );
};

export default page;