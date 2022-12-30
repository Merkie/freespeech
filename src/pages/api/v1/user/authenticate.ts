import type { APIRoute } from "astro";
import { z } from "zod";
import prisma from "../../../../lib/resources/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authenticateUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // request schema
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // Validate the data
  if (!schema.safeParse({ email, password }).success) {
    return {
      status: 400,
      body: {
        success: false,
        message: "There was an issue with the request data.",
      },
    };
  }

  // find the user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // If there is no user with the given email, return an error
  if (!user) {
    return {
      status: 401,
      body: {
        success: false,
        message: "Invalid email or password.",
      },
    };
  }

  // Compare the password with the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, user.hashedPassword + "");

  // If the passwords don't match, return an error
  if (!isMatch) {
    return {
      status: 401,
      body: {
        success: false,
        message: "Invalid email or password.",
      },
    };
  }

  // remove the hashed password from the user object
  delete (user as any).hashedPassword;

  // create the jwt
  const token = jwt.sign(user, process.env.SECRET + "", {
    expiresIn: "7d",
  });

  // return the user and the token
  return {
    status: 200,
    body: { user, token, success: true },
  };
};

export const post: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const { captcha, ip } = body;
  console.log(captcha, ip);

  // Validate the token by calling the "/siteverify" API.
  let formData = new FormData();
  formData.append("secret", process.env.TURNSTYLE_SECRET + "");
  formData.append("response", captcha);
  formData.append("remoteip", ip);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: formData,
      method: "POST",
    }
  ).then((res) => res.json());

  console.log(result);

  const authentication = await authenticateUser(body);
  return new Response(JSON.stringify(authentication.body), {
    status: authentication.status,
  });
};
