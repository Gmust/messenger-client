import { Dispatch, SetStateAction } from 'react';
import { MessageType } from '@/types/enums';

export interface Chat {
  _id: string,
  participants: User[],
  messages: Message[]
}

export interface Message {
  _id?: string,
  sender: string,
  recipient: string,
  messageType?: MessageType
  content: string,
  timestamp?: number | Date,
  chat: string,
  geoLocation?: {
    type: string,
    coordinates: number[]
  }
}


export interface FileInputProps {
  selectedDataURL: string,
  file: File | null,
  setFile: Dispatch<SetStateAction<File | null>>
  setSelectedDataURL: Dispatch<SetStateAction<string | null>>
  setMessageType: Dispatch<SetStateAction<MessageType>>
}
