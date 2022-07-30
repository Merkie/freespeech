export interface IResponse {
  status?: string;
  error?: string;
}

export interface ICreateUserRequestBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}