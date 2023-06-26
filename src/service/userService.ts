import { $authHost } from '@/service/index';

export const userService = {

  async getAllFriendRequests(userId: string) {
    const { data } = await $authHost.get('/users/friend-requests', {
      data: {
        userId
      }
    });
    return data;
  }

};