import { IValidateUserRequest, IValidateUserResponse } from "~/types/ApiTypes";

export async function validate(request: IValidateUserRequest): Promise<IValidateUserResponse> { 
  // Fetch the server response
  const response = await fetch("/api/user/validate", {
    method: "POST",
    body: JSON.stringify(request),
  });

  // Consume the JSON object
  const data: IValidateUserResponse = (await response.json() as IValidateUserResponse);

  return data;
}