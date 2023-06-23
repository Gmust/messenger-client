import { authService } from '@/service/authService';

const Page = async ({ searchParams }: { searchParams: any }) => {
  const user = await authService.getUser(searchParams.access_token);
  console.log(user);

  return (
    <div>
    </div>
  );
};

export default Page;