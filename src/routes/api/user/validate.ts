import { json } from "solid-start/server";

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { IValidateUserRequest } from "~/types/ApiTypes";

// Database client
const prisma = new PrismaClient();

export const post = async ({ request }: { request: Request }) => {
  const body: IValidateUserRequest = await request.json(); // JSON body of the request

  // Find the user according to the email
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  // If the user is not found, return an error
  if (!user) return json({ error: "User not found." });

  // Check if the password is correct
  const hash = crypto
    .pbkdf2Sync(body.password, user.authSalt, 1000, 64, "sha512")
    .toString("hex"); // Create the hash

  // If the hash is not correct, return an error
  if (hash !== user.auth)
    return json({ error: "Invalid password." });
  
  // If the password is correct, return a token
  const session = await prisma.session.create({
    data: {
      userId: user.id,
    }
  });

  return json({ token: session.token });
};
