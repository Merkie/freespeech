import type { APIRoute } from "astro";
import wordlist from "wordlist-english";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  // Get the body from the request
  const body = (await request.json()) as {
    fragment: string;
  };

  if (body.fragment.length < 1)
    return new Response(JSON.stringify({ success: false, words: [] }), {
      status: 400,
    });

  // Get the words that start with the fragment, limit 20, sort by length
  const words = wordlist["english"]
    .filter((word) => word.startsWith(body.fragment))

    .filter((word) => word.length > 1)
    .sort((a, b) => a.length - b.length)
    .slice(0, 20);

  return new Response(JSON.stringify({ success: true, words }), {
    status: 200,
  });
};
