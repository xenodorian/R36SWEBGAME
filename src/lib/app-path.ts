import { previewPathPrefix } from "@/lib/preview-path-prefix";

export function appPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") return normalized;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
  return `${prefix ?? ""}${normalized}`;
}
