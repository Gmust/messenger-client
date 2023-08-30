import { Message } from '@/types/chat';
import { ForwardRefExoticComponent } from 'react';
import { LucideProps } from 'lucide-react';
import { formatTimeToDate } from '@/lib';
import { saveAs } from 'file-saver';

type FileMessageCardProps = Pick<Message, 'content' | 'timestamp'> & {
  Icon: ForwardRefExoticComponent<LucideProps>
}

export const FileMessageCard = ({ content, timestamp, Icon }: FileMessageCardProps) => {

  const handelDownloadFile = () => {
    saveAs(
      `${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`,
      `openedImg`
    );
  };

  return (
    <div className='flex w-52 sm:w-[380px] p-3 justify-between'>
      <div className='flex'>
        <Icon />
        <div className='has-tooltip'>
          <p className='truncate w-20 sm:w-52 text-blue-500 underline cursor-pointer hover:text-blue-800'
             onClick={handelDownloadFile}>
            {content}
          </p>
          <p className='break-words tooltip rounded shadow-lg p-2 bg-gray-100 text-zinc-400 right-4'>
            {content}
          </p>
        </div>
      </div>
      <p>
        {formatTimeToDate(timestamp!)}
      </p>
    </div>
  );
};

