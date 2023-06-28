import axios from 'axios';
import { getSession } from 'next-auth/react';


const $unAuthHost = axios.create({
  baseURL: 'http://localhost:8080'
});


const $authHost = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

/*

const authInterceptors = async (config: any) => {
  const session = await getSession();
  config.headers.authorization = `Bearer ${session?.user.access_token}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptors);

$authHost.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  const session = await getSession();

  const originalRequest = error.config;
  const refresh_token = session?.user.refresh_token;
  const email = session?.user.email;

  if (error.response.status === 401) {
    try {
      const response = await $unAuthHost.post('/auth/refresh', { refresh_token, email });
      localStorage.setItem('token', response.data.access_token);
      return $authHost.request(originalRequest);
    } catch (e: any) {
      console.log('Unauthorized');
    }
  }
});
*/


export {
  $authHost,
  $unAuthHost
};