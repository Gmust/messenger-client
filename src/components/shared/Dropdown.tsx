import React from 'react';
import { Menu } from '@headlessui/react';


interface DropdownListProps {
  children: React.ReactNode;
  title: string,
  count?: number,
  className: string
}

export const DropdownList = ({ children, count, title,className }: DropdownListProps) => {
  return (
    <Menu>
      <Menu.Button
        className='hover:bg-gray-300 text-white cursor-pointer'>
        {count && <p className='font-bold text-gray-700 text-xl'>{count}</p>}
        <p className='text-gray-400'>{title}</p>
      </Menu.Button>
      <Menu.Items
        className={className}>
        {children}
      </Menu.Items>
    </Menu>
  );
};

