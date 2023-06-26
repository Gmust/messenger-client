import { AuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
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


export const authOptions:AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  //@ts-ignore
  adapter: MongoDBAdapter(
    clientPromise,
    {
      databaseName: 'Messanger',
      collections: {
        Users: 'users'
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
      clientSecret: getGoogleCredentials().clientSecret,
      authorization: {
        url: 'http://localhost:8080/auth/google/login'
      }
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
        const user = await authService.loginUser({ email: credentials?.email!, password: credentials?.password! });
        if (user) {
          return user.user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbResult = await authService.getUserByToken(token.email!) as User;
      if (!dbResult) {
        token.id = user!.id;
      }
      return {
        id: dbResult.id,
        name: dbResult.name,
        email: dbResult.email,
        image: dbResult.image,
        friends: dbResult.friends
      };
    },
    async session({ session, token }) {
      if (token) {
        //@ts-ignore
        session.user.id = token.id;
        //@ts-ignore
        session.user.name = token.name;
        //@ts-ignore
        session.user.email = token.email;
        //@ts-ignore
        session.user.image = token.image;
      }
      console.log('session in next', session);
      return session;
    },
    redirect() {
      return '/dashboard';
    }
  },
  debug: true
}