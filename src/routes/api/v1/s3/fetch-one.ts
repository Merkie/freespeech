import { APIEvent, json } from "solid-start";
import { z } from "zod";
import { fetchAndValidateToken } from "~/lib/token";
import prisma from "~/lib/prisma";
import { User } from "@prisma/client";

export const GET = async ({ request }: APIEvent) => {
  // request schema
  const fetchOneSchema = z.object({
    id: z.string(),
  });

  // Get the data from the request
  const { id } = await request.json();

  // Validate the data
  try {
    fetchOneSchema.parse({
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
      userId: (decoded as User).id,
    },
  });

  // If there is no file with the given id, return an error
  if (!file) {
    return json({
      success: false,
      message: "Not found",
    });
  }

  // Return the file
  return json({
    success: true,
    file,
    url: `https://${file.bucket}.s3.${file.region}.amazonaws.com/${file.key}`,
  });
};
