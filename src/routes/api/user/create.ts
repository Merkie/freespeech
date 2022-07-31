import { json } from "solid-start/server";

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { ICreateUserRequest } from "~/types/ApiTypes";

// Database client
const prisma = new PrismaClient();

export const post = async ({ request }: { request: Request }) => {
  const body: ICreateUserRequest = await request.json(); // JSON body of the request

  // Check if the passwords match
  if (body.password !== body.confirmPassword)
    return json({ error: "Passwords do not match" });

  // Generate the salt and hash
  const salt = crypto.randomBytes(16).toString("hex"); // Create a salt
  const hash = crypto
    .pbkdf2Sync(body.password, salt, 1000, 64, "sha512")
    .toString("hex"); // Create the hash

  // Try to create the user
  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        auth: hash,
        authSalt: salt,
      },
    });

    // If the user is created, return a token
    const session = await prisma.session.create({
      data: {
        userId: user.id,
      },
    });

    return json({ token: session.token });
  } catch(e) {
    return json({ error: e.message });
  };
};
