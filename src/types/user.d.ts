interface ILoginUser {
  email: string,
  password: string
}

interface User {
  name: string,
  email: string,
  image: string,
  id: string,
  friends: User[],
  access_token: string,
  refresh_token: string
}

interface AddFriend {
  userId: string,
  friendEmail: string,
  access_token: string
}

interface FriendRequests {
  _id: string,
  senderId: FriendRequest,
  receiverId: FriendRequest,
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
  access_token: string
}

interface UserRegistration {
  email: string,
  name: string,
  password: string,
  confirmPassword: string
}