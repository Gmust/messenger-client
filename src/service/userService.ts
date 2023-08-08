import { $authHost } from '@/service/index';

export const userService = {
  async addFriend({ userId, friendEmail, access_token }: AddFriend) {
    const res = await $authHost.post('/users/add', {
      senderId: userId,
      receiverEmail: friendEmail
    }, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
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
  async acceptFriendRequest(data: InteractWithFriendRequest) {
    const res = await $authHost.post('users/accept-friend', {
      senderId: data.senderId,
      receiverId: data.receiverId
    }, {
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });
    return res.data;
  },
  async declineFriendRequest(data: InteractWithFriendRequest) {
    const res = await $authHost.delete('users/decline-friend', {
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId
      },
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });
    return res.data;
  },
  async declineRequest(data: InteractWithFriendRequest) {
    const res = await $authHost.delete('users/decline-request', {
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId
      },
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });
    return res.data;
  },
  async deleteFromFriends(data: InteractWithFriendRequest) {
    const res = await $authHost.delete('users/remove', {
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId
      },
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });
  },
  async searchUsers(access_token: string, name: string, email: string) {
    try {
      const results = await $authHost.get(`users?name=${name}&email=${email}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      return results.data as User[] ;
    } catch (e) {
      console.log(e);
    }
  },
  async changeBio({ userId, data, access_token }: ChangeDataRequest) {
    try {
      const results = await $authHost.patch(`users/update-bio`,
        {
          newBio: data,
          userId: userId
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });
      return results.data;
    } catch (e) {
      console.log(e);
    }
  },
  async changeName({ userId, data, access_token }: ChangeDataRequest) {
    try {
      const results = await $authHost.patch(`users/update-name`,
        {
          newName: data,
          userId: userId
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });
      return results.data;
    } catch (e) {
      console.log(e);
    }
  },
  async changePhoto(formData: FormData, access_token: string) {
    try {
      const res = await $authHost.patch('users/photo', formData, {
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