export const DataInformation = ({ friends }: { friends: User[] }) => {
  return (
    <div className='grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0'>
      <div>
        <p className='font-bold text-gray-700 text-xl'>{friends.length}</p>
        <p className='text-gray-400'>Friends</p>
      </div>
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

