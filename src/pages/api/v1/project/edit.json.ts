import type { APIRoute } from "astro";
import Me from "../../../../lib/server/Me";
import pc from "../../../../lib/server/resources/prisma";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../../../lib/server/resources/s3";

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
    name: string;
    description: string;
    columns: number;
    rows: number;
    visibility: string;
    thumbnail: string;
  };

  // Check if user is able to edit project
  const _project = await pc.project.findFirst({
    where: { id: body.id },
  });
  if (_project?.userId !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });

  // Delete the old thumbnail
  if (body.thumbnail !== _project.thumbnail) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: _project.thumbnail.split("/").pop(),
    });
    await s3.send(command);
  }

  // Update the project
  const project = await pc.project.update({
    where: {
      id: body.id,
    },
    data: {
      name: body.name || _project.name,
      description: body.description || _project.description,
      thumbnail: body.thumbnail || _project.thumbnail,
      columns: body.columns || _project.columns,
      rows: body.rows || _project.rows,
      visibility: body.visibility || _project.visibility,
    },
  });

  // Return the project
  return new Response(JSON.stringify({ success: true, project }));
};
