import { ICreateUserResponse } from "~/types/ApiTypes";

export async function create(request) {
  // Fetch the server response
  const response = await fetch("/api/user/create", {
    method: "POST",
    body: JSON.stringify(request)
  });

  // Consume the JSON object
  const data: ICreateUserResponse = (await response.json() as ICreateUserResponse);

  return data;
};