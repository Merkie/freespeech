import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const PUT = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    tileId: z.string(),
    text: z.string().optional(),
    speakText: z.string().optional(),
    image: z.string().optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    borderColor: z.string().optional(),
    modifier: z.string().optional(),
    isAccented: z.boolean().optional(),
    isPublic: z.boolean().optional(),
  });

  // Get the data from the request
  const {
    tileId,
    text,
    speakText,
    image,
    backgroundColor,
    textColor,
    borderColor,
    modifier,
    isAccented,
    isPublic,
  } = await request.json();

  // Validate the data
  try {
    schema.parse({
      tileId,
      text,
      speakText,
      image,
      backgroundColor,
      textColor,
      borderColor,
      modifier,
      isAccented,
      isPublic,
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: "There was an issue with the request data.",
        error: error,
      },
      { status: 400 }
    );
  }

  // get the token from the request
  const decoded = fetchAndValidateToken(request);

  // check if the token is valid
  if (!decoded) {
    return json({ message: "Invalid token", success: false }, { status: 401 });
  }

  // find the tile
  const tile = await prisma.tile.findFirst({
    where: {
      id: tileId,
      user: {
        id: (decoded as User).id,
      },
    },
  });

  // check if the tile exists
  if (!tile) {
    return json({ message: "Tile not found", success: false }, { status: 404 });
  }

  // update the tile
  const updatedTile = await prisma.tile.update({
    where: {
      id: tileId,
    },
    data: {
      text,
      speakText,
      image,
      backgroundColor,
      textColor,
      borderColor,
      modifier,
      isAccented,
      isPublic,
    },
  });

  return json({ updatedTile, success: true });
};
