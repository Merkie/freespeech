import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const fetchAndValidateToken = (request: Request): User | undefined => {
  // get the user token from the request
  const userToken = request.headers.get("Cookie")?.split("=")[1];

  // check if the user token exists
  if (!userToken) {
    return undefined;
  }

  // decode the token
  const decoded = jwt.decode(userToken);

  // check if the token is valid
  if (!decoded) {
    return undefined;
  }

  return decoded as User;
};
