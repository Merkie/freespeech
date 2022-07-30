export interface IResponse {
  // status?: string;
  token?: string;
  error?: string;
}

export interface ICreateUserRequestBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IValidateUserRequestBody {
  email: string;
  password: string;
}