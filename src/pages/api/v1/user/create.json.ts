import type { APIRoute } from "astro";
import pc from "../../../../lib/server/resources/prisma";
import bcrypt from "bcrypt";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  // Consume request body
  const { email, password, name, userAgent } = await request.json();

  // Find user by email
  const user = await pc.user.findUnique({
    where: { email },
  });

  // If user exists, return 401
  if (user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const createdUser = await pc.user.create({
    data: {
      email,
      hashedPassword: hashedPassword,
      name,
    },
  });

  // Create access token
  const token = await pc.accessToken.create({
    data: {
      user: {
        connect: {
          id: createdUser.id,
        },
      },
      userAgent,
    },
    include: {
      user: true,
    },
  });

  // Delete hashed password from user object
  delete (token.user as unknown as any).hashedPassword;

  // Return user
  return {
    body: JSON.stringify({
      success: true,
      token,
    }),
  };
};
