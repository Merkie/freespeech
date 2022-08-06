import { ILoginUserRequest, ILoginUserResponse } from "~/types/ApiTypes";

// API function
export async function login(request: ILoginUserRequest): Promise<ILoginUserResponse> { 
  // Fetch the server response
  const response = await fetch("/api/user/login", {
    method: "POST",
    body: JSON.stringify(request),
  });

  // Consume the JSON object
  const data: ILoginUserResponse = (await response.json() as ILoginUserResponse);

  return data;
}