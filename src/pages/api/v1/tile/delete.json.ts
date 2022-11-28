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
    id: string;
  };

  // Check if user is able to delete tile
  const _tile = await pc.tile.findFirst({
    where: { id: body.id },
    include: {
      page: {
        include: {
          project: true,
        },
      },
    },
  });
  if (_tile?.page.project.userId !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  // Delete the tile
  await pc.tile.delete({
    where: {
      id: body.id,
    },
  });

  // Return a success response
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
