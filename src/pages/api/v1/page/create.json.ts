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
    projectId: string;
  };

  // find the project
  const project = await pc.project.findUnique({
    where: {
      id: body.projectId,
    },
  });

  if (project?.userId !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  // Create the page
  const page = await pc.page.create({
    data: {
      name: body.name,
      project: {
        connect: {
          id: body.projectId,
        },
      },
    },
  });

  // Return the page
  return new Response(JSON.stringify({ success: true, page }), {
    status: 200,
  });
};
