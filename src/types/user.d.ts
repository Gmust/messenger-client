interface ILoginUser {
  email: string,
  password: string
}

interface User {
  name: string,
  email: string,
  image: string,
  id: string,
  friends: [],
  access_token: string,
  refresh_token: string
}

interface AddFriend {
  userId: string,
  friendEmail: string
}