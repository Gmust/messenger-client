import toast from 'react-hot-toast';
import { AxiosInstance } from 'axios';

import { $authHost } from '@/service/index';
import { Chat, Message } from '@/types/chat';
import { MessageType } from '@/types/enums';


export const chatService = {
  async getAllUserChats(userId: string, axiosInstance?: AxiosInstance, access_token?: string) {
    try {
      if (axiosInstance) {
        const res = await axiosInstance.get('/chat', {
            data: {
              userId: userId
            }
          }
        );
        return res.data as Chat[];
      } else if (access_token) {
        const res = await $authHost.get('/chat', {
            data: {
              userId: userId
            },
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        );
        return res.data as Chat[];
      }
    } catch (e) {
      console.log(e);
    }
  },
  async getAllChatMessages(chatId: string, axiosInstance: AxiosInstance, access_token?: string) {
    try {
      const res = await axiosInstance.get<Message[]>(`chat/messages/${chatId}`);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
  async getChatInfo(chatId: string, axiosInstance?: AxiosInstance, access_token?: string) {
    try {
      if (axiosInstance) {
        const res = await axiosInstance.get<Chat>(`chat/info`, {
          data: {
            chatId
          }
        });
        return res.data;
      } else if (access_token) {
        const res = await $authHost.get<Chat>('chat/info', {
            data: {
              chatId
            },
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        );
        return res.data;
      }
    } catch (e: any) {
      console.log(e.request.data);
    }
  },
  async sendMessage({
                      chat,
                      messageType = MessageType.Text,
                      sender,
                      content,
                      recipient,
                      geoLocation,
                      axiosInstance
                    }: Message & { access_token: string, axiosInstance: AxiosInstance }) {
    try {
      const res = await axiosInstance.post(`/chat/message/${chat}`,
        {
          sender,
          recipient,
          content,
          messageType,
          geoLocation
        });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
  async getChatByParticipants(axiosInstance: AxiosInstance, firstParticipant: string, secondParticipant: string) {
    try {
      const res = await axiosInstance.get<Chat>(
        `/chat/by-participants?firstParticipant=${firstParticipant}&secondParticipant=${secondParticipant}`
      );
      return res.data;
    } catch (e: any) {
      toast.error(e.response.data.error);
    }
  },
  async sendMessageWithFile(formData: FormData, axiosInstance: AxiosInstance, chat: string) {
    try {
      const res = await axiosInstance.post(`/chat/message/${chat}`, formData);
      return res.data;
    } catch (e: any) {
      console.log(e.request.data.message);
    }
  }
};