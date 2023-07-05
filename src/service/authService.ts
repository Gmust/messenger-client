import { $unAuthHost } from '@/service/index';
import { Account } from 'next-auth';

export const authService = {
  async getUserByEmail(email: string) {
    const { data } = await $unAuthHost.get('/auth/user', {
      data: {
        email
      }
    });
    return data;
  },
  async loginUser({ email, password }: ILoginUser) {
    const { data } = await $unAuthHost.post('/auth/login', { email, password });
    return data;
  },
  async loginUserByGoogle({ email, name, image }: { email: string, name: string, image: string }) {
    const { data } = await $unAuthHost.post('/auth/login-google',
      { email, name, image }
    );
    return data;
  },
  async setGoogleAccount(account: Account) {
    const { data } = await $unAuthHost.post('/auth/account-google',
      {
        account
      }
    );
    return data;
  },
  async registerAccount(user: UserRegistration) {
    const { data } = await $unAuthHost.post('/auth/registration',
      {
        email: user.email,
        name: user.name,
        password: user.password,
        confirmPassword: user.confirmPassword
      }
    );
    return data;
  }
};