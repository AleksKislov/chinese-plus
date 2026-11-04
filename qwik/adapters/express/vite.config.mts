import { nodeServerAdapter } from "@builder.io/qwik-city/adapters/node-server/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config.mts";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.express.tsx", "@qwik-city-plan"],
      },
    },
    plugins: [
      nodeServerAdapter({
        name: "express",
        // SSG would write an empty dist/sitemap.xml (no static pages here), and
        // express.static serves it ahead of the dynamic src/routes/sitemap.xml.
        ssg: { sitemapOutFile: null },
      }),
    ],
  };
});
