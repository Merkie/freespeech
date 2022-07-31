import { json } from "solid-start/server";

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { IMeUserRequest } from "~/types/ApiTypes";

// Database client
const prisma = new PrismaClient();

export const post = async ({ request }: { request: Request }) => {
  const body: IMeUserRequest = await request.json(); // JSON body of the request

  // Find the session according to the token
  const session = await prisma.session.findFirst({
    where: {
      token: body.token,
    },
  });

  // If the user is not found, return an error
  if (!session) return json({ error: "Session not found." });

  // Find the user according to the email
  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
    },
  });

  // If the user is not found, return an error
  if (!user) return json({ error: "User not found." });

  // Delete user authentication data
  delete user.auth;
  delete user.authSalt;
  delete user.authType;

  // Return the user
  return json({ user: user });
};
