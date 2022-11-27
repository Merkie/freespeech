import type { APIRoute } from "astro";
import pc from "../../../../lib/server/resources/prisma";
import bcrypt from "bcrypt";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  // Consume request body
  const { email } = await request.json();

  // Find user by email
  const user = await pc.user.findUnique({
    where: { email },
  });

  // Return if the email is taken
  return new Response(
    JSON.stringify({ taken: user ? true : false, success: true }),
    {
      status: 200,
    }
  );
};
