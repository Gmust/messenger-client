import { UserCard } from '@/components/elements/UserCard/UserCard';

export const DataInformation = ({ friends }: { friends: User[] }) => {
  return (
    <div className='grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0'>
      <div
        className='peer  hover:bg-gray-300 text-white cursor-pointer'>
        <p className='font-bold text-gray-700 text-xl'>{friends.length}</p>
        <p className='text-gray-400'>Friends</p>
      </div>
      <ul
        className='p-2 hidden absolute peer-hover:flex hover:flex w-[200px] mt-12 flex-col bg-white drop-shadow-lg
        divide-y max-h-52 overflow-auto scroll-auto'>
        {friends.map((friend) => <UserCard {...friend} key={friend._id} />)}
      </ul>
      <div>
        <p className='font-bold text-gray-700 text-xl'>10</p>
        <p className='text-gray-400'>Image</p>
      </div>
      <div>
        <p className='font-bold text-gray-700 text-xl'>89</p>
        <p className='text-gray-400'>Files</p>
      </div>
    </div>
  );
};

