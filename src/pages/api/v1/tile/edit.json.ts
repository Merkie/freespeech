import type { Tile } from "@prisma/client";
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
    tiles: Tile[];
  };

  // Update the tiles from body.tiles
  body.tiles.forEach(async (tile) => {
    const _tile = await pc.tile.findUnique({
      where: {
        id: tile.id,
      },
      include: {
        page: {
          include: {
            project: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (_tile?.page.project.user.id !== user.id) return;

    await pc.tile.update({
      where: {
        id: tile.id,
      },
      data: {
        ...tile,
      },
    });
  });

  // Return the project
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};
