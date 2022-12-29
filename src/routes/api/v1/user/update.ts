import { APIEvent, json } from "solid-start";
import { z } from "zod";
import prisma from "~/lib/prisma";
import bcrypt from "bcrypt";
import { fetchAndValidateToken } from "~/lib/token";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const PUT = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    id: z.string(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    name: z.string().min(2).optional(),
  });

  // Get the data from the request
  const data = await request.json();

  // Validate the data
  try {
    schema.parse(data);
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

  // get the user token from the request
  const decoded = fetchAndValidateToken(request);
  if (!decoded) {
    return json({ message: "Invalid token" }, { status: 401 });
  }

  // Find the user
  const user = await prisma.user.findFirst({
    where: {
      id: data.id,
    },
  });

  // If the user does not belong to the authenticated user, return an error
  if (user?.id !== (decoded as User).id) {
    return json(
      {
        success: false,
        message: "You do not have permission to update this user.",
      },
      { status: 401 }
    );
  }

  // Update the user
  const updatedUser = await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      email: data.email || user.email,
      name: data.name || user.name,
      hashedPassword: data.password
        ? await bcrypt.hash(data.password, 10)
        : user.hashedPassword,
    },
  });

  // remove the hashed password from the user object
  delete (updatedUser as any).hashedPassword;

  // create the jwt
  const token = jwt.sign(updatedUser, process.env.SECRET + "", {
    expiresIn: "7d",
  });

  return json({
    success: true,
    user: updatedUser,
    token,
  });
};
