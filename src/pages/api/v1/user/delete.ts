import type { APIRoute } from "astro";
import validateRequest from "../../../../lib/helpers/validateRequest";

export const get: APIRoute = async ({ params, request }) => {
  console.log(await validateRequest(request));
  return new Response(JSON.stringify({ messgae: "hi" }), {
    status: 200,
  });
};
