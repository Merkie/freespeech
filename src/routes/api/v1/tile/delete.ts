import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const DELETE = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    pageId: z.string(),
    tileId: z.string(),
  });

  // Get the data from the request
  const { pageId, tileId } = await request.json();

  // Validate the data
  try {
    schema.parse({ pageId, tileId });
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

  // find the page
  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      user: {
        id: (decoded as User).id,
      },
    },
  });

  // check if the page exists
  if (!page) {
    return json({ message: "Page not found", success: false }, { status: 404 });
  }

  // find the tile
  let tile = await prisma.tile.findFirst({
    where: {
      id: tileId,
      Page: {
        id: pageId,
      },
    },
  });

  // if the tile doesn't exist, return an error
  if (!tile) {
    return json({ message: "Tile not found", success: false }, { status: 404 });
  }

  // delete the tile
  tile = await prisma.tile.delete({
    where: {
      id: tileId,
    },
  });

  return json({ tile, success: true });
};
