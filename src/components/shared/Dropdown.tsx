import React from 'react';
import { Menu } from '@headlessui/react';


interface DropdownListProps {
  children: React.ReactNode;
  title: string,
  count?: number
}

export const DropdownList = ({ children, count, title }: DropdownListProps) => {
  return (
    <Menu>
      <Menu.Button
        className='hover:bg-gray-300 text-white cursor-pointer'>
        {count && <p className='font-bold text-gray-700 text-xl'>{count}</p>}
        <p className='text-gray-400'>{title}</p>
      </Menu.Button>
      <Menu.Items
        className=' absolute grid grid-cols-3 mt-16 bg-white drop-shadow-lg divide-y max-h-52 overflow-auto scroll-auto'>
        {children}
      </Menu.Items>
    </Menu>
  );
};

