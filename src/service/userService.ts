import { AxiosInstance } from 'axios';
import { User } from 'next-auth';

import { $authHost } from '@/service/index';
import { AddFriend, ChangeDataRequest, GetFriendRequests, InteractWithFriendRequest } from '@/types/user';

export const userService = {
  async addFriend({ userId, friendEmail, axiosInstance }: AddFriend & { axiosInstance: AxiosInstance }) {
    const res = await axiosInstance.post('/users/add', {
      senderId: userId,
      receiverEmail: friendEmail
    });
    return res.data;
  },
  async getFriendRequests(data: GetFriendRequests) {
    const incomingReq = await $authHost.get('/users/incoming-friend-requests', {
      data: {
        userId: data.userId
      },
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });
    const outComingReq = await $authHost.get('/users/out-coming-friend-requests', {
      data: {
        userId: data.userId
      },
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });
    return {
      incomingReq: incomingReq.data,
      outComingReq: outComingReq.data
    };
  },
  async acceptFriendRequest({ axiosInstance, receiverId, senderId }: InteractWithFriendRequest) {
    const res = await axiosInstance.post('users/accept-friend', {
      senderId: senderId,
      receiverId: receiverId
    }, {});
    return res.data;
  },
  async declineFriendRequest(data: InteractWithFriendRequest) {
    const res = await $authHost.delete('users/decline-friend', {
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId
      }
    });
    return res.data;
  },
  async declineRequest(data: InteractWithFriendRequest) {
    const res = await $authHost.delete('users/decline-request', {
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId
      }
    });
    return res.data;
  },
  async deleteFromFriends({ axiosInstance, receiverId, senderId }: InteractWithFriendRequest) {
    const res = await axiosInstance.delete('users/remove', {
      data: {
        senderId: senderId,
        receiverId: receiverId
      }
    });
  },
  async searchUsers(axiosInstance: AxiosInstance, name: string, email: string) {
    try {
      const results = await axiosInstance.get(`users?name=${name}&email=${email}`, {});
      return results.data as User[];
    } catch (e) {
      console.log(e);
    }
  },
  async changeBio({ userId, data, axiosInstance }: ChangeDataRequest) {
    try {
      const results = await axiosInstance!.patch(`users/update-bio`,
        {
          newBio: data,
          userId: userId
        });
      return results.data;
    } catch (e) {
      console.log(e);
    }
  },
  async changeName({ userId, data, axiosInstance }: ChangeDataRequest) {
    try {
      const results = await axiosInstance!.patch(`users/update-name`,
        {
          newName: data,
          userId: userId
        }
      );
      return results.data;
    } catch (e) {
      console.log(e);
    }
  },
  async changePhoto(formData: FormData, axiosInstance: AxiosInstance) {
    try {
      const res = await axiosInstance.patch('users/photo', formData);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  }
};