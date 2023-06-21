import { JWT } from 'next-auth/jwt';
import axios, { AxiosError } from 'axios';

export const authService = {

  async getUserByToken(token: JWT) {
    try {
      const { data } = await axios.post('http://localhost:8080/auth/user', { email: token.email });
      console.log(data);
      return data;
    } catch (e) {
      console.log('---------------------------');
      console.log((e as AxiosError).message);
      console.log('---------------------------');
    }
  }


};