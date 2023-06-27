import { DefaultSession } from 'next-auth';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string,
    name: string,
    email: string,
    image: string,
    friends: string[],
    access_token: string,
    refresh_token: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      friends: string[],
      access_token: string,
      refresh_token: string
    } & DefaultSession['user'];
  }
}