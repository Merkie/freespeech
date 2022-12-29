import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    tileId: z.string(),
  });

  // Get the data from the request
  const { tileId } = await request.json();

  // Validate the data
  try {
    schema.parse({
      tileId,
    });
  } catch (error) {
    // return an error if the data is invalid
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

  // find the tile
  const tile = await prisma.tile.findFirst({
    where: {
      id: tileId,
    },
    include: {
      user: true,
    },
  });

  // check if the tile exists
  if (!tile) {
    return json({ message: "Tile not found", success: false }, { status: 404 });
  }

  // check if the user is the owner or if the tile is public
  if (tile.user.id !== (decoded as User).id && !tile.isPublic) {
    return json(
      { message: "You do not have access to this tile", success: false },
      { status: 401 }
    );
  }

  return json({ tile, success: true });
};
