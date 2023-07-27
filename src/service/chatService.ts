import { $authHost } from '@/service/index';
import toast from 'react-hot-toast';


export const chatService = {
  async getAllUserChats(userId: string, access_token: string) {
    try {
      const res = await $authHost.get('/chat', {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
          data: {
            userId: userId
          }
        }
      );
      return res.data as Chat[];
    } catch (e) {
      console.log(e);
    }
  },
  async getAllChatMessages(chatId: string, access_token: string) {
    try {
      const res = await $authHost.get<Message[]>(`chat/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
  async getChatInfo(chatId: string, access_token: string) {
    try {
      const res = await $authHost.get<Chat>(`chat/info`, {
        data: {
          chatId: chatId
        },
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
  async sendMessage({
                      chat, messageType = 'text', sender, content, recipient, access_token
                    }: Message & { access_token: string }) {
    try {
      const res = await $authHost.post(`/chat/message/${chat}`,
        {
          sender,
          recipient,
          content,
          messageType
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  },
  async getChatByParticipants(firstParticipant: string, secondParticipant: string, access_token: string) {
    try {
      const res = await $authHost.get<Chat>(
        `/chat/by-participants?firstParticipant=${firstParticipant}&secondParticipant=${secondParticipant}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );
      return res.data;
    } catch (e: any) {
      toast.error(e.response.data.error);
    }
  },
  async sendMessageWithFile(formData: FormData, access_token: string, chat: string) {
    try {
      const res = await $authHost.post(`/chat/message/${chat}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }
};