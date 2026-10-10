import { createFileRoute } from "@tanstack/react-router";
import { guessType, pullFile, readTarget } from "@/lib/github-proxy";

export const Route = createFileRoute("/api/raw")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const target = readTarget(request);
          const bytes = await pullFile(target);
          const download = new URL(request.url).searchParams.get("download") === "1";
          const name = (target.path.split("/").pop() || "download").replace(/["\r\n]/g, "");
          const headers: Record<string, string> = {
            "content-type": guessType(target.path),
            "cache-control": "private, max-age=120",
            "x-content-type-options": "nosniff",
          };
          if (download) headers["content-disposition"] = `attachment; filename="${name}"`;
          return new Response(bytes, { headers });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Couldn't download that file.";
          return new Response(message, {
            status: 400,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }
      },
    },
  },
});
