export type Cart = {
  id: string;
  title: string;
  owner: string;
  repo: string;
  ref: string;
  path: string;
  addedAt: number;
};

const KEY = "portlight.shelf.v1";

function isCart(value: unknown): value is Cart {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.owner === "string" &&
    typeof row.repo === "string" &&
    typeof row.ref === "string" &&
    typeof row.path === "string" &&
    typeof row.addedAt === "number"
  );
}

export function loadCarts(): Cart[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCart);
  } catch {
    return [];
  }
}

export function saveCarts(carts: Cart[]) {
  localStorage.setItem(KEY, JSON.stringify(carts));
}

export function cartId(owner: string, repo: string, ref: string, path: string) {
  return `${owner}/${repo}@${ref}:${path}`;
}

export function cartTitle(repo: string, path: string) {
  const file = path.split("/").pop() || path;
  const base = file.replace(/\.html?$/i, "");
  if (/^(index|game)$/i.test(base)) return repo;
  return `${repo} · ${base}`;
}
