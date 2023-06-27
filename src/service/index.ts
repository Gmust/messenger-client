import axios from 'axios';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth';


export const $unAuthHost = axios.create({
  baseURL: 'http://localhost:8080'
});

export const $authHost = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});


/*$authHost.interceptors.request.use(
  (config) => {
    // @ts-ignore
    const test =  getServerSession()
    console.log('in interceptor',test)

    if (test) {
      if (config.headers) config.headers.token = test;
    }
    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);


$authHost.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    return Promise.reject(error);
  }
);*/
// End of Response interceptor
const authInterceptors = async (config: any) => {
  const session = await getSession();
  config.headers.authorization = `Bearer ${session?.user.access_token}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptors);

$authHost.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  let session = await getSession();

  let refresh_token;
  let email;
  if (typeof window !== 'undefined') {
    refresh_token = session?.user.access_token;
    email = session?.user.email;
  }
  const originalRequest = error.config;

  console.log(error);

  if (error.status.response === 401) {
    try {
      const response = await $unAuthHost.post('/auth/refresh', { refresh_token, email });
      return $authHost.request(originalRequest);
    } catch (e) {
      toast.error('Session expired! Please log in again!');
    }
  }
});
