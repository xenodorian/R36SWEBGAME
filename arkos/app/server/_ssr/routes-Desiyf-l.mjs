import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Gamepad2, c as FileCode2, i as Github, l as Download, n as Trash2, o as Folder, r as Star, s as File } from "../_libs/lucide-react.mjs";
import { n as previewPathPrefix } from "./router-CF2yOkpu.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Desiyf-l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "portlight.shelf.v1";
function isCart(value) {
	if (typeof value !== "object" || value === null) return false;
	const row = value;
	return typeof row.id === "string" && typeof row.title === "string" && typeof row.owner === "string" && typeof row.repo === "string" && typeof row.ref === "string" && typeof row.path === "string" && typeof row.addedAt === "number";
}
function loadCarts() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isCart);
	} catch {
		return [];
	}
}
function saveCarts(carts) {
	localStorage.setItem(KEY, JSON.stringify(carts));
}
function cartId(owner, repo, ref, path) {
	return `${owner}/${repo}@${ref}:${path}`;
}
function cartTitle(repo, path) {
	const base = (path.split("/").pop() || path).replace(/\.html?$/i, "");
	if (/^(index|game)$/i.test(base)) return repo;
	return `${repo} · ${base}`;
}
var primaryBtn = "inline-flex h-12 items-center justify-center gap-2 bg-signal px-4 font-display text-base font-semibold text-ink disabled:opacity-50";
var ghostBtn = "inline-flex h-12 items-center justify-center gap-2 border border-line bg-bg px-4 font-display text-base font-semibold text-fg disabled:opacity-50";
var tabBtn = "inline-flex h-10 shrink-0 items-center justify-center gap-2 px-3 font-display text-sm font-semibold";
function HintBar({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "flex h-12 shrink-0 items-center border-t border-line px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate font-display text-xs tracking-widest text-muted uppercase",
			children
		})
	});
}
var BUILTINS = [
	{
		id: "lantern",
		title: "Lantern Run",
		blurb: "Jump the posts. Up or Z launches the lantern.",
		src: "/ports/lantern.html",
		mark: "lantern"
	},
	{
		id: "snake",
		title: "Grid Snake",
		blurb: "Turn with the D-pad. Don't bite the trail.",
		src: "/ports/snake.html",
		mark: "snake"
	},
	{
		id: "break",
		title: "Break Amber",
		blurb: "Move the paddle. Z or A launches the ball.",
		src: "/ports/break.html",
		mark: "break"
	}
];
function Mark({ mark }) {
	if (mark === "snake") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid size-16 shrink-0 grid-cols-4 gap-1 border border-line bg-raised p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-signal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-signal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-signal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "col-start-3 row-start-2 bg-signal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "col-start-4 row-start-4 bg-fg" })
		]
	});
	if (mark === "break") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex size-16 shrink-0 flex-col justify-between border border-line bg-raised p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-1",
			children: Array.from({ length: 8 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 bg-signal" }, index))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-auto h-2 w-8 bg-fg" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative size-16 shrink-0 border border-line bg-raised",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-4 top-3 bottom-4 bg-signal",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-2 top-2 h-3 bg-ink" })
		})
	});
}
function typingTarget$1(target) {
	return target instanceof HTMLElement && Boolean(target.closest("input, textarea"));
}
function LibraryView({ active, carts, onPlayBuiltin, onPlayCart, onRemove }) {
	const items = [...BUILTINS.map((game) => ({
		kind: "builtin",
		game
	})), ...carts.map((cart) => ({
		kind: "cart",
		cart
	}))];
	const [cursor, setCursor] = (0, import_react.useState)(0);
	const rows = (0, import_react.useRef)([]);
	const safeCursor = Math.min(cursor, Math.max(0, items.length - 1));
	const current = items[safeCursor];
	(0, import_react.useEffect)(() => {
		var _rows$current$safeCur;
		(_rows$current$safeCur = rows.current[safeCursor]) === null || _rows$current$safeCur === void 0 || _rows$current$safeCur.scrollIntoView({ block: "nearest" });
	}, [safeCursor, items.length]);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		function onKey(event) {
			if (typingTarget$1(event.target)) return;
			const onControl = event.target instanceof HTMLElement && Boolean(event.target.closest("button, a")) && (event.key === "Enter" || event.key === " ");
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setCursor((value) => Math.min(items.length - 1, value + 1));
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				setCursor((value) => Math.max(0, value - 1));
			} else if (!onControl && (event.key === "Enter" || event.key === " " || event.key === "z" || event.key === "Z")) {
				event.preventDefault();
				const item = items[Math.min(cursor, items.length - 1)];
				if (!item) return;
				if (item.kind === "builtin") onPlayBuiltin(item.game);
				else onPlayCart(item.cart);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		active,
		cursor,
		items,
		onPlayBuiltin,
		onPlayCart
	]);
	function playCurrent() {
		if (!current) return;
		if (current.kind === "builtin") onPlayBuiltin(current.game);
		else onPlayCart(current.cart);
	}
	const kicker = (current === null || current === void 0 ? void 0 : current.kind) === "cart" ? "Shelved from GitHub" : "Built-in port";
	const title = (current === null || current === void 0 ? void 0 : current.kind) === "cart" ? current.cart.title : current === null || current === void 0 ? void 0 : current.game.title;
	const blurb = (current === null || current === void 0 ? void 0 : current.kind) === "cart" ? `${current.cart.owner}/${current.cart.repo} · ${current.cart.path}` : current === null || current === void 0 ? void 0 : current.game.blurb;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "shrink-0 border-b border-line px-4 py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4",
				children: [(current === null || current === void 0 ? void 0 : current.kind) === "builtin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { mark: current.game.mark }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-16 shrink-0 place-items-center border border-line bg-raised text-signal",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode2, {
						className: "size-7",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs tracking-widest text-signal uppercase",
							children: kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 truncate font-display text-3xl font-semibold tracking-tight md:text-5xl",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 line-clamp-2 text-sm text-muted",
							children: blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-pad": "action",
								className: primaryBtn,
								onClick: playCurrent,
								children: "Play"
							}), (current === null || current === void 0 ? void 0 : current.kind) === "cart" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-pad": "action",
								className: ghostBtn,
								onClick: () => onRemove(current.cart.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Remove"]
							}) : null]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "listbox",
			"aria-label": "Library",
			className: "min-h-0 flex-1 overflow-y-auto",
			children: [items.map((item, index) => {
				var _items;
				const selected = index === safeCursor;
				const label = item.kind === "builtin" ? item.game.title : item.cart.title;
				const meta = item.kind === "builtin" ? "On device" : `${item.cart.owner}/${item.cart.repo}`;
				const showShelf = item.kind === "cart" && (index === 0 || ((_items = items[index - 1]) === null || _items === void 0 ? void 0 : _items.kind) === "builtin");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					index === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 pt-3 pb-1 font-display text-xs tracking-widest text-muted uppercase",
						children: "On device"
					}) : null,
					showShelf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 pt-3 pb-1 font-display text-xs tracking-widest text-muted uppercase",
						children: "From GitHub"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "option",
						"data-pad": "item",
						"aria-selected": selected,
						ref: (node) => {
							rows.current[index] = node;
						},
						className: selected ? "flex min-h-12 w-full items-center gap-3 border-b border-line bg-signal px-4 py-3 text-left text-ink" : "flex min-h-12 w-full items-center gap-3 border-b border-line px-4 py-3 text-left text-fg hover:bg-raised",
						onClick: () => {
							if (safeCursor === index) playCurrent();
							else setCursor(index);
						},
						onDoubleClick: () => {
							setCursor(index);
							if (item.kind === "builtin") onPlayBuiltin(item.game);
							else onPlayCart(item.cart);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 shrink-0 font-display text-sm font-semibold tabular-nums",
							children: String(index + 1).padStart(2, "0")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-display text-lg font-semibold",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: selected ? "block truncate text-sm text-ink/75" : "block truncate text-sm text-muted",
								children: meta
							})]
						})]
					})
				] }, item.kind === "builtin" ? item.game.id : item.cart.id);
			}), carts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-4 text-sm text-muted",
				children: "The shelf is empty. Open GitHub, pick an HTML file, and play it. It stays here."
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBar, { children: "D-pad moves · A press · Stick mouse" })
	] });
}
var OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
var REPO = /^[A-Za-z0-9._-]{1,100}$/;
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function isHtmlName(name) {
	return /\.html?$/i.test(name);
}
var ROM_EXT = /* @__PURE__ */ new Set([
	"gba",
	"agb",
	"gb",
	"gbc",
	"nes",
	"nez",
	"fds",
	"unf",
	"unif",
	"sfc",
	"smc",
	"fig",
	"swc",
	"gen",
	"smd",
	"32x",
	"sms",
	"gg",
	"n64",
	"z64",
	"v64",
	"ndd",
	"nds",
	"dsi",
	"srl",
	"3ds",
	"cci",
	"cia",
	"iso",
	"cso",
	"pbp",
	"chd",
	"cdi",
	"gdi",
	"cue",
	"bin",
	"img",
	"mdf",
	"mds",
	"nrg",
	"wbfs",
	"rvz",
	"gcz",
	"wad",
	"dol",
	"pce",
	"sgx",
	"ngp",
	"ngc",
	"a26",
	"a52",
	"a78",
	"lnx",
	"j64",
	"ws",
	"wsc",
	"vb",
	"col",
	"int",
	"min",
	"rom",
	"zip",
	"7z"
]);
var ROM_LABEL = {
	gba: "GBA",
	agb: "GBA",
	gb: "Game Boy",
	gbc: "Game Boy",
	nes: "NES",
	nez: "NES",
	fds: "Famicom",
	unf: "NES",
	unif: "NES",
	sfc: "SNES",
	smc: "SNES",
	fig: "SNES",
	swc: "SNES",
	gen: "Genesis",
	smd: "Mega Drive",
	"32x": "32X",
	sms: "Master System",
	gg: "Game Gear",
	n64: "N64",
	z64: "N64",
	v64: "N64",
	ndd: "N64",
	nds: "DS",
	dsi: "DSi",
	srl: "DS",
	"3ds": "3DS",
	cci: "3DS",
	cia: "3DS",
	iso: "Disc",
	cso: "Disc",
	pbp: "PSP",
	chd: "Disc",
	cdi: "Dreamcast",
	gdi: "Dreamcast",
	cue: "Disc",
	bin: "Disc",
	img: "Disc",
	mdf: "Disc",
	mds: "Disc",
	nrg: "Disc",
	wbfs: "Wii",
	rvz: "Wii",
	gcz: "GameCube",
	wad: "Wii",
	dol: "GameCube",
	pce: "PC Engine",
	sgx: "PC Engine",
	ngp: "Neo Geo Pocket",
	ngc: "Neo Geo Pocket",
	a26: "Atari",
	a52: "Atari",
	a78: "Atari",
	lnx: "Lynx",
	j64: "Jaguar",
	ws: "WonderSwan",
	wsc: "WonderSwan",
	vb: "Virtual Boy",
	col: "ColecoVision",
	int: "Intellivision",
	min: "Pokémon Mini",
	rom: "ROM",
	zip: "ROM archive",
	"7z": "ROM archive"
};
function romExt(name) {
	var _name$split$pop$toLow, _name$split$pop;
	const ext = (_name$split$pop$toLow = (_name$split$pop = name.split(".").pop()) === null || _name$split$pop === void 0 ? void 0 : _name$split$pop.toLowerCase()) !== null && _name$split$pop$toLow !== void 0 ? _name$split$pop$toLow : "";
	return ROM_EXT.has(ext) ? ext : "";
}
function isRomName(name) {
	return romExt(name).length > 0;
}
function romLabel(name) {
	var _ROM_LABEL$romExt;
	return (_ROM_LABEL$romExt = ROM_LABEL[romExt(name)]) !== null && _ROM_LABEL$romExt !== void 0 ? _ROM_LABEL$romExt : "ROM";
}
function assertOwner(value) {
	if (!OWNER.test(value)) throw new Error("That doesn't look like a GitHub user name.");
}
function assertRepo(value) {
	if (!REPO.test(value)) throw new Error("That doesn't look like a repository name.");
}
async function gh(path) {
	const res = await fetch(`https://api.github.com${path}`, { headers: {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28"
	} });
	const remain = res.headers.get("x-ratelimit-remaining");
	const text = await res.text();
	let body = null;
	try {
		body = text ? JSON.parse(text) : null;
	} catch {
		body = null;
	}
	if (res.status === 403 || res.status === 429) {
		if (remain === "0") throw new Error("GitHub's public hourly limit is used up. Without a login that's about 60 reads. Wait and try again.");
	}
	if (!res.ok) {
		if (res.status === 404) throw new Error("GitHub couldn't find that.");
		const message = isRecord(body) && typeof body.message === "string" ? body.message : `GitHub error ${res.status}`;
		throw new Error(message);
	}
	return body;
}
function parseRepo(value) {
	if (!isRecord(value) || typeof value.name !== "string") return null;
	return {
		name: value.name,
		description: typeof value.description === "string" ? value.description : null,
		language: typeof value.language === "string" ? value.language : null,
		stars: typeof value.stargazers_count === "number" ? value.stargazers_count : 0,
		defaultBranch: typeof value.default_branch === "string" ? value.default_branch : "main",
		updatedAt: typeof value.updated_at === "string" ? value.updated_at : ""
	};
}
function parseEntry(value) {
	if (!isRecord(value) || typeof value.name !== "string" || typeof value.path !== "string") return null;
	const type = value.type === "dir" ? "dir" : value.type === "file" ? "file" : null;
	if (!type) return null;
	return {
		name: value.name,
		path: value.path,
		type,
		size: typeof value.size === "number" ? value.size : 0
	};
}
function sortEntries(a, b) {
	const rank = (entry) => entry.type === "dir" ? 0 : isHtmlName(entry.name) ? 1 : isRomName(entry.name) ? 2 : 3;
	const diff = rank(a) - rank(b);
	if (diff) return diff;
	return a.name.localeCompare(b.name);
}
async function fetchRepos(user) {
	assertOwner(user);
	const data = await gh(`/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated&type=owner`);
	if (!Array.isArray(data)) throw new Error("Unexpected reply from GitHub.");
	return data.map(parseRepo).filter((repo) => repo !== null);
}
async function fetchRepoMeta(owner, repo) {
	assertOwner(owner);
	assertRepo(repo);
	const data = await gh(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
	if (!isRecord(data)) throw new Error("Unexpected reply from GitHub.");
	return {
		defaultBranch: typeof data.default_branch === "string" ? data.default_branch : "main",
		description: typeof data.description === "string" ? data.description : null
	};
}
async function fetchTree(owner, repo, ref, path) {
	assertOwner(owner);
	assertRepo(repo);
	const suffix = path ? `/${path.split("/").filter(Boolean).map((part) => encodeURIComponent(part)).join("/")}` : "";
	const data = await gh(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${suffix}?ref=${encodeURIComponent(ref)}`);
	if (Array.isArray(data)) return data.map(parseEntry).filter((entry) => entry !== null).sort(sortEntries);
	const single = parseEntry(data);
	if (single) return [single];
	throw new Error("Unexpected reply from GitHub.");
}
async function contentsExist(owner, repo, ref, path) {
	try {
		await fetchTree(owner, repo, ref, path);
		return true;
	} catch (error) {
		if ((error instanceof Error ? error.message : "").includes("hourly limit")) throw error;
		return false;
	}
}
async function splitRef(owner, repo, rest, defaultBranch) {
	var _rest$;
	if (rest.length === 0) return {
		ref: defaultBranch,
		pathParts: []
	};
	if (rest[0] === defaultBranch) return {
		ref: defaultBranch,
		pathParts: rest.slice(1)
	};
	const max = Math.min(rest.length, 4);
	for (let i = 1; i <= max; i += 1) {
		const ref = rest.slice(0, i).join("/");
		if (await contentsExist(owner, repo, ref, rest.slice(i).join("/"))) return {
			ref,
			pathParts: rest.slice(i)
		};
	}
	return {
		ref: (_rest$ = rest[0]) !== null && _rest$ !== void 0 ? _rest$ : defaultBranch,
		pathParts: rest.slice(1)
	};
}
async function resolveAddress(input) {
	const text = input.trim();
	if (!text) throw new Error("Enter a GitHub user, owner/repo, or URL.");
	let url = null;
	if (/^https?:\/\//i.test(text) || /^github\.com\//i.test(text)) url = new URL(text.startsWith("http") ? text : `https://${text}`);
	if (!url) {
		const bits = text.replace(/^@/, "").replace(/\.git$/, "").split("/").filter(Boolean);
		if (bits.length === 1) {
			assertOwner(bits[0]);
			return {
				kind: "repos",
				user: bits[0],
				owner: bits[0],
				repo: "",
				ref: "",
				path: ""
			};
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
				path: bits.slice(2).join("/")
			};
		}
		throw new Error("Use a user, owner/repo, or a github.com URL.");
	}
	if (!/(^|\.)github\.com$/i.test(url.hostname)) throw new Error("Only public github.com addresses work here.");
	const parts = url.pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
	if (parts.length === 0) throw new Error("That URL has no user or repository.");
	if (parts.length === 1) {
		assertOwner(parts[0]);
		return {
			kind: "repos",
			user: parts[0],
			owner: parts[0],
			repo: "",
			ref: "",
			path: ""
		};
	}
	const owner = parts[0];
	const repo = parts[1].replace(/\.git$/, "");
	assertOwner(owner);
	assertRepo(repo);
	const mode = parts[2];
	const meta = await fetchRepoMeta(owner, repo);
	if (!mode || mode === "tree" || mode === "blob") {
		const split = await splitRef(owner, repo, parts.slice(mode ? 3 : 2), meta.defaultBranch);
		if (mode === "blob" && split.pathParts.length > 0) {
			const focusName = split.pathParts[split.pathParts.length - 1];
			return {
				kind: "tree",
				user: owner,
				owner,
				repo,
				ref: split.ref,
				path: split.pathParts.slice(0, -1).join("/"),
				focusName
			};
		}
		return {
			kind: "tree",
			user: owner,
			owner,
			repo,
			ref: split.ref,
			path: split.pathParts.join("/")
		};
	}
	return {
		kind: "tree",
		user: owner,
		owner,
		repo,
		ref: meta.defaultBranch,
		path: ""
	};
}
function locationUrl(loc) {
	if (loc.kind === "repos") return `https://github.com/${loc.user}?tab=repositories`;
	const root = `https://github.com/${loc.owner}/${loc.repo}`;
	if (!loc.path) return root;
	return `${root}/tree/${loc.ref}/${loc.path}`;
}
function appPath(path) {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	if (typeof window === "undefined") return normalized;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return `${prefix !== null && prefix !== void 0 ? prefix : ""}${normalized}`;
}
var HOME = {
	kind: "repos",
	user: "xenodorian",
	owner: "xenodorian",
	repo: "",
	ref: "",
	path: "",
	description: null
};
var VIEW_KEY = "portlight.github.view";
var VIEWS = [
	{
		id: "html",
		label: "Show HTML only"
	},
	{
		id: "roms",
		label: "Show HTML and roms"
	},
	{
		id: "all",
		label: "Show all"
	}
];
function rowVisible(row, mode) {
	if (row.kind !== "file") return true;
	if (mode === "all") return true;
	if (mode === "roms") return isRomName(row.entry.name);
	return false;
}
function locKey(loc) {
	return `${loc.kind}|${loc.user}|${loc.owner}|${loc.repo}|${loc.ref}|${loc.path}`;
}
function formatBytes(size) {
	if (size < 1024) return `${size} B`;
	if (size < 1048576) return `${Math.max(1, Math.round(size / 102.4) / 10)} KB`;
	return `${Math.round(size / 1024 / 102.4) / 10} MB`;
}
function toRow(entry) {
	if (entry.type === "dir") return {
		kind: "dir",
		entry
	};
	if (isHtmlName(entry.name)) return {
		kind: "html",
		entry
	};
	return {
		kind: "file",
		entry
	};
}
function rowName(row) {
	return row.kind === "repo" ? row.repo.name : row.entry.name;
}
function typingTarget(target) {
	return target instanceof HTMLElement && Boolean(target.closest("input, textarea"));
}
function GithubView({ active, onLibrary, onPlay }) {
	var _stack, _loc$description;
	const [stack, setStack] = (0, import_react.useState)([HOME]);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [cursor, setCursor] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [reload, setReload] = (0, import_react.useState)(0);
	const [query, setQuery] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)(locationUrl(HOME));
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [resolving, setResolving] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [view, setView] = (0, import_react.useState)("roms");
	const pendingFocus = (0, import_react.useRef)(null);
	const rowRefs = (0, import_react.useRef)([]);
	const loc = (_stack = stack[stack.length - 1]) !== null && _stack !== void 0 ? _stack : HOME;
	const key = locKey(loc);
	const url = locationUrl(loc);
	const listed = rows.filter((row) => rowVisible(row, view));
	const shown = query.trim() ? listed.filter((row) => rowName(row).toLowerCase().includes(query.trim().toLowerCase())) : listed;
	const safeCursor = Math.min(cursor, Math.max(0, shown.length - 1));
	const current = shown[safeCursor];
	(0, import_react.useEffect)(() => {
		if (!editing) setDraft(url);
	}, [url, editing]);
	(0, import_react.useEffect)(() => {
		if (active) setArmed(true);
	}, [active]);
	(0, import_react.useEffect)(() => {
		if (!armed) return;
		let cancel = false;
		setLoading(true);
		setError(null);
		setQuery("");
		setCursor(0);
		setRows([]);
		async function run() {
			try {
				if (loc.kind === "repos") {
					const repos = await fetchRepos(loc.user);
					if (cancel) return;
					setRows(repos.map((repo) => ({
						kind: "repo",
						repo
					})));
				} else {
					const entries = await fetchTree(loc.owner, loc.repo, loc.ref, loc.path);
					if (cancel) return;
					const next = entries.map(toRow);
					setRows(next);
					if (pendingFocus.current) {
						const name = pendingFocus.current;
						pendingFocus.current = null;
						const index = next.filter((row) => rowVisible(row, view)).findIndex((row) => rowName(row) === name);
						if (index >= 0) setCursor(index);
					}
					if (loc.path === "" && loc.description === null) fetchRepoMeta(loc.owner, loc.repo).then((meta) => {
						if (cancel) return;
						setStack((prev) => prev.map((item, index) => index === prev.length - 1 && locKey(item) === key ? {
							...item,
							description: meta.description
						} : item));
					}).catch(() => void 0);
				}
			} catch (err) {
				if (!cancel) setError(err instanceof Error ? err.message : "Couldn't reach GitHub.");
			} finally {
				if (!cancel) setLoading(false);
			}
		}
		run();
		return () => {
			cancel = true;
		};
	}, [
		key,
		reload,
		armed
	]);
	(0, import_react.useEffect)(() => {
		var _rowRefs$current$safe;
		(_rowRefs$current$safe = rowRefs.current[safeCursor]) === null || _rowRefs$current$safe === void 0 || _rowRefs$current$safe.scrollIntoView({ block: "nearest" });
	}, [
		safeCursor,
		shown.length,
		key
	]);
	function back() {
		if (stack.length > 1) setStack((prev) => prev.slice(0, -1));
		else onLibrary();
	}
	function openRepo(repo) {
		setStack((prev) => [...prev, {
			kind: "tree",
			user: loc.user,
			owner: loc.user,
			repo: repo.name,
			ref: repo.defaultBranch,
			path: "",
			description: repo.description
		}]);
	}
	function openDir(path) {
		setStack((prev) => [...prev, {
			...loc,
			path
		}]);
	}
	function playEntry(entry) {
		onPlay({
			title: cartTitle(loc.repo, entry.path),
			owner: loc.owner,
			repo: loc.repo,
			ref: loc.ref,
			path: entry.path
		});
	}
	function download(entry) {
		const params = new URLSearchParams({
			owner: loc.owner,
			repo: loc.repo,
			ref: loc.ref,
			path: entry.path,
			download: "1"
		});
		const link = document.createElement("a");
		link.href = appPath(`/api/raw?${params.toString()}`);
		link.rel = "noopener";
		document.body.appendChild(link);
		link.click();
		link.remove();
	}
	function activate(row) {
		if (!row || loading) return;
		if (row.kind === "repo") openRepo(row.repo);
		else if (row.kind === "dir") openDir(row.entry.path);
		else if (row.kind === "html") playEntry(row.entry);
		else download(row.entry);
	}
	(0, import_react.useEffect)(() => {
		if (!active) return;
		function onKey(event) {
			if (typingTarget(event.target)) return;
			const onControl = event.target instanceof HTMLElement && Boolean(event.target.closest("button, a")) && (event.key === "Enter" || event.key === " ");
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setCursor((value) => Math.min(shown.length - 1, value + 1));
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				setCursor((value) => Math.max(0, value - 1));
			} else if (event.key === "Backspace" || event.key === "Escape" || event.key === "x" || event.key === "X") {
				event.preventDefault();
				back();
			} else if (!onControl && (event.key === "Enter" || event.key === " " || event.key === "z" || event.key === "Z")) {
				event.preventDefault();
				activate(shown[Math.min(cursor, Math.max(0, shown.length - 1))]);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	async function onSubmit(event) {
		event.preventDefault();
		setResolving(true);
		setError(null);
		try {
			var _dest$focusName;
			const dest = await resolveAddress(draft);
			pendingFocus.current = (_dest$focusName = dest.focusName) !== null && _dest$focusName !== void 0 ? _dest$focusName : null;
			if (dest.kind === "repos") setStack([{
				kind: "repos",
				user: dest.user,
				owner: dest.user,
				repo: "",
				ref: "",
				path: "",
				description: null
			}]);
			else setStack([{
				kind: "repos",
				user: dest.owner,
				owner: dest.owner,
				repo: "",
				ref: "",
				path: "",
				description: null
			}, {
				kind: "tree",
				user: dest.owner,
				owner: dest.owner,
				repo: dest.repo,
				ref: dest.ref,
				path: dest.path,
				description: null
			}]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Couldn't open that address.");
		} finally {
			setResolving(false);
		}
	}
	(0, import_react.useEffect)(() => {
		const saved = window.localStorage.getItem(VIEW_KEY);
		if (saved === "html" || saved === "roms" || saved === "all") setView(saved);
	}, []);
	function chooseView(next) {
		setView(next);
		setCursor(0);
		window.localStorage.setItem(VIEW_KEY, next);
	}
	const htmlCount = listed.filter((row) => row.kind === "html").length;
	const romCount = listed.filter((row) => row.kind === "file" && isRomName(row.entry.name)).length;
	const title = loc.kind === "repos" ? loc.user : loc.repo;
	const kicker = loc.kind === "repos" ? "Public · no login" : loc.owner;
	const blurb = loc.kind === "repos" ? "Public repositories. HTML files can be played or downloaded." : loc.path ? loc.path : view === "all" ? listed.length > 0 ? `${listed.length} item${listed.length === 1 ? "" : "s"}` : "Nothing in this folder." : view === "roms" ? htmlCount + romCount > 0 ? `${htmlCount} HTML · ${romCount} ROM${romCount === 1 ? "" : "s"}` : "No HTML or ROM files in this folder." : htmlCount > 0 ? `${htmlCount} playable HTML file${htmlCount === 1 ? "" : "s"}` : (_loc$description = loc.description) !== null && _loc$description !== void 0 ? _loc$description : "No HTML in this folder.";
	const segments = loc.kind === "tree" ? loc.path.split("/").filter(Boolean) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex shrink-0 gap-2 border-b border-line px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "GitHub address",
				value: draft,
				spellCheck: false,
				autoComplete: "off",
				onChange: (event) => setDraft(event.target.value),
				onFocus: () => setEditing(true),
				onBlur: () => setEditing(false),
				className: "h-11 min-w-0 flex-1 border border-line bg-bg px-3 text-sm text-fg"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				"data-pad": "action",
				className: ghostBtn,
				disabled: resolving,
				children: resolving ? "…" : "Go"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 flex-wrap gap-2 border-b border-line px-4 py-3",
			role: "group",
			"aria-label": "Files to show",
			children: VIEWS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-pad": "toggle",
				"aria-pressed": view === item.id,
				className: view === item.id ? "inline-flex min-h-10 items-center bg-signal px-3 py-2 font-display text-sm font-semibold text-ink" : "inline-flex min-h-10 items-center border border-line px-3 py-2 font-display text-sm font-semibold text-fg",
				onClick: () => chooseView(item.id),
				children: item.label
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "shrink-0 border-b border-line px-4 py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-widest text-signal uppercase",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 truncate font-display text-3xl font-semibold tracking-tight md:text-5xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-sm text-muted",
					children: loading && rows.length === 0 ? "Reading GitHub…" : blurb
				}),
				loc.kind === "tree" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-pad": "crumb",
							className: "text-muted hover:text-fg",
							onClick: () => setStack([{
								...HOME,
								user: loc.owner,
								owner: loc.owner
							}]),
							children: loc.owner
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-line",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-pad": "crumb",
							className: "text-muted hover:text-fg",
							onClick: () => openDirReset(""),
							children: loc.repo
						}),
						segments.map((segment, index) => {
							const path = segments.slice(0, index + 1).join("/");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-line",
									children: "/"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-pad": "crumb",
									className: "text-muted hover:text-fg",
									onClick: () => openDirReset(path),
									children: segment
								})]
							}, path);
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-pad": "back",
							className: ghostBtn,
							onClick: back,
							children: "Back"
						}),
						(current === null || current === void 0 ? void 0 : current.kind) === "html" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-pad": "action",
							className: primaryBtn,
							onClick: () => playEntry(current.entry),
							children: "Play"
						}) : null,
						current && current.kind !== "html" && current.kind !== "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-pad": "action",
							className: primaryBtn,
							onClick: () => activate(current),
							children: "Open"
						}) : null,
						(current === null || current === void 0 ? void 0 : current.kind) === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-pad": "action",
							className: primaryBtn,
							onClick: () => download(current.entry),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Download"]
						}) : null,
						(current === null || current === void 0 ? void 0 : current.kind) === "html" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-pad": "action",
							className: ghostBtn,
							onClick: () => download(current.entry),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4",
								"aria-hidden": "true"
							}), "Download"]
						}) : null
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "listbox",
			"aria-label": "GitHub",
			className: "min-h-0 flex-1 overflow-y-auto",
			children: [
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-4",
					"aria-live": "polite",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: error
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-pad": "action",
						className: `${ghostBtn} mt-3`,
						onClick: () => setReload((value) => value + 1),
						children: "Try again"
					})]
				}) : null,
				!error && loading && shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-4 text-sm text-muted",
					children: "Reading GitHub…"
				}) : null,
				!error && !loading && shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-4 text-sm text-muted",
					children: query ? "Nothing matches that filter." : loc.kind === "repos" ? "No public repositories." : view === "all" ? "This folder is empty." : view === "roms" ? "No HTML or ROM files in this folder." : "No HTML files in this folder."
				}) : null,
				shown.map((row, index) => {
					const selected = index === safeCursor;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "option",
						"data-pad": "item",
						"aria-selected": selected,
						ref: (node) => {
							rowRefs.current[index] = node;
						},
						className: selected ? "flex min-h-12 w-full items-center gap-3 border-b border-line bg-signal px-4 py-3 text-left text-ink" : "flex min-h-12 w-full items-center gap-3 border-b border-line px-4 py-3 text-left text-fg hover:bg-raised",
						onClick: () => {
							if (safeCursor === index) activate(row);
							else setCursor(index);
						},
						onDoubleClick: () => activate(row),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowIcon, { row }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-display text-lg font-semibold",
									children: rowName(row)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: selected ? "block truncate text-sm text-ink/75" : "block truncate text-sm text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowMeta, { row })
								})]
							}),
							row.kind === "repo" && row.repo.stars > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex shrink-0 items-center gap-1 font-display text-sm tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: "size-4",
									"aria-hidden": "true"
								}), row.repo.stars]
							}) : null,
							row.kind === "html" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: selected ? "shrink-0 border border-ink px-2 py-1 font-display text-xs tracking-widest uppercase" : "shrink-0 border border-signal px-2 py-1 font-display text-xs tracking-widest text-signal uppercase",
								children: "Play"
							}) : null,
							row.kind === "file" && isRomName(row.entry.name) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: selected ? "shrink-0 border border-ink px-2 py-1 font-display text-xs tracking-widest uppercase" : "shrink-0 border border-line px-2 py-1 font-display text-xs tracking-widest text-muted uppercase",
								children: "ROM"
							}) : null
						]
					}, row.kind === "repo" ? row.repo.name : row.entry.path);
				})
			]
		}),
		listed.length > 12 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
			className: "flex shrink-0 gap-2 border-t border-line px-4 py-3",
			onSubmit: (event) => {
				event.preventDefault();
				setCursor(0);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Filter names",
				value: query,
				onChange: (event) => {
					setQuery(event.target.value);
					setCursor(0);
				},
				placeholder: "Filter names",
				className: "h-11 min-w-0 flex-1 border border-line bg-bg px-3 text-sm text-fg"
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBar, { children: "D-pad moves · A press · B back · Stick mouse" })
	] });
	function openDirReset(path) {
		if (loc.kind !== "tree") return;
		setStack([{
			kind: "repos",
			user: loc.owner,
			owner: loc.owner,
			repo: "",
			ref: "",
			path: "",
			description: null
		}, {
			...loc,
			path
		}]);
	}
}
function RowIcon({ row }) {
	const className = "size-5 shrink-0";
	if (row.kind === "dir") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
		className,
		"aria-hidden": "true"
	});
	if (row.kind === "html") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode2, {
		className,
		"aria-hidden": "true"
	});
	if (row.kind === "file" && isRomName(row.entry.name)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, {
		className,
		"aria-hidden": "true"
	});
	if (row.kind === "file") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, {
		className,
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
		className,
		"aria-hidden": "true"
	});
}
function RowMeta({ row }) {
	if (row.kind === "repo") {
		var _row$repo$language;
		const when = row.repo.updatedAt ? safeWhen(row.repo.updatedAt) : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			(_row$repo$language = row.repo.language) !== null && _row$repo$language !== void 0 ? _row$repo$language : "Repo",
			when ? ` · ${when}` : "",
			row.repo.description ? ` · ${row.repo.description}` : ""
		] });
	}
	if (row.kind === "dir") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Folder" });
	if (row.kind === "html") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Playable HTML · ", formatBytes(row.entry.size)] });
	if (isRomName(row.entry.name)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		romLabel(row.entry.name),
		" · ",
		formatBytes(row.entry.size)
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: formatBytes(row.entry.size) });
}
function safeWhen(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return formatDistanceToNow(date, { addSuffix: true });
}
/** R36S sticks often rest well above a small deadzone. */
var STICK_DEAD = .55;
function stickAxis(value) {
	if (Math.abs(value) < .55) return 0;
	return Math.sign(value) * ((Math.abs(value) - STICK_DEAD) / .44999999999999996);
}
function down(pad, index) {
	const button = pad.buttons[index];
	return !!button && (button.pressed || button.value > .5);
}
function hatAxis(value) {
	if (!(value >= 0) || value > 1) return null;
	const step = Math.round(value * 7);
	if (step === 7 || step === 0) return "up";
	if (step === 1 || step === 2) return "right";
	if (step === 3 || step === 4) return "down";
	if (step === 5 || step === 6) return "left";
	return null;
}
/** True when the handheld front-end (launched with ?fe=1) already drives the cursor and clicks. */
function padOwnedByFrontEnd() {
	if (typeof window === "undefined") return false;
	try {
		if (new URLSearchParams(window.location.search).get("fe") === "1") {
			window.sessionStorage.setItem("portlight-fe", "1");
			return true;
		}
		return window.sessionStorage.getItem("portlight-fe") === "1";
	} catch {
		return false;
	}
}
/**
* The R36S joystick driver reports a raw layout with no "standard" mapping:
* D-pad 8-11, Select 12, Start 13, L3 14, R3 15. Standard pads use D-pad 12-15, L3 10, R3 11.
*/
function readPad(pad) {
	var _pad$axes$2, _pad$axes$3;
	const standard = pad.mapping === "standard";
	const dpad = standard ? 12 : 8;
	let up = down(pad, dpad);
	let downB = down(pad, dpad + 1);
	let left = down(pad, dpad + 2);
	let right = down(pad, dpad + 3);
	if (!up && !downB && !left && !right) {
		var _pad$axes$;
		const hat = hatAxis((_pad$axes$ = pad.axes[9]) !== null && _pad$axes$ !== void 0 ? _pad$axes$ : -1);
		up = hat === "up";
		downB = hat === "down";
		left = hat === "left";
		right = hat === "right";
	}
	return {
		up,
		down: downB,
		left,
		right,
		a: down(pad, 0),
		b: down(pad, 1),
		l: down(pad, 4),
		r: down(pad, 5),
		l3: down(pad, standard ? 10 : 14),
		r3: down(pad, standard ? 11 : 15),
		lx: stickAxis((_pad$axes$2 = pad.axes[0]) !== null && _pad$axes$2 !== void 0 ? _pad$axes$2 : 0),
		ly: stickAxis((_pad$axes$3 = pad.axes[1]) !== null && _pad$axes$3 !== void 0 ? _pad$axes$3 : 0)
	};
}
var _KEY_INFO$KeyZ;
var _KEY_INFO$KeyQ;
var _KEY_INFO$KeyE;
var _KEY_INFO$KeyW;
var _KEY_INFO$KeyA;
var _KEY_INFO$KeyS;
var _KEY_INFO$KeyD;
var ARROWS = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
var MOUSE_MOVE = /* @__PURE__ */ new Set([
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD"
]);
var SHIFTED = {
	"1": "!",
	"2": "@",
	"3": "#",
	"4": "$",
	"5": "%",
	"6": "^",
	"7": "&",
	"8": "*",
	"9": "(",
	"0": ")",
	",": "<",
	".": ">",
	"/": "?"
};
function letter(ch) {
	const upper = ch.toUpperCase();
	return {
		label: upper,
		code: `Key${upper}`,
		key: ch,
		keyCode: upper.charCodeAt(0)
	};
}
function digit(n) {
	const label = String(n);
	return {
		label,
		code: `Digit${label}`,
		key: label,
		keyCode: label.charCodeAt(0)
	};
}
var ROWS = [
	[
		{
			label: "Esc",
			code: "Escape",
			key: "Escape",
			keyCode: 27
		},
		digit(1),
		digit(2),
		digit(3),
		digit(4),
		digit(5),
		digit(6),
		digit(7),
		digit(8),
		digit(9),
		digit(0),
		{
			label: "Bksp",
			code: "Backspace",
			key: "Backspace",
			keyCode: 8
		}
	],
	[
		{
			label: "Tab",
			code: "Tab",
			key: "Tab",
			keyCode: 9
		},
		letter("q"),
		letter("w"),
		letter("e"),
		letter("r"),
		letter("t"),
		letter("y"),
		letter("u"),
		letter("i"),
		letter("o"),
		letter("p")
	],
	[
		{
			label: "Caps",
			code: "CapsLock",
			key: "CapsLock",
			keyCode: 20,
			sticky: "caps"
		},
		letter("a"),
		letter("s"),
		letter("d"),
		letter("f"),
		letter("g"),
		letter("h"),
		letter("j"),
		letter("k"),
		letter("l"),
		{
			label: "Enter",
			code: "Enter",
			key: "Enter",
			keyCode: 13
		}
	],
	[
		{
			label: "Shift",
			code: "ShiftLeft",
			key: "Shift",
			keyCode: 16,
			sticky: "shift",
			span: 2
		},
		letter("z"),
		letter("x"),
		letter("c"),
		letter("v"),
		letter("b"),
		letter("n"),
		letter("m"),
		{
			label: ",",
			code: "Comma",
			key: ",",
			keyCode: 188
		},
		{
			label: ".",
			code: "Period",
			key: ".",
			keyCode: 190
		},
		{
			label: "/",
			code: "Slash",
			key: "/",
			keyCode: 191
		}
	],
	[
		{
			label: "Ctrl",
			code: "ControlLeft",
			key: "Control",
			keyCode: 17,
			sticky: "ctrl"
		},
		{
			label: "Alt",
			code: "AltLeft",
			key: "Alt",
			keyCode: 18,
			sticky: "alt"
		},
		{
			label: "Space",
			code: "Space",
			key: " ",
			keyCode: 32,
			span: 4
		},
		{
			label: "←",
			code: "ArrowLeft",
			key: "ArrowLeft",
			keyCode: 37
		},
		{
			label: "↑",
			code: "ArrowUp",
			key: "ArrowUp",
			keyCode: 38
		},
		{
			label: "↓",
			code: "ArrowDown",
			key: "ArrowDown",
			keyCode: 40
		},
		{
			label: "→",
			code: "ArrowRight",
			key: "ArrowRight",
			keyCode: 39
		}
	]
];
var KEY_INFO = {};
for (const row of ROWS) for (const key of row) KEY_INFO[key.code] = {
	key: key.key,
	keyCode: key.keyCode
};
KEY_INFO.KeyZ = (_KEY_INFO$KeyZ = KEY_INFO.KeyZ) !== null && _KEY_INFO$KeyZ !== void 0 ? _KEY_INFO$KeyZ : {
	key: "z",
	keyCode: 90
};
KEY_INFO.KeyX = {
	key: "x",
	keyCode: 88
};
KEY_INFO.KeyC = {
	key: "c",
	keyCode: 67
};
KEY_INFO.KeyV = {
	key: "v",
	keyCode: 86
};
KEY_INFO.KeyQ = (_KEY_INFO$KeyQ = KEY_INFO.KeyQ) !== null && _KEY_INFO$KeyQ !== void 0 ? _KEY_INFO$KeyQ : {
	key: "q",
	keyCode: 81
};
KEY_INFO.KeyE = (_KEY_INFO$KeyE = KEY_INFO.KeyE) !== null && _KEY_INFO$KeyE !== void 0 ? _KEY_INFO$KeyE : {
	key: "e",
	keyCode: 69
};
KEY_INFO.KeyW = (_KEY_INFO$KeyW = KEY_INFO.KeyW) !== null && _KEY_INFO$KeyW !== void 0 ? _KEY_INFO$KeyW : {
	key: "w",
	keyCode: 87
};
KEY_INFO.KeyA = (_KEY_INFO$KeyA = KEY_INFO.KeyA) !== null && _KEY_INFO$KeyA !== void 0 ? _KEY_INFO$KeyA : {
	key: "a",
	keyCode: 65
};
KEY_INFO.KeyS = (_KEY_INFO$KeyS = KEY_INFO.KeyS) !== null && _KEY_INFO$KeyS !== void 0 ? _KEY_INFO$KeyS : {
	key: "s",
	keyCode: 83
};
KEY_INFO.KeyD = (_KEY_INFO$KeyD = KEY_INFO.KeyD) !== null && _KEY_INFO$KeyD !== void 0 ? _KEY_INFO$KeyD : {
	key: "d",
	keyCode: 68
};
var HAT = [
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
];
function playSrc(target) {
	if (target.kind === "builtin") return appPath(target.src);
	return appPath(`/api/play?${new URLSearchParams({
		owner: target.owner,
		repo: target.repo,
		ref: target.ref,
		path: target.path
	}).toString()}`);
}
function clamp01(value) {
	return Math.min(1, Math.max(0, value));
}
function emitKey(frame, phase, code, key, keyCode, mods) {
	const win = frame === null || frame === void 0 ? void 0 : frame.contentWindow;
	if (!win) return;
	win.postMessage({
		source: "portlight",
		phase,
		code,
		key,
		keyCode,
		shiftKey: mods.shift,
		ctrlKey: mods.ctrl,
		altKey: mods.alt
	}, "*");
}
function emitMouse(frame, phase, button, nx, ny) {
	const win = frame === null || frame === void 0 ? void 0 : frame.contentWindow;
	if (!win) return;
	win.postMessage({
		source: "portlight",
		type: "mouse",
		phase,
		button,
		nx,
		ny
	}, "*");
}
function outputKey(vkey, mods) {
	const upper = (mods.shift || mods.caps) && vkey.key.length === 1 && /[a-z]/.test(vkey.key);
	const shifted = mods.shift ? SHIFTED[vkey.key] : void 0;
	return shifted !== null && shifted !== void 0 ? shifted : upper ? vkey.key.toUpperCase() : vkey.key;
}
function PlayerView({ target, onExit }) {
	const frame = (0, import_react.useRef)(null);
	const cursorRef = (0, import_react.useRef)(null);
	const pos = (0, import_react.useRef)({
		x: .5,
		y: .5
	});
	const held = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const mods = (0, import_react.useRef)({
		shift: false,
		ctrl: false,
		alt: false,
		caps: false
	});
	const keyboardRef = (0, import_react.useRef)(false);
	const mouseRef = (0, import_react.useRef)(false);
	const cellRef = (0, import_react.useRef)({
		r: 2,
		c: 1
	});
	const typing = (0, import_react.useRef)(null);
	const clicks = (0, import_react.useRef)({
		left: false,
		right: false
	});
	const hatPrev = (0, import_react.useRef)([
		false,
		false,
		false,
		false
	]);
	const hatHold = (0, import_react.useRef)({
		code: "",
		next: 0
	});
	const confirmPrev = (0, import_react.useRef)(false);
	const chromeRef = (0, import_react.useRef)(null);
	const shoulderPrev = (0, import_react.useRef)([
		false,
		false,
		false
	]);
	const [doc, setDoc] = (0, import_react.useState)(null);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [keyboardOn, setKeyboardOn] = (0, import_react.useState)(false);
	const [mouseOn, setMouseOn] = (0, import_react.useState)(false);
	const [cell, setCell] = (0, import_react.useState)({
		r: 2,
		c: 1
	});
	const [modView, setModView] = (0, import_react.useState)({
		shift: false,
		ctrl: false,
		alt: false,
		caps: false
	});
	const [chrome, setChrome] = (0, import_react.useState)(null);
	const src = playSrc(target);
	const localFrame = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
	keyboardRef.current = keyboardOn;
	mouseRef.current = mouseOn;
	cellRef.current = cell;
	function paintCursor() {
		const node = cursorRef.current;
		if (!node) return;
		node.style.left = `${pos.current.x * 100}%`;
		node.style.top = `${pos.current.y * 100}%`;
	}
	function moveCell(code) {
		setCell((prev) => {
			let r = prev.r;
			let c = prev.c;
			if (code === "ArrowUp") r = Math.max(0, r - 1);
			if (code === "ArrowDown") r = Math.min(ROWS.length - 1, r + 1);
			if (code === "ArrowLeft") c -= 1;
			if (code === "ArrowRight") c += 1;
			c = Math.max(0, Math.min(ROWS[r].length - 1, c));
			return {
				r,
				c
			};
		});
	}
	function selectedKey() {
		var _ROWS$here$r$here$c, _ROWS$here$r;
		const here = cellRef.current;
		return (_ROWS$here$r$here$c = (_ROWS$here$r = ROWS[here.r]) === null || _ROWS$here$r === void 0 ? void 0 : _ROWS$here$r[here.c]) !== null && _ROWS$here$r$here$c !== void 0 ? _ROWS$here$r$here$c : ROWS[0][0];
	}
	function typeSelected(down) {
		const vkey = selectedKey();
		if (vkey.sticky) {
			if (!down) return;
			const next = {
				...mods.current,
				[vkey.sticky]: !mods.current[vkey.sticky]
			};
			mods.current = next;
			setModView(next);
			emitKey(frame.current, next[vkey.sticky] ? "keydown" : "keyup", vkey.code, vkey.key, vkey.keyCode, next);
			return;
		}
		if (down) {
			var _typing$current;
			if (((_typing$current = typing.current) === null || _typing$current === void 0 ? void 0 : _typing$current.code) === vkey.code) return;
			typing.current = vkey;
			emitKey(frame.current, "keydown", vkey.code, outputKey(vkey, mods.current), vkey.keyCode, mods.current);
			return;
		}
		if (!typing.current) return;
		const released = typing.current;
		typing.current = null;
		emitKey(frame.current, "keyup", released.code, outputKey(released, mods.current), released.keyCode, mods.current);
	}
	function setClick(button, down) {
		if (!mouseRef.current) return;
		const side = button === 0 ? "left" : "right";
		if (clicks.current[side] === down) return;
		clicks.current[side] = down;
		emitMouse(frame.current, down ? "down" : "up", button, pos.current.x, pos.current.y);
	}
	(0, import_react.useEffect)(() => {
		const node = frame.current;
		if (!node || !doc || localFrame) return;
		const origin = window.location.origin;
		const html = doc.replace(/(\s(?:src|href|poster)=["'])\/api\//g, `$1${origin}/api/`);
		const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
		node.src = url;
		return () => URL.revokeObjectURL(url);
	}, [doc, localFrame]);
	(0, import_react.useEffect)(() => {
		if (localFrame) return;
		let cancel = false;
		setDoc(null);
		setLoadError(null);
		fetch(src, { credentials: "same-origin" }).then(async (res) => {
			if (!res.ok) throw new Error(String(res.status));
			const text = await res.text();
			if (!cancel) setDoc(text);
		}).catch(() => {
			if (!cancel) setLoadError("Couldn't open this game.");
		});
		return () => {
			cancel = true;
		};
	}, [src, localFrame]);
	(0, import_react.useEffect)(() => {
		var _frame$current;
		(_frame$current = frame.current) === null || _frame$current === void 0 || _frame$current.focus();
	}, [doc]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			if (event.target instanceof HTMLElement && event.target.closest("input, textarea")) return;
			const down = event.type === "keydown";
			if (event.code === "Escape") {
				if (down && !event.repeat) {
					event.preventDefault();
					onExit();
				}
				return;
			}
			if (keyboardRef.current && ARROWS.has(event.code)) {
				event.preventDefault();
				if (down) moveCell(event.code);
				return;
			}
			if (keyboardRef.current && (event.code === "Enter" || event.code === "KeyZ")) {
				event.preventDefault();
				if (event.repeat) return;
				typeSelected(down);
				return;
			}
			if (mouseRef.current && MOUSE_MOVE.has(event.code)) {
				event.preventDefault();
				if (down) held.current.add(event.code);
				else held.current.delete(event.code);
				return;
			}
			if (mouseRef.current && (event.code === "KeyQ" || event.code === "KeyE")) {
				event.preventDefault();
				if (event.repeat) return;
				setClick(event.code === "KeyQ" ? 0 : 2, down);
				return;
			}
			const info = KEY_INFO[event.code];
			if (!info || event.target === frame.current) return;
			event.preventDefault();
			if (event.repeat) return;
			emitKey(frame.current, down ? "keydown" : "keyup", event.code, info.key, info.keyCode, mods.current);
		}
		window.addEventListener("keydown", onKey);
		window.addEventListener("keyup", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("keyup", onKey);
		};
	}, [onExit]);
	(0, import_react.useEffect)(() => {
		const probe = window;
		probe.__portlightMouse = {
			getPos: () => ({
				x: pos.current.x,
				y: pos.current.y
			}),
			setHeld: (codes) => {
				held.current = new Set(codes);
			}
		};
		let last = performance.now();
		let raf = 0;
		function tick(now) {
			var _navigator$getGamepad, _navigator$getGamepad2, _navigator;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			let mx = 0;
			let my = 0;
			let stickX = 0;
			let stickY = 0;
			const pads = (_navigator$getGamepad = (_navigator$getGamepad2 = (_navigator = navigator).getGamepads) === null || _navigator$getGamepad2 === void 0 ? void 0 : _navigator$getGamepad2.call(_navigator)) !== null && _navigator$getGamepad !== void 0 ? _navigator$getGamepad : [];
			let pad = null;
			for (const candidate of pads) if (candidate) {
				pad = candidate;
				break;
			}
			if (pad) {
				const state = readPad(pad);
				stickX = state.lx;
				stickY = state.ly;
				const hatNow = [
					state.up,
					state.down,
					state.left,
					state.right
				];
				if (keyboardRef.current) {
					let code = "";
					if (hatNow[0]) code = "ArrowUp";
					else if (hatNow[1]) code = "ArrowDown";
					else if (hatNow[2]) code = "ArrowLeft";
					else if (hatNow[3]) code = "ArrowRight";
					if (!code) hatHold.current = {
						code: "",
						next: 0
					};
					else if (code !== hatHold.current.code) {
						moveCell(code);
						hatHold.current = {
							code,
							next: now + 280
						};
					} else if (now >= hatHold.current.next) {
						moveCell(code);
						hatHold.current = {
							code,
							next: now + 90
						};
					}
					hatPrev.current = hatNow;
				} else {
					HAT.forEach((code, index) => {
						if (hatNow[index] === hatPrev.current[index]) return;
						const info = KEY_INFO[code];
						emitKey(frame.current, hatNow[index] ? "keydown" : "keyup", code, info.key, info.keyCode, mods.current);
					});
					hatPrev.current = hatNow;
				}
				const confirm = state.a;
				[
					state.l,
					state.r,
					state.b
				].forEach((down, index) => {
					if (down === shoulderPrev.current[index]) return;
					shoulderPrev.current[index] = down;
					if (!down) return;
					const nodes = [...document.querySelectorAll("[data-chrome]")];
					if (index === 2) {
						if (chromeRef.current != null) {
							chromeRef.current = null;
							setChrome(null);
						} else if (keyboardRef.current) setKeyboardOn(false);
						return;
					}
					if (!nodes.length) return;
					const dir = index === 0 ? -1 : 1;
					const cur = chromeRef.current;
					const next = cur == null ? 0 : (cur + dir + nodes.length) % nodes.length;
					chromeRef.current = next;
					setChrome(next);
				});
				if (confirm !== confirmPrev.current) {
					confirmPrev.current = confirm;
					if (chromeRef.current != null) {
						if (confirm) {
							var _nodes$chromeRef$curr;
							(_nodes$chromeRef$curr = [...document.querySelectorAll("[data-chrome]")][chromeRef.current]) === null || _nodes$chromeRef$curr === void 0 || _nodes$chromeRef$curr.click();
						}
					} else if (keyboardRef.current) typeSelected(confirm);
				}
				if (mouseRef.current) {
					setClick(0, state.l3);
					setClick(2, state.r3);
				}
			}
			if (mouseRef.current) {
				if (held.current.has("KeyA")) mx -= 1;
				if (held.current.has("KeyD")) mx += 1;
				if (held.current.has("KeyW")) my -= 1;
				if (held.current.has("KeyS")) my += 1;
				mx += stickX;
				my += stickY;
				const mag = Math.hypot(mx, my);
				if (mag > 1) {
					mx /= mag;
					my /= mag;
				}
				if (mx !== 0 || my !== 0) {
					pos.current.x = clamp01(pos.current.x + mx * .72 * dt);
					pos.current.y = clamp01(pos.current.y + my * .72 * dt);
					paintCursor();
					emitMouse(frame.current, "move", 0, pos.current.x, pos.current.y);
				}
			}
			raf = requestAnimationFrame(tick);
		}
		raf = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(raf);
			delete probe.__portlightMouse;
		};
	}, []);
	const hint = [
		keyboardOn ? "D-pad selects · A or Z types" : mouseOn ? "" : "Arrows and Z play · L R header",
		mouseOn ? "WASD or stick moves · Q or L3 left click · E or R3 right click" : "",
		"Esc leaves"
	].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-chrome": "",
						"data-chrome-current": chrome === 0 ? "true" : void 0,
						className: ghostBtn,
						onClick: onExit,
						children: "Exit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "min-w-0 flex-1 truncate font-display text-lg font-semibold",
						children: target.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-chrome": "",
						"data-chrome-current": chrome === 1 ? "true" : void 0,
						"aria-pressed": keyboardOn,
						className: keyboardOn ? `${ghostBtn} border-signal bg-signal text-ink` : ghostBtn,
						onClick: () => setKeyboardOn((value) => !value),
						children: "Keyboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-chrome": "",
						"data-chrome-current": chrome === 2 ? "true" : void 0,
						"aria-pressed": mouseOn,
						className: mouseOn ? `${ghostBtn} border-signal bg-signal text-ink` : ghostBtn,
						onClick: () => {
							setMouseOn((value) => {
								if (value) {
									if (clicks.current.left) emitMouse(frame.current, "up", 0, pos.current.x, pos.current.y);
									if (clicks.current.right) emitMouse(frame.current, "up", 2, pos.current.x, pos.current.y);
									clicks.current = {
										left: false,
										right: false
									};
									held.current.clear();
								}
								return !value;
							});
						},
						children: "Mouse"
					})
				]
			}),
			loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-6 text-sm text-fg",
				children: loadError
			}) : localFrame ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					ref: frame,
					title: target.title,
					src,
					tabIndex: 0,
					className: "absolute inset-0 h-full w-full border-0 bg-bg"
				}), mouseOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: cursorRef,
						className: "absolute h-5 w-5",
						style: {
							left: "50%",
							top: "50%"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 16 16",
							className: "h-5 w-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M1 1 L1 13 L5.2 9.4 L8.4 15 L10.6 14 L7.3 8.4 L13 8.4 Z",
								fill: "#e6a23c",
								stroke: "#16130c",
								strokeWidth: "1"
							})
						})
					})
				}) : null]
			}) : doc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					ref: frame,
					title: target.title,
					tabIndex: 0,
					className: "absolute inset-0 h-full w-full border-0 bg-bg"
				}), mouseOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: cursorRef,
						className: "absolute h-5 w-5",
						style: {
							left: "50%",
							top: "50%"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 16 16",
							className: "h-5 w-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M1 1 L1 13 L5.2 9.4 L8.4 15 L10.6 14 L7.3 8.4 L13 8.4 Z",
								fill: "#e6a23c",
								stroke: "#16130c",
								strokeWidth: "1"
							})
						})
					})
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-6 text-sm text-muted",
				children: "Opening…"
			}),
			keyboardOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 border-t border-line px-2 py-2",
				role: "grid",
				"aria-label": "Virtual keyboard",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-12 gap-1",
					children: ROWS.map((row, r) => row.map((vkey, c) => {
						var _vkey$span;
						const selected = cell.r === r && cell.c === c;
						const sticky = vkey.sticky ? modView[vkey.sticky] : false;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "gridcell",
							"aria-selected": selected,
							style: { gridColumn: `span ${(_vkey$span = vkey.span) !== null && _vkey$span !== void 0 ? _vkey$span : 1}` },
							className: selected ? "flex h-9 items-center justify-center bg-signal font-display text-xs font-semibold text-ink" : sticky ? "flex h-9 items-center justify-center border border-signal bg-raised font-display text-xs font-semibold text-signal" : "flex h-9 items-center justify-center border border-line bg-raised font-display text-xs font-semibold text-fg",
							onPointerDown: (event) => {
								event.preventDefault();
								setCell({
									r,
									c
								});
								cellRef.current = {
									r,
									c
								};
								typeSelected(true);
							},
							onPointerUp: () => typeSelected(false),
							onPointerCancel: () => typeSelected(false),
							children: vkey.label
						}, `${vkey.code}-${c}`);
					}))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "flex h-10 min-w-0 shrink-0 items-center overflow-hidden border-t border-line px-4 font-display text-xs tracking-widest text-muted uppercase",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: hint
				})
			})
		]
	});
}
function visible(el) {
	const rect = el.getBoundingClientRect();
	return rect.width > 0 && rect.height > 0;
}
function targets() {
	return [...document.querySelectorAll("[data-pad]")].filter(visible);
}
function currentTarget() {
	return document.querySelector("[data-pad-current='true']");
}
function point(dir) {
	var _items$find, _best;
	const items = targets();
	if (!items.length) return;
	const current = currentTarget();
	const start = current && items.includes(current) ? current : (_items$find = items.find((el) => el.getAttribute("aria-selected") === "true")) !== null && _items$find !== void 0 ? _items$find : items[0];
	const box = start.getBoundingClientRect();
	const cx = box.left + box.width / 2;
	const cy = box.top + box.height / 2;
	let best = null;
	let bestScore = Infinity;
	for (const el of items) {
		if (el === start) continue;
		const rect = el.getBoundingClientRect();
		const dx = rect.left + rect.width / 2 - cx;
		const dy = rect.top + rect.height / 2 - cy;
		if (dir === "down" && dy < 10) continue;
		if (dir === "up" && dy > -10) continue;
		if (dir === "right" && dx < 10) continue;
		if (dir === "left" && dx > -10) continue;
		const score = (dir === "up" || dir === "down" ? Math.abs(dy) : Math.abs(dx)) + (dir === "up" || dir === "down" ? Math.abs(dx) : Math.abs(dy)) * 1.4;
		if (score < bestScore) {
			bestScore = score;
			best = el;
		}
	}
	const next = (_best = best) !== null && _best !== void 0 ? _best : start;
	if (current && current !== next) current.removeAttribute("data-pad-current");
	next.setAttribute("data-pad-current", "true");
	next.scrollIntoView({ block: "nearest" });
	if (next.getAttribute("role") === "option" && next.getAttribute("aria-selected") !== "true") next.click();
}
function pressCurrent() {
	var _currentTarget;
	const current = (_currentTarget = currentTarget()) !== null && _currentTarget !== void 0 ? _currentTarget : targets().find((el) => el.getAttribute("aria-selected") === "true");
	current === null || current === void 0 || current.click();
}
function pressBack() {
	const back = targets().find((el) => el.dataset.pad === "back");
	back === null || back === void 0 || back.click();
}
function clickAt(x, y, button) {
	const hit = document.elementFromPoint(x, y);
	const target = hit === null || hit === void 0 ? void 0 : hit.closest("button, a, input");
	if (!(target instanceof HTMLElement)) return;
	if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
		target.focus();
		return;
	}
	if (button === 2) {
		target.dispatchEvent(new MouseEvent("contextmenu", {
			bubbles: true,
			cancelable: true,
			clientX: x,
			clientY: y
		}));
		return;
	}
	target.click();
}
function MenuControls() {
	const cursorRef = (0, import_react.useRef)(null);
	const pos = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const shown = (0, import_react.useRef)(false);
	const [mouse, setMouse] = (0, import_react.useState)(false);
	const hold = (0, import_react.useRef)({
		code: "",
		next: 0
	});
	const clickPrev = (0, import_react.useRef)([
		false,
		false,
		false,
		false
	]);
	const stickSince = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		pos.current = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};
		function onKey(event) {
			if (event.target instanceof HTMLElement && Boolean(event.target.closest("input, textarea"))) return;
			const dir = event.key === "ArrowUp" ? "up" : event.key === "ArrowDown" ? "down" : event.key === "ArrowLeft" ? "left" : event.key === "ArrowRight" ? "right" : "";
			if (dir) {
				event.preventDefault();
				event.stopImmediatePropagation();
				point(dir);
				return;
			}
			if (shown.current && (event.code === "KeyQ" || event.code === "KeyE")) {
				event.preventDefault();
				event.stopImmediatePropagation();
				if (!event.repeat) clickAt(pos.current.x, pos.current.y, event.code === "KeyQ" ? 0 : 2);
				return;
			}
			if (event.key === "z" || event.key === "Z" || event.key === "Enter") {
				const current = currentTarget();
				if (current && current.getAttribute("role") !== "option") {
					event.preventDefault();
					event.stopImmediatePropagation();
					current.click();
				}
			}
		}
		window.addEventListener("keydown", onKey, true);
		let last = performance.now();
		let raf = 0;
		const keys = /* @__PURE__ */ new Set();
		function down(event) {
			if (event.code === "KeyW" || event.code === "KeyA" || event.code === "KeyS" || event.code === "KeyD") keys.add(event.code);
		}
		function up(event) {
			keys.delete(event.code);
		}
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		function tick(now) {
			var _navigator$getGamepad, _navigator$getGamepad2, _navigator;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const pads = (_navigator$getGamepad = (_navigator$getGamepad2 = (_navigator = navigator).getGamepads) === null || _navigator$getGamepad2 === void 0 ? void 0 : _navigator$getGamepad2.call(_navigator)) !== null && _navigator$getGamepad !== void 0 ? _navigator$getGamepad : [];
			let pad = null;
			for (const candidate of pads) if (candidate) {
				pad = candidate;
				break;
			}
			let mx = 0;
			let my = 0;
			if (keys.has("KeyA")) mx -= 1;
			if (keys.has("KeyD")) mx += 1;
			if (keys.has("KeyW")) my -= 1;
			if (keys.has("KeyS")) my += 1;
			if (pad && !padOwnedByFrontEnd()) {
				const state = readPad(pad);
				if (state.lx || state.ly) {
					if (!stickSince.current) stickSince.current = now;
					if (!shown.current && now - stickSince.current > 250) {
						shown.current = true;
						setMouse(true);
					}
					mx += state.lx;
					my += state.ly;
				} else stickSince.current = 0;
				let code = "";
				if (state.up) code = "up";
				else if (state.down) code = "down";
				else if (state.left) code = "left";
				else if (state.right) code = "right";
				if (!code) hold.current = {
					code: "",
					next: 0
				};
				else if (code !== hold.current.code) {
					point(code);
					hold.current = {
						code,
						next: now + 280
					};
				} else if (now >= hold.current.next) {
					point(code);
					hold.current = {
						code,
						next: now + 90
					};
				}
				const prev = clickPrev.current;
				if (state.a && !prev[0]) pressCurrent();
				if (state.b && !prev[1]) pressBack();
				if (shown.current && state.l3 && !prev[2]) clickAt(pos.current.x, pos.current.y, 0);
				if (shown.current && state.r3 && !prev[3]) clickAt(pos.current.x, pos.current.y, 2);
				clickPrev.current = [
					state.a,
					state.b,
					state.l3,
					state.r3
				];
			}
			if (shown.current && (mx || my)) {
				const mag = Math.hypot(mx, my);
				if (mag > 1) {
					mx /= mag;
					my /= mag;
				}
				pos.current.x = Math.min(window.innerWidth - 2, Math.max(0, pos.current.x + mx * 780 * dt));
				pos.current.y = Math.min(window.innerHeight - 2, Math.max(0, pos.current.y + my * 780 * dt));
				const node = cursorRef.current;
				if (node) {
					node.style.left = `${pos.current.x}px`;
					node.style.top = `${pos.current.y}px`;
				}
				const under = document.elementFromPoint(pos.current.x, pos.current.y);
				const scroller = under === null || under === void 0 ? void 0 : under.closest(".overflow-y-auto");
				if (scroller instanceof HTMLElement) {
					const rect = scroller.getBoundingClientRect();
					if (pos.current.y > rect.bottom - 28) scroller.scrollTop += 14;
					if (pos.current.y < rect.top + 28) scroller.scrollTop -= 14;
				}
			}
			raf = requestAnimationFrame(tick);
		}
		raf = requestAnimationFrame(tick);
		return () => {
			var _currentTarget2;
			cancelAnimationFrame(raf);
			window.removeEventListener("keydown", onKey, true);
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			(_currentTarget2 = currentTarget()) === null || _currentTarget2 === void 0 || _currentTarget2.removeAttribute("data-pad-current");
		};
	}, []);
	if (!mouse) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: cursorRef,
			className: "absolute h-5 w-5",
			style: {
				left: "50%",
				top: "50%"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 16 16",
				className: "h-5 w-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M1 1 L1 13 L5.2 9.4 L8.4 15 L10.6 14 L7.3 8.4 L13 8.4 Z",
					fill: "#e6a23c",
					stroke: "#16130c",
					strokeWidth: "1"
				})
			})
		})
	});
}
function Home() {
	const [screen, setScreen] = (0, import_react.useState)("library");
	const [play, setPlay] = (0, import_react.useState)(null);
	const [carts, setCarts] = (0, import_react.useState)(null);
	const returnTo = (0, import_react.useRef)("library");
	(0, import_react.useEffect)(() => {
		setCarts(loadCarts());
	}, []);
	(0, import_react.useEffect)(() => {
		if (carts === null) return;
		saveCarts(carts);
	}, [carts]);
	function remember(game) {
		var _game$title;
		const title = (_game$title = game.title) !== null && _game$title !== void 0 ? _game$title : cartTitle(game.repo, game.path);
		const id = cartId(game.owner, game.repo, game.ref, game.path);
		setCarts((prev) => [{
			id,
			title,
			owner: game.owner,
			repo: game.repo,
			ref: game.ref,
			path: game.path,
			addedAt: Date.now()
		}, ...(prev !== null && prev !== void 0 ? prev : []).filter((cart) => cart.id !== id)]);
	}
	function openBuiltin(game) {
		returnTo.current = screen === "github" ? "github" : "library";
		setPlay({
			kind: "builtin",
			title: game.title,
			src: game.src
		});
		setScreen("play");
	}
	function openCart(cart) {
		returnTo.current = "library";
		setPlay({
			kind: "github",
			title: cart.title,
			owner: cart.owner,
			repo: cart.repo,
			ref: cart.ref,
			path: cart.path
		});
		setScreen("play");
	}
	function openGithub(game) {
		remember(game);
		returnTo.current = "github";
		setPlay({
			kind: "github",
			...game
		});
		setScreen("play");
	}
	function exitPlay() {
		setScreen(returnTo.current);
		setPlay(null);
	}
	const shelf = carts !== null && carts !== void 0 ? carts : [];
	const libraryOn = screen === "library";
	const githubOn = screen === "github";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			screen !== "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-16 shrink-0 items-center gap-3 border-t-2 border-b border-t-signal border-b-line px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-8 shrink-0 place-items-center bg-signal font-display text-lg font-semibold text-ink",
						children: "P"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-display text-lg font-semibold tracking-wide",
							children: "PORTLIGHT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden text-xs text-muted sm:block",
							children: "ArkOS HTML station"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex shrink-0 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-pad": "library",
							className: libraryOn ? `${tabBtn} bg-signal text-ink` : `${tabBtn} border border-line text-fg`,
							onClick: () => setScreen("library"),
							children: "Library"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-pad": "github",
							className: githubOn ? `${tabBtn} bg-signal text-ink` : `${tabBtn} border border-line text-fg`,
							onClick: () => setScreen("github"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, {
								className: "size-4",
								"aria-hidden": "true"
							}), "GitHub"]
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: libraryOn ? "flex min-h-0 flex-1 flex-col" : "hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryView, {
					active: libraryOn,
					carts: shelf,
					onPlayBuiltin: openBuiltin,
					onPlayCart: openCart,
					onRemove: (id) => setCarts((prev) => (prev !== null && prev !== void 0 ? prev : []).filter((cart) => cart.id !== id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: githubOn ? "flex min-h-0 flex-1 flex-col" : "hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubView, {
					active: githubOn,
					onLibrary: () => setScreen("library"),
					onPlay: openGithub
				})
			}),
			screen !== "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuControls, {}) : null,
			screen === "play" && play ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerView, {
				target: play,
				onExit: exitPlay
			}) : null
		]
	});
}
//#endregion
export { Home as component };
