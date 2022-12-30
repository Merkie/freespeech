import type { APIRoute } from "astro";
import { z } from "zod";
import prisma from "../../../../lib/resources/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  // Schema for the request body
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  });

  // Validate the request body
  if (!schema.safeParse({ email, password, name }).success) {
    return {
      status: 400,
      body: { success: false, message: "Invalid request body" },
    };
  }

  // Check if the user already exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  // If the user exists, return an error
  if (userExists) {
    return {
      status: 400,
      body: { success: false, message: "User already exists" },
    };
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      name,
    },
  });

  // remove the hashed password from the user object
  delete (user as any).hashedPassword;

  // create the jwt
  const token = jwt.sign(user, process.env.SECRET + "", {
    expiresIn: "7d",
  });

  // return the user and the token
  return { status: 200, body: { success: true, user, token } };
};

export const post: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const userCreation = await createUser(body);
  return new Response(JSON.stringify(userCreation.body), {
    status: userCreation.status,
  });
};
