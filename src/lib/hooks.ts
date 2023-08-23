'use client';

import { useCallback, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

import { $authHost } from '@/service';
import { authService } from '@/service/authService';

export const useSize = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const setSizes = useCallback(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, [setWidth, setHeight]);

  useEffect(() => {
    window.addEventListener('resize', setSizes);
    setSizes();
    return () => window.removeEventListener('resize', setSizes);
  }, [setSizes]);

  return [width, height];
};


export const useAxiosAuth = () => {

  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {

    const requestInterceptor = $authHost.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${session?.user.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = $authHost.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevReq = error?.config;
        if (error?.response?.status && !prevReq?.sent) {
          prevReq.sent = true;
          await refreshToken();
          prevReq.headers['Authorization'] = `Bearer ${session?.user.access_token}`;
          return $authHost(prevReq);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      $authHost.interceptors.request.eject(requestInterceptor);
      $authHost.interceptors.response.eject(responseInterceptor);
    };

  }, [session, refreshToken]);

  return $authHost;
};


export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await authService.refreshJwt(session?.user.refresh_token!, session?.user.email!);
    if (session) {
      session.user.access_token = res.data.access_token;
      session.user.refresh_token = res.data.refresh_token;
    } else signIn();
  };

  return refreshToken;
};