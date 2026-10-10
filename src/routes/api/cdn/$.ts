import { createFileRoute } from "@tanstack/react-router";
import { errorPage, guessType, injectPlayable, pullFile, targetFromCdnSplat } from "@/lib/github-proxy";

function fail(message: string, status: number) {
  return new Response(errorPage(message), {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/cdn/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const pathname = new URL(request.url).pathname;
          const splat = pathname.startsWith("/api/cdn/") ? pathname.slice("/api/cdn/".length) : "";
          const target = targetFromCdnSplat(splat);
          const bytes = await pullFile(target);
          const html = /\.html?$/i.test(target.path);
          const body = html ? injectPlayable(new TextDecoder().decode(bytes), target) : bytes;
          return new Response(body, {
            headers: {
              "content-type": html ? "text/html; charset=utf-8" : guessType(target.path),
              "cache-control": "private, max-age=300",
              "access-control-allow-origin": "*",
              "x-content-type-options": "nosniff",
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Couldn't open that file.";
          return fail(message, message.includes("doesn't have") ? 404 : 400);
        }
      },
    },
  },
});
