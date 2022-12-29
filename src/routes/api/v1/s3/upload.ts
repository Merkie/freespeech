import { APIEvent, json } from "solid-start";
import { z } from "zod";
import { fetchAndValidateToken } from "~/lib/token";
import prisma from "~/lib/prisma";
import { User } from "@prisma/client";
import s3 from "~/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const uploadSchema = z.object({
    key: z.string(),
    filename: z.string(),
    mimetype: z.string(),
    size: z.number(),
  });

  // Get the data from the request
  const { key, filename, mimetype, size } = await request.json();

  // Validate the data
  try {
    uploadSchema.parse({
      key,
      filename,
      mimetype,
      size,
    });
  } catch (error) {
    // If the data is invalid, return an error
    return json(
      {
        success: false,
        message: "There was an issue with the request data.",
        error: error,
      },
      { status: 400 }
    );
  }

  // decode the json web token
  const decoded = fetchAndValidateToken(request);

  // check if the token is valid
  if (!decoded) {
    return json({ message: "Invalid token", success: false }, { status: 401 });
  }

  // put the file in s3
  const s3file = await s3.send(
    new PutObjectCommand({
      Bucket: process.env.FS_S3_BUCKET as string,
      Key: key,
      Body: request.body as any,
      ContentType: mimetype,
    })
  );

  // create the file in the database
  const file = await prisma.s3Object.create({
    data: {
      key,
      bucket: process.env.FS_S3_BUCKET as string,
      region: process.env.FS_S3_REGION as string,
      filename,
      mimetype,
      size,
      user: {
        connect: {
          id: (decoded as User).id,
        },
      },
    },
  });

  // return the file
  return json({
    success: true,
    file,
    url: `https://${process.env.FS_S3_BUCKET}.s3.${process.env.FS_S3_REGION}.amazonaws.com/${key}`,
  });
};
