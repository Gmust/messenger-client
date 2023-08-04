import { Dispatch, SetStateAction } from 'react';

export interface Chat {
  _id: string,
  participants: User[],
  messages: Message[]
}

export interface Message {
  _id?: string,
  sender: string,
  recipient: string,
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'geolocation' | 'file'
  content: string,
  timestamp?: number | Date
  chat: string
}

export interface FileInputProps {
  selectedDataURL: string,
  file: File | null,
  setFile: Dispatch<SetStateAction<File | null>>
  setSelectedDataURL: Dispatch<SetStateAction<string | null>>
  setMessageType: Dispatch<SetStateAction<'text' | 'image' | 'video' | 'audio' | 'geolocation' | 'file'>>
}