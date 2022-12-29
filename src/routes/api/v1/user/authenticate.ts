import { APIEvent, json } from "solid-start";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // Get the data from the request
  const { email, password } = await request.json();

  // Validate the data
  try {
    schema.parse({
      email,
      password,
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

  // find the user
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // If there is no user with the given email, return an error
  if (!user) {
    return json(
      {
        success: false,
        message: "Invalid email or password.",
      },
      { status: 401 }
    );
  }

  // Compare the password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, user.hashedPassword + "");

  // If the passwords don't match, return an error
  if (!isMatch) {
    return json(
      {
        success: false,
        message: "Invalid email or password.",
      },
      { status: 401 }
    );
  }

  // remove the hashed password from the user object
  delete (user as any).hashedPassword;

  // create the jwt
  const token = jwt.sign(user, process.env.SECRET + "", {
    expiresIn: "7d",
  });

  return json({ user, token, success: true });
};
