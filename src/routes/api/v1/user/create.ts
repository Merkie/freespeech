import { APIEvent, json } from "solid-start";
import { z } from "zod";
import prisma from "~/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  });

  // Get the data from the request
  const { email, password, name } = await request.json();

  // Validate the data
  try {
    schema.parse({
      email,
      password,
      name,
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: "There was an issue with the request data.",
        error: error,
      },
      { status: 400 }
    );
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create the user
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

  return json({ user, token, success: true });
};
