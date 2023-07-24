import { AddFriendBtn } from '@/components/elements/AddFriendBtn/AddFriendBtn';
import { SearchUsers } from '@/components/elements/SearchUsers/SearchUsers';

const page = () => {

  return (
    <section className='pt-8 space-y-2'>
      <h1 className='text-4xl font-bold mb-8'>Add your friend</h1>
      <AddFriendBtn />
      <div className='text-xl text-black font-bold'>
        Or
      </div>
      <SearchUsers />
    </section>
  );

};


export default page;