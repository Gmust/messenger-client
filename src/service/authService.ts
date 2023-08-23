import { Account } from 'next-auth';

import { $unAuthHost } from '@/service/index';
import { RefreshJwt } from '@/types/axios';


interface ResetPassword {
  newPassword: string,
  confirmPassword: string,
  token: string
}

export const authService = {
  async getUserByEmail(email: string) {
    const { data } = await $unAuthHost.get('/auth/user', {
      data: {
        email
      }
    });
    return data;
  },

  async getUserById(id: string, access_token: string) {
    const { data } = await $unAuthHost.get<User>(`/auth/user/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
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
  async refreshJwt(refresh_token: string, email: string) {
    const data = await $unAuthHost.post<RefreshJwt>('auth/refresh', {
      refresh_token,
      email
    });
    return data
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
  },
  async forgotPassword(email: string) {
    const { data } = await $unAuthHost.post('/auth/forgot-password',
      {
        email
      }
    );
    return data;
  },
  async resetPassword({ newPassword, confirmPassword, token }: ResetPassword) {
    const { data } = await $unAuthHost.post('/auth/reset',
      {
        newPassword,
        confirmPassword,
        token
      }
    );
    return data;
  }
};