import React from 'react';
import { saveAs } from 'file-saver';
import { Download, File } from 'lucide-react';

import { getLastItem } from '@/lib';

export const FileMessage = ({ content }: { content: string }) => {
  return (
    <div className='flex'>
      <File />
      <span className='truncate overflow-hidden truncate w-16 md:w-60'>{content}</span>
      <Download className='w-6 h-6 cursor-pointer'
                onClick={(e) => {
                  e.preventDefault();
                  saveAs(`${process.env.NEXT_PUBLIC_BACKEND_CHAT_FILES_URL}${content}`!, `${getLastItem(content!)}`, { autoBom: true });
                }} />
    </div>
  );
};

