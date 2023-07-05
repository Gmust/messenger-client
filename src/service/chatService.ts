import { $authHost } from '@/service/index';


export const chatService = {
  async getAllUserChats(userId: string, access_token: string) {
    try {
      const res = await $authHost.get('/chat', {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }
};