import { $authHost } from '@/service/index';

export const userService = {

  async getAllFriendRequests(userId: string) {
    const { data } = await $authHost.get('/users/friend-requests', {
      data: {
        userId
      }
    });
    return data;
  },
  async addFriend({ userId, friendEmail }: AddFriend) {
    const res = await $authHost.post('/users/add', {
      senderId: userId,
      receiverEmail: friendEmail
    });
    console.log(res);
    return res.data;
  }
};