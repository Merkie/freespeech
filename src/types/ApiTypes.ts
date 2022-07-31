export interface IValidateUserRequest {
  email: string;
  password: string;
}

export interface IValidateUserResponse {
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