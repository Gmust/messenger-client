import axios from 'axios';


export const $unAuthHost = axios.create({
  baseURL: 'http://localhost:8080'
});

export const $authHost = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});


$authHost.interceptors.request.use(
  (config) => {
    // @ts-ignore
    const accessToken = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : false;

    if (accessToken) {
      if (config.headers) config.headers.token = accessToken;
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
);
// End of Response interceptor
/*
const authInterceptors = (config: any) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptors);

$authHost.interceptors.response.use((config) => {
  return config;
}, async (error) => {

  let refresh_token;
  let email;
  if (typeof window !== 'undefined') {
    refresh_token = localStorage.getItem('refresh_token');
    email = localStorage.getItem('email');
  }
  const originalRequest = error.config;

  console.log(error);

  if (error.status.response === 401) {
    try {
      const response = await $unAuthHost.post('/auth/refresh', { refresh_token, email });
      localStorage.setItem('token', response.data.access_token);
      return $authHost.request(originalRequest);
    } catch (e) {
      toast.error('Session expired! Please log in again!');
    }
  }
});*/
