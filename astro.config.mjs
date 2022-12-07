import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";

// https://astro.build/config
import vercel from '@astrojs/vercel/edge';

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), svelte(), solidJs()],
  adapter: netlify()
});