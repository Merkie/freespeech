import type { APIRoute } from "astro";
import Me from "../../../../lib/server/Me";
import pc from "../../../../lib/server/resources/prisma";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  // Get the user from the cookie
  const user = await Me(request.headers.get("cookie") + "");

  // Get the body from the request
  const body = (await request.json()) as {
    id: string;
  };

  // Get the project
  const project = await pc.project.findFirst({
    where: { id: body.id },
    include: {
      pages: {
        include: {
          tiles: true,
        },
      },
    },
  });
  if (!project)
    return new Response(JSON.stringify({ success: false }), { status: 404 });

  // get list of all tiles flat
  const tiles = project?.pages.reduce(
    (acc, page) => [...acc, ...page.tiles],
    [] as any[]
  );

  // update all the linked tiles
  project.pages = project?.pages.map((page) => ({
    ...page,
    tiles: page.tiles.map((tile) => {
      if (tile.link) {
        const originalTile = tiles.find((t) => t.id === tile.link);
        return {
          ...tile,
          ...originalTile,
          id: tile.id,
          pageId: tile.pageId,
          link: originalTile.id,
        };
      }
      return tile;
    }),
  }));

  // If the user can get the project, send it
  if (project?.userId === user.id || project?.visibility === "public")
    return new Response(JSON.stringify({ success: true, project }));

  // Otherwise, return a 401
  return new Response(JSON.stringify({ success: false }), { status: 401 });
};
