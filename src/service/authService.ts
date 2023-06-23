import { $unAuthHost } from '@/service/index';

export const authService = {

  async getUser(token: string) {
    console.log(token);
    const { data } = await $unAuthHost.post('/auth/user', { token });
    return data;
  }

};