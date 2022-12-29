import { APIEvent, json } from "solid-start";
import prisma from "~/lib/prisma";
import { z } from "zod";
import { User } from "@prisma/client";
import { fetchAndValidateToken } from "~/lib/token";

export const POST = async ({ request }: APIEvent) => {
  // request schema
  const schema = z.object({
    name: z.string().min(2),
  });

  // Get the data from the request
  const { name } = await request.json();

  // Validate the data
  try {
    schema.parse({
      name,
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

  // create the first page
  const page = await prisma.page.create({
    data: {
      name: "Home",
      tileMetadata: {},
      user: {
        connect: {
          id: (decoded as User).id,
        },
      },
    },
  });

  // create the slug
  let slug = name.toLowerCase().replace(" ", "-");

  // check if the project already exists
  const projectExists = await prisma.project.findFirst({
    where: {
      slug,
      user: {
        id: (decoded as User).id,
      },
    },
  });

  // if the project exists, return an error
  if (projectExists) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  // create the project
  const project = await prisma.project.create({
    data: {
      name,
      slug,
      user: {
        connect: {
          id: (decoded as User).id,
        },
      },
      pages: {
        connect: {
          id: page.id,
        },
      },
    },
  });

  // return the project
  return json({ project, success: true });
};
