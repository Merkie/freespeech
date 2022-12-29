import { APIEvent, json } from "solid-start";
import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";
import { fetchAndValidateToken } from "~/lib/token";

export const GET = async ({ request }: APIEvent) => {
  // get the user token from the request
  const decoded = fetchAndValidateToken(request);
  if (!decoded) {
    return json({ message: "Invalid token", success: false }, { status: 401 });
  }

  // get the user from the database
  const user = await prisma.user.findUnique({
    where: {
      id: (decoded as any).id,
    },
  });

  // check if the user exists
  if (!user) {
    return json(
      { message: "Failed to authenticate token", success: false },
      { status: 500 }
    );
  }

  // remove the hashed password from the user object
  delete (user as any).hashedPassword;

  // create the jwt
  const token = jwt.sign(user, process.env.SECRET + "", {
    expiresIn: "7d",
  });

  // return the user and the token
  return json({ user, token, success: true });
};
