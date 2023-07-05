import { AuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import toast from 'react-hot-toast';
import { authService } from '@/service/authService';


const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID');
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('GOOGLE_CLIENT_SECRET');
  }

  return {
    clientId,
    clientSecret
  };
};


export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(
    clientPromise,
    {
      databaseName: 'Messenger',
      collections: {
        Users: 'users',
        Accounts: 'accounts'
      }
    }
  ),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' }
      },
      type: 'credentials',
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          toast.error('Provide all credentials');
        }
        const userData = await authService.loginUser({
          email: credentials?.email!,
          password: credentials?.password!
        });
        if (userData) {
          return userData.user as User;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
// @ts-ignore
    async jwt({ token, user }) {
      const dbResult = await authService.getUserByEmail(token.email!) as User;

      if (!dbResult) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbResult.id,
        name: dbResult.name,
        email: dbResult.email,
        picture: dbResult.image,
        access_token: dbResult.access_token,
        refresh_token: dbResult.refresh_token,
        friends: dbResult.friends
      };
    },
    async session({ session, token, user }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.friends = token.friends;
        session.user.access_token = token.access_token;
        session.user.refresh_token = token.refresh_token;
      }
      return session;
    },
    async signIn({ credentials, user, profile, account, email }) {

      const userFromDb = await authService.loginUserByGoogle(
        {
          email: user.email!,
          image: user.image!,
          name: user.name!
        }
      );
      //const accountFromDb = await authService.setGoogleAccount(account!);

      return true;
    },
    redirect() {
      return '/dashboard';
    }
  },
  debug: true
};
