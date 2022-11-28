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
    x: number;
    y: number;
    pageId: string;
  };

  // Get the page
  const page = await pc.page.findUnique({
    where: {
      id: body.pageId,
    },
    include: {
      project: {
        include: {
          user: true,
        },
      },
    },
  });
  if (page?.project.user.id !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  // Create the tile
  const tile = await pc.tile.create({
    data: {
      x: body.x,
      y: body.y,
      page: {
        connect: {
          id: body.pageId,
        },
      },
    },
  });

  // Return the project
  return new Response(JSON.stringify({ success: true, tile }), {
    status: 200,
  });
};
