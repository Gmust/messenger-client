import { $unAuthHost } from '@/service/index';

export const authService = {

  async getUserByToken(email: string) {
    const { data } = await $unAuthHost.post('/auth/user', { email });
    return data;
  },

  async loginUser({ email, password }: ILoginUser) {
    const { data } = await $unAuthHost.post('/auth/login', { email, password });
    return data
  }

};