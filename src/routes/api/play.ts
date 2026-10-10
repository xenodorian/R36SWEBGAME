import { createFileRoute } from "@tanstack/react-router";
import { errorPage, injectPlayable, pullFile, readTarget } from "@/lib/github-proxy";

function page(message: string) {
  return new Response(errorPage(message), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/play")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const target = readTarget(request);
          if (!/\.html?$/i.test(target.path)) {
            return page("Only HTML files play here. Download other files instead.");
          }
          const bytes = await pullFile(target);
          if (bytes.byteLength > 1_500_000) {
            return page("That HTML file is too large to play here. Download it instead.");
          }
          const html = injectPlayable(new TextDecoder().decode(bytes), target);
          return new Response(html, {
            headers: {
              "content-type": "text/html; charset=utf-8",
              "cache-control": "private, max-age=120",
              "x-content-type-options": "nosniff",
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Couldn't open that file.";
          return page(message);
        }
      },
    },
  },
});
