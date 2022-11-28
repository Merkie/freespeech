import type { APIRoute } from "astro";
import Me from "../../../../lib/server/Me";
import pc from "../../../../lib/server/resources/prisma";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  // Get the user from the cookie
  const user = await Me(request.headers.get("cookie") + "");

  // If the user doesn't exist, return a 401
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  // Get the body from the request
  const body = (await request.json()) as {
    name: string;
    description: string;
    columns: number;
    rows: number;
  };

  // Create the project
  const project = await pc.project.create({
    data: {
      name: body.name,
      description: body.description || "",
      columns: body.columns || 8,
      rows: body.rows || 6,
      user: {
        connect: {
          id: user.id,
        },
      },
      pages: {
        create: {
          name: "Home",
        },
      },
    },
  });

  // Return the project
  return new Response(JSON.stringify({ success: true, project }), {
    status: 200,
  });
};
