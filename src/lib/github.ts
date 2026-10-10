export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  defaultBranch: string;
  updatedAt: string;
};

export type Entry = {
  name: string;
  path: string;
  type: "file" | "dir";
  size: number;
};

export type Dest = {
  kind: "repos" | "tree";
  user: string;
  owner: string;
  repo: string;
  ref: string;
  path: string;
  focusName?: string;
};

const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isHtmlName(name: string) {
  return /\.html?$/i.test(name);
}

const ROM_EXT = new Set([
  "gba", "agb", "gb", "gbc",
  "nes", "nez", "fds", "unf", "unif",
  "sfc", "smc", "fig", "swc",
  "md", "gen", "smd", "32x",
  "sms", "gg",
  "n64", "z64", "v64", "ndd",
  "nds", "dsi", "srl",
  "3ds", "cci", "cia",
  "iso", "cso", "pbp", "chd", "cdi", "gdi", "cue", "bin", "img", "mdf", "mds", "nrg",
  "wbfs", "rvz", "gcz", "wad", "dol",
  "pce", "sgx",
  "ngp", "ngc",
  "a26", "a52", "a78",
  "lnx", "j64",
  "ws", "wsc",
  "vb",
  "col", "int",
  "min",
  "rom",
  "zip", "7z",
]);

const ROM_LABEL: Record<string, string> = {
  gba: "GBA", agb: "GBA", gb: "Game Boy", gbc: "Game Boy",
  nes: "NES", nez: "NES", fds: "Famicom", unf: "NES", unif: "NES",
  sfc: "SNES", smc: "SNES", fig: "SNES", swc: "SNES",
  md: "Mega Drive", gen: "Genesis", smd: "Mega Drive", "32x": "32X",
  sms: "Master System", gg: "Game Gear",
  n64: "N64", z64: "N64", v64: "N64", ndd: "N64",
  nds: "DS", dsi: "DSi", srl: "DS",
  "3ds": "3DS", cci: "3DS", cia: "3DS",
  iso: "Disc", cso: "Disc", pbp: "PSP", chd: "Disc", cdi: "Dreamcast", gdi: "Dreamcast",
  cue: "Disc", bin: "Disc", img: "Disc", mdf: "Disc", mds: "Disc", nrg: "Disc",
  wbfs: "Wii", rvz: "Wii", gcz: "GameCube", wad: "Wii", dol: "GameCube",
  pce: "PC Engine", sgx: "PC Engine",
  ngp: "Neo Geo Pocket", ngc: "Neo Geo Pocket",
  a26: "Atari", a52: "Atari", a78: "Atari",
  lnx: "Lynx", j64: "Jaguar",
  ws: "WonderSwan", wsc: "WonderSwan",
  vb: "Virtual Boy",
  col: "ColecoVision", int: "Intellivision",
  min: "Pokémon Mini",
  rom: "ROM",
  zip: "ROM archive", "7z": "ROM archive",
};

export function romExt(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return ROM_EXT.has(ext) ? ext : "";
}

export function isRomName(name: string) {
  return romExt(name).length > 0;
}

export function romLabel(name: string) {
  return ROM_LABEL[romExt(name)] ?? "ROM";
}

function assertOwner(value: string) {
  if (!OWNER.test(value)) throw new Error("That doesn't look like a GitHub user name.");
}

function assertRepo(value: string) {
  if (!REPO.test(value)) throw new Error("That doesn't look like a repository name.");
}

async function gh(path: string): Promise<unknown> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const remain = res.headers.get("x-ratelimit-remaining");
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (res.status === 403 || res.status === 429) {
    if (remain === "0") {
      throw new Error(
        "GitHub's public hourly limit is used up. Without a login that's about 60 reads. Wait and try again.",
      );
    }
  }
  if (!res.ok) {
    if (res.status === 404) throw new Error("GitHub couldn't find that.");
    const message =
      isRecord(body) && typeof body.message === "string" ? body.message : `GitHub error ${res.status}`;
    throw new Error(message);
  }
  return body;
}

function parseRepo(value: unknown): Repo | null {
  if (!isRecord(value) || typeof value.name !== "string") return null;
  return {
    name: value.name,
    description: typeof value.description === "string" ? value.description : null,
    language: typeof value.language === "string" ? value.language : null,
    stars: typeof value.stargazers_count === "number" ? value.stargazers_count : 0,
    defaultBranch: typeof value.default_branch === "string" ? value.default_branch : "main",
    updatedAt: typeof value.updated_at === "string" ? value.updated_at : "",
  };
}

function parseEntry(value: unknown): Entry | null {
  if (!isRecord(value) || typeof value.name !== "string" || typeof value.path !== "string") return null;
  const type = value.type === "dir" ? "dir" : value.type === "file" ? "file" : null;
  if (!type) return null;
  return {
    name: value.name,
    path: value.path,
    type,
    size: typeof value.size === "number" ? value.size : 0,
  };
}

function sortEntries(a: Entry, b: Entry) {
  const rank = (entry: Entry) => (entry.type === "dir" ? 0 : isHtmlName(entry.name) ? 1 : isRomName(entry.name) ? 2 : 3);
  const diff = rank(a) - rank(b);
  if (diff) return diff;
  return a.name.localeCompare(b.name);
}

export async function fetchRepos(user: string): Promise<Repo[]> {
  assertOwner(user);
  const data = await gh(
    `/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated&type=owner`,
  );
  if (!Array.isArray(data)) throw new Error("Unexpected reply from GitHub.");
  return data.map(parseRepo).filter((repo): repo is Repo => repo !== null);
}

export async function fetchRepoMeta(owner: string, repo: string) {
  assertOwner(owner);
  assertRepo(repo);
  const data = await gh(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  if (!isRecord(data)) throw new Error("Unexpected reply from GitHub.");
  return {
    defaultBranch: typeof data.default_branch === "string" ? data.default_branch : "main",
    description: typeof data.description === "string" ? data.description : null,
  };
}

export async function fetchTree(owner: string, repo: string, ref: string, path: string): Promise<Entry[]> {
  assertOwner(owner);
  assertRepo(repo);
  const suffix = path
    ? `/${path
        .split("/")
        .filter(Boolean)
        .map((part) => encodeURIComponent(part))
        .join("/")}`
    : "";
  const data = await gh(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${suffix}?ref=${encodeURIComponent(ref)}`,
  );
  if (Array.isArray(data)) {
    return data
      .map(parseEntry)
      .filter((entry): entry is Entry => entry !== null)
      .sort(sortEntries);
  }
  const single = parseEntry(data);
  if (single) return [single];
  throw new Error("Unexpected reply from GitHub.");
}

async function contentsExist(owner: string, repo: string, ref: string, path: string) {
  try {
    await fetchTree(owner, repo, ref, path);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("hourly limit")) throw error;
    return false;
  }
}

async function splitRef(owner: string, repo: string, rest: string[], defaultBranch: string) {
  if (rest.length === 0) return { ref: defaultBranch, pathParts: [] as string[] };
  if (rest[0] === defaultBranch) return { ref: defaultBranch, pathParts: rest.slice(1) };
  const max = Math.min(rest.length, 4);
  for (let i = 1; i <= max; i += 1) {
    const ref = rest.slice(0, i).join("/");
    const path = rest.slice(i).join("/");
    if (await contentsExist(owner, repo, ref, path)) {
      return { ref, pathParts: rest.slice(i) };
    }
  }
  return { ref: rest[0] ?? defaultBranch, pathParts: rest.slice(1) };
}

export async function resolveAddress(input: string): Promise<Dest> {
  const text = input.trim();
  if (!text) throw new Error("Enter a GitHub user, owner/repo, or URL.");

  let url: URL | null = null;
  if (/^https?:\/\//i.test(text) || /^github\.com\//i.test(text)) {
    url = new URL(text.startsWith("http") ? text : `https://${text}`);
  }

  if (!url) {
    const bits = text.replace(/^@/, "").replace(/\.git$/, "").split("/").filter(Boolean);
    if (bits.length === 1) {
      assertOwner(bits[0]);
      return { kind: "repos", user: bits[0], owner: bits[0], repo: "", ref: "", path: "" };
    }
    if (bits.length >= 2) {
      assertOwner(bits[0]);
      assertRepo(bits[1]);
      const meta = await fetchRepoMeta(bits[0], bits[1]);
      return {
        kind: "tree",
        user: bits[0],
        owner: bits[0],
        repo: bits[1],
        ref: meta.defaultBranch,
        path: bits.slice(2).join("/"),
      };
    }
    throw new Error("Use a user, owner/repo, or a github.com URL.");
  }

  if (!/(^|\.)github\.com$/i.test(url.hostname)) {
    throw new Error("Only public github.com addresses work here.");
  }

  const parts = url.pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
  if (parts.length === 0) throw new Error("That URL has no user or repository.");
  if (parts.length === 1) {
    assertOwner(parts[0]);
    return { kind: "repos", user: parts[0], owner: parts[0], repo: "", ref: "", path: "" };
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");
  assertOwner(owner);
  assertRepo(repo);
  const mode = parts[2];
  const meta = await fetchRepoMeta(owner, repo);

  if (!mode || mode === "tree" || mode === "blob") {
    const rest = parts.slice(mode ? 3 : 2);
    const split = await splitRef(owner, repo, rest, meta.defaultBranch);
    if (mode === "blob" && split.pathParts.length > 0) {
      const focusName = split.pathParts[split.pathParts.length - 1];
      return {
        kind: "tree",
        user: owner,
        owner,
        repo,
        ref: split.ref,
        path: split.pathParts.slice(0, -1).join("/"),
        focusName,
      };
    }
    return {
      kind: "tree",
      user: owner,
      owner,
      repo,
      ref: split.ref,
      path: split.pathParts.join("/"),
    };
  }

  return {
    kind: "tree",
    user: owner,
    owner,
    repo,
    ref: meta.defaultBranch,
    path: "",
  };
}

export function locationUrl(loc: {
  kind: "repos" | "tree";
  user: string;
  owner: string;
  repo: string;
  ref: string;
  path: string;
}) {
  if (loc.kind === "repos") return `https://github.com/${loc.user}?tab=repositories`;
  const root = `https://github.com/${loc.owner}/${loc.repo}`;
  if (!loc.path) return root;
  return `${root}/tree/${loc.ref}/${loc.path}`;
}
