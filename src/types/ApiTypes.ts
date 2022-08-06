export interface ILoginUserRequest {
  email: string;
  password: string;
}

export interface ILoginUserResponse {
  error?: string;
  token?: string;
}
export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ICreateUserResponse {
  error?: string;
  token?: string;
};

export interface IMeUserRequest {
  token: string;
};

export interface IMeUserResponse {
  error?: string;
  user?: any; // TODO: define user type
}

export interface ILogoutUserRequest {
  userId: string;
}
export interface IDocs {
  name: string;
  content?: string; // TODO: remove this question mark when we have docs
  inner?: IDocs[];
}