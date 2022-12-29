import { APIEvent, json } from "solid-start";
import { z } from "zod";
import { fetchAndValidateToken } from "~/lib/token";
import prisma from "~/lib/prisma";
import { User } from "@prisma/client";
import s3 from "~/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export const DELETE = async ({ request }: APIEvent) => {
  const uploadSchema = z.object({
    id: z.string(),
  });

  // Get the data from the request
  const { id } = await request.json();

  // Validate the data
  try {
    uploadSchema.parse({
      id,
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

  // Find the file
  const file = await prisma.s3Object.findFirst({
    where: {
      id,
      user: {
        id: (decoded as User).id,
      },
    },
    include: {
      user: true,
    },
  });

  // If there is no file with the given id, return an error
  if (!file) {
    return json(
      { success: false, message: "No such file exists" },
      { status: 404 }
    );
  }

  // Check if the user is authorized to delete the file
  if ((file as { user: User }).user.id !== (decoded as User).id) {
    return json(
      { message: "Not authorized to delete this file", success: false },
      { status: 401 }
    );
  }

  // Delete the file from S3
  const s3file = await s3.send(
    new DeleteObjectCommand({
      Bucket: file.bucket,
      Key: file.key,
    })
  );

  // Delete the file from the database
  const deletedFile = await prisma.s3Object.delete({
    where: {
      id,
    },
  });

  // Return the deleted file
  return json({
    success: true,
    deletedFile,
  });
};
