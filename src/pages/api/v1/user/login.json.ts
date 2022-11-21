import type { APIRoute } from "astro";
import pc from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  // Consume request body
  const { email, password, userAgent } = await request.json();

  // Find user by email
  const user = await pc.user.findUnique({
    where: { email },
  });

  // If no user exists, return 401
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  // Compare password with hashed password
  const passwordMatch = await bcrypt.compare(
    password,
    user.hashedPassword + ""
  );

  // If password doesn't match, return 401
  if (!passwordMatch)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  const token = await pc.accessToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
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
