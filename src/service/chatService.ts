import { $authHost } from '@/service/index';


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
  }
};