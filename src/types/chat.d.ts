interface Chat {
  _id: string,
  participants: User[],
  messages: Message[]
}

interface Message {
  _id?: string,
  sender: string,
  recipient: string,
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'geolocation'
  content: string,
  timestamp?: number | Date
  chat: string
}

