export interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  name: string;
  address: string;
  map: string;
  roles: Array<string>;
}

export interface LoginData {
  email: string;
  password: string;
}
export interface GoogleLoginData {
  accessToken: string;
  expires: number;
  expires_in: number;
  email: string;
  userId: number;
  displayName: string;
  familyName: string;
  givenName: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone: string;
  name: string;
  map: string;
}
