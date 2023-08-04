import { Download, File } from 'lucide-react';
import { saveAs } from 'file-saver';
import { getLastItem } from '@/lib';
import React from 'react';

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

