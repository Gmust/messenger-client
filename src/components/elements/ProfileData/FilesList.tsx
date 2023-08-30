import { Menu } from '@headlessui/react';

import { DropdownList } from '@/components/shared/Dropdown';
import { Message } from '@/types/chat';
import { FileTypes } from '@/types/enums';
import { FileIcons } from '@/components/icons/icons';
import { LucideProps } from 'lucide-react';
import { FileMessageCard } from '@/components/shared/FileMessageCard';


interface FilesListProps {
  fileMessages: Message[],
  loading: boolean,
}

export const FilesList = ({ fileMessages, loading }: FilesListProps) => {
  return (
    <DropdownList count={fileMessages.length} title='Files'
                  className='absolute flex flex-col mt-16 bg-white drop-shadow-lg divide-y max-h-52 overflow-auto scroll-auto'>
      {fileMessages.map((message) => {
          const ext = message.content.split('.').pop();
          let Icon: React.ForwardRefExoticComponent<LucideProps>;
          if (ext === FileTypes.Pdf) {
            Icon = FileIcons.FileSearch;
          } else if (ext === FileTypes.Zip) {
            Icon = FileIcons.FileArchive;
          }
          return (
            <Menu.Item key={message._id}>
              {({ close }) =>
                <FileMessageCard content={message.content} timestamp={message.timestamp} Icon={Icon} />
              }
            </Menu.Item>
          );

        }
      )}
    </DropdownList>
  );
};

