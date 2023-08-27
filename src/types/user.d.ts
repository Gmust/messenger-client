import { AxiosInstance } from 'axios';
import { Message } from '@/types/chat';

interface ILoginUser {
  email: string,
  password: string
}

interface User {
  name: string,
  email: string,
  image: string,
  bio: string
  _id: string,
  friends: User[],
  access_token: string,
  refresh_token: string
}

interface AddFriend {
  userId: string,
  friendEmail: string,
}

interface FriendRequests {
  _id: string,
  senderId: User,
  receiverId: User,
}

interface FriendRequest {
  _id: string,
  name: string,
  email: string,
  image: string
}

interface GetFriendRequests {
  userId: string,
  access_token: string
}

interface InteractWithFriendRequest {
  senderId: string,
  receiverId: string,
  axiosInstance: AxiosInstance
}

interface UserRegistration {
  email: string,
  name: string,
  password: string,
  confirmPassword: string
}

interface ChangeDataRequest {
  userId: string,
  data: string,
  axiosInstance?: AxiosInstance
}

interface AllUserFiles {
  fileMessages: Message[],
  imageMessages: Message[],
}