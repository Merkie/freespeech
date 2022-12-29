import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    pageId: z.string(),
    text: z.string(),
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
    pageId,
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
      pageId,
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

  // create the tile
  const tile = await prisma.tile.create({
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
      Page: {
        connect: {
          id: pageId,
        },
      },
      user: {
        connect: {
          id: (decoded as User).id,
        },
      },
    },
  });

  return json({ tile, success: true });
};
