import type { APIRoute } from "astro";
import Me from "../../../../lib/server/Me";
import pc from "../../../../lib/server/resources/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
    base64: string;
    ext: string;
  };

  // Check if the file is a valid image
  if (!["png", "jpg", "jpeg", "gif"].includes(body.ext))
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  // Get the file data
  const fileData = body.base64.split(",")[1];
  const fileBuffer = Buffer.from(fileData, "base64");

  // Upload the file to S3
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}.${body.ext}`,
    Body: fileBuffer,
  });
  await s3.send(command);
  const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${command.input.Key}`;
  return new Response(JSON.stringify({ success: true, url }), { status: 200 });
};
