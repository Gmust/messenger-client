import { Dispatch, SetStateAction } from 'react';
import { Menu } from '@headlessui/react';

import { DropdownList } from '@/components/shared/Dropdown';
import { ImageMessageCard } from '@/components/shared/ImageMessageCard';
import { Message } from '@/types/chat';


interface ImagesListProps {
  imageMessages: Message[],
  loading: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  setOpenedImg: Dispatch<SetStateAction<string>>,
}

export const ImagesList = ({ imageMessages, loading, setIsOpen, setOpenedImg }: ImagesListProps) => {
  return (
    <DropdownList count={imageMessages.length} title='Images'
                  className='absolute grid grid-cols-3 mt-16 bg-white drop-shadow-lg max-h-52 overflow-auto scroll-auto'>
      {imageMessages.map((message) =>
        <Menu.Item key={message._id}>
          {({ close }) =>
            <ImageMessageCard content={message.content} key={message._id}
                              timestamp={message.timestamp} close={close}
                              loading={loading} setOpenedImg={setOpenedImg} setIsOpen={setIsOpen} />
          }
        </Menu.Item>
      )}
    </DropdownList>
  );
};

