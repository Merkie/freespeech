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

  // If the user can get the project, send it
  if (project?.userId === user.id || project?.visibility === "public")
    return new Response(JSON.stringify({ success: true, project }));

  // Otherwise, return a 401
  return new Response(JSON.stringify({ success: false }), { status: 401 });
};
