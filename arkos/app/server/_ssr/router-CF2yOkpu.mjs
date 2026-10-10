import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, _ as createFileRoute, b as require_jsx_runtime, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CF2yOkpu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	var _PORT_ID_PREFIX$exec;
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return (_PORT_ID_PREFIX$exec = PORT_ID_PREFIX.exec(pathname)) === null || _PORT_ID_PREFIX$exec === void 0 ? void 0 : _PORT_ID_PREFIX$exec[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin !== null && ancestorOrigin !== void 0 ? ancestorOrigin : ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		var _options$getRoutePath, _options$getRoutePath2;
		const paths = (_options$getRoutePath = (_options$getRoutePath2 = options.getRoutePaths) === null || _options$getRoutePath2 === void 0 ? void 0 : _options$getRoutePath2.call(options)) !== null && _options$getRoutePath !== void 0 ? _options$getRoutePath : [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		var _hostMessageHandlers$;
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		(_hostMessageHandlers$ = hostMessageHandlers.get(envelope.data.type)) === null || _hostMessageHandlers$ === void 0 || _hostMessageHandlers$(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-CD18GpNu.css";
var APP_NAME = "Portlight";
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#101210"
			},
			{
				name: "description",
				content: "Play HTML games and pull public GitHub files, built like an ArkOS handheld."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter = () => import("./routes-Desiyf-l.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
var REPO = /^[A-Za-z0-9._-]{1,100}$/;
var REF = /^(?!.*\.\.)[A-Za-z0-9._\-/]{1,200}$/;
var FILEPATH = /^(?!.*\.\.)[A-Za-z0-9._+\-/ ()@[\],']{1,500}$/;
var TYPES = {
	html: "text/html; charset=utf-8",
	htm: "text/html; charset=utf-8",
	js: "text/javascript; charset=utf-8",
	mjs: "text/javascript; charset=utf-8",
	css: "text/css; charset=utf-8",
	json: "application/json; charset=utf-8",
	svg: "image/svg+xml",
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp",
	mp3: "audio/mpeg",
	wav: "audio/wav",
	ogg: "audio/ogg",
	mid: "audio/midi",
	txt: "text/plain; charset=utf-8",
	md: "text/plain; charset=utf-8"
};
function readTarget(request) {
	var _url$searchParams$get, _url$searchParams$get2, _url$searchParams$get3, _url$searchParams$get4;
	const url = new URL(request.url);
	const owner = (_url$searchParams$get = url.searchParams.get("owner")) !== null && _url$searchParams$get !== void 0 ? _url$searchParams$get : "";
	const repo = (_url$searchParams$get2 = url.searchParams.get("repo")) !== null && _url$searchParams$get2 !== void 0 ? _url$searchParams$get2 : "";
	const ref = (_url$searchParams$get3 = url.searchParams.get("ref")) !== null && _url$searchParams$get3 !== void 0 ? _url$searchParams$get3 : "";
	const path = (_url$searchParams$get4 = url.searchParams.get("path")) !== null && _url$searchParams$get4 !== void 0 ? _url$searchParams$get4 : "";
	if (!OWNER.test(owner) || !REPO.test(repo) || !REF.test(ref) || !FILEPATH.test(path)) throw new Error("That GitHub path can't be opened.");
	return {
		owner,
		repo,
		ref,
		path
	};
}
function encodeGitPath(value) {
	return value.split("/").filter((part) => part.length > 0).map((part) => encodeURIComponent(part)).join("/");
}
function guessType(path) {
	var _path$split$pop$toLow, _path$split$pop, _TYPES$ext;
	return (_TYPES$ext = TYPES[(_path$split$pop$toLow = (_path$split$pop = path.split(".").pop()) === null || _path$split$pop === void 0 ? void 0 : _path$split$pop.toLowerCase()) !== null && _path$split$pop$toLow !== void 0 ? _path$split$pop$toLow : ""]) !== null && _TYPES$ext !== void 0 ? _TYPES$ext : "application/octet-stream";
}
function cdnDir(target) {
	const enc = encodeGitPath(target.path.includes("/") ? target.path.slice(0, target.path.lastIndexOf("/") + 1) : "");
	return `${`/api/cdn/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/${encodeURIComponent(target.ref)}/`}${enc}${enc ? "/" : ""}`;
}
function targetFromCdnSplat(splat) {
	var _parts$, _parts$2, _parts$3;
	const parts = splat.split("/").filter((part) => part.length > 0).map((part) => {
		try {
			return decodeURIComponent(part);
		} catch {
			return part;
		}
	});
	if (parts.length < 3) throw new Error("That GitHub path can't be opened.");
	const owner = (_parts$ = parts[0]) !== null && _parts$ !== void 0 ? _parts$ : "";
	const repo = (_parts$2 = parts[1]) !== null && _parts$2 !== void 0 ? _parts$2 : "";
	const ref = (_parts$3 = parts[2]) !== null && _parts$3 !== void 0 ? _parts$3 : "";
	let path = parts.slice(3).join("/");
	if (!path || !/\.[A-Za-z0-9]{1,8}$/.test(path)) path = `${path.replace(/\/$/, "")}${path ? "/" : ""}index.html`;
	if (!OWNER.test(owner) || !REPO.test(repo) || !REF.test(ref) || !FILEPATH.test(path)) throw new Error("That GitHub path can't be opened.");
	return {
		owner,
		repo,
		ref,
		path
	};
}
function rawGithubUrl(target) {
	return `https://raw.githubusercontent.com/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/${encodeGitPath(target.ref)}/${encodeGitPath(target.path)}`;
}
async function openFile(target, timeoutMs = 0) {
	const res = await fetch(rawGithubUrl(target), {
		headers: {
			"User-Agent": "Portlight",
			Accept: "application/octet-stream"
		},
		redirect: "follow",
		signal: timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : void 0
	});
	if (!res.ok) throw new Error(res.status === 404 ? "GitHub doesn't have that file." : `GitHub returned ${res.status}.`);
	return res;
}
async function pullFile(target) {
	const res = await openFile(target, 2e4);
	if (Number(res.headers.get("content-length") || 0) > 12582912) throw new Error("That file is over 12 MB.");
	const bytes = new Uint8Array(await res.arrayBuffer());
	if (bytes.byteLength > 12582912) throw new Error("That file is over 12 MB.");
	return bytes;
}
function escAttr(value) {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
var BRIDGE = `(function(){function fireKey(d){var nodes=[document,window];if(document.body)nodes.push(document.body);if(document.activeElement)nodes.push(document.activeElement);var canvas=document.querySelector("canvas");if(canvas)nodes.push(canvas);for(var i=0;i<nodes.length;i++){if(!nodes[i]||!nodes[i].dispatchEvent)continue;try{var ev=new KeyboardEvent(d.phase,{key:d.key,code:d.code,bubbles:true,cancelable:true,shiftKey:!!d.shiftKey,ctrlKey:!!d.ctrlKey,altKey:!!d.altKey});try{Object.defineProperty(ev,"keyCode",{get:function(){return d.keyCode}});Object.defineProperty(ev,"which",{get:function(){return d.keyCode}})}catch(err){}nodes[i].dispatchEvent(ev)}catch(err){}}}function fireMouse(d){var x=(+d.nx||0)*window.innerWidth;var y=(+d.ny||0)*window.innerHeight;var button=d.button===2?2:0;var buttons=d.phase==="up"?0:(button===2?2:1);var target=document.elementFromPoint(x,y)||document.body;var common={bubbles:true,cancelable:true,view:window,clientX:x,clientY:y,screenX:x,screenY:y,button:button,buttons:buttons};if(window.PointerEvent){var ptype=d.phase==="move"?"pointermove":d.phase==="down"?"pointerdown":"pointerup";try{target.dispatchEvent(new PointerEvent(ptype,Object.assign({pointerId:1,pointerType:"mouse",isPrimary:true},common)))}catch(err){}}var mtype=d.phase==="move"?"mousemove":d.phase==="down"?"mousedown":"mouseup";target.dispatchEvent(new MouseEvent(mtype,common));if(d.phase==="up"){target.dispatchEvent(new MouseEvent("click",common));if(button===2)target.dispatchEvent(new MouseEvent("contextmenu",common));}}window.addEventListener("message",function(e){var d=e.data;if(!d||d.source!=="portlight")return;if(d.type==="mouse"){fireMouse(d);return;}if(d.phase!=="keydown"&&d.phase!=="keyup")return;fireKey(d);});})();`;
function injectPlayable(html, target) {
	const repoRoot = cdnDir({
		...target,
		path: "index.html"
	});
	const dirBase = cdnDir(target);
	const root = escAttr(repoRoot);
	const rewritten = html.replace(/<base\b[^>]*>/gi, "").replace(/(\s(?:src|href|poster)=["'])\/(?!\/)/gi, `$1${root}`).replace(/url\(\s*(['"]?)\/(?!\/)/gi, `url($1${root}`).replace(/(\s(?:src|href|poster)=["'])(?![a-z]+:|\/\/|#|\/)/gi, `$1${escAttr(dirBase)}`);
	const head = `<script>${`(function(){var root=${JSON.stringify(dirBase)};function abs(url){if(typeof url!=="string"||!url)return url;var t=url.trim();if(/^[a-z][a-z0-9+.-]*:/i.test(t)||t.indexOf("//")===0||t.charAt(0)==="#"||t.indexOf("data:")===0||t.indexOf("blob:")===0)return url;var origin=(location.origin&&location.origin!=="null")?location.origin:"";if(t.charAt(0)==="/")return origin?origin+t:url;try{var u=new URL(t,"https://portlight.local"+root);return (origin||"")+u.pathname+u.search+u.hash}catch(e){return (origin||"")+root+t}}function hook(proto,prop){var d=Object.getOwnPropertyDescriptor(proto,prop);if(!d||!d.set||!d.get)return;Object.defineProperty(proto,prop,{configurable:true,enumerable:d.enumerable,get:function(){return d.get.call(this)},set:function(v){d.set.call(this,abs(v))}})}hook(HTMLImageElement.prototype,"src");if(window.HTMLMediaElement)hook(HTMLMediaElement.prototype,"src");var setAttr=Element.prototype.setAttribute;Element.prototype.setAttribute=function(name,value){if((name==="src"||name==="href"||name==="poster")&&typeof value==="string")value=abs(value);return setAttr.call(this,name,value)};if(window.fetch){var origFetch=window.fetch;window.fetch=function(input,init){if(typeof input==="string")input=abs(input);return origFetch.call(this,input,init)}}var origOpen=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url){var args=Array.prototype.slice.call(arguments);args[1]=abs(String(url));return origOpen.apply(this,args)}})();`}<\/script><script>${BRIDGE}<\/script>`;
	if (/<head[^>]*>/i.test(rewritten)) return rewritten.replace(/<head[^>]*>/i, (match) => `${match}${head}`);
	if (/<html[^>]*>/i.test(rewritten)) return rewritten.replace(/<html[^>]*>/i, (match) => `${match}<head>${head}</head>`);
	return `<!doctype html><html><head><meta charset="utf-8">${head}</head><body>${rewritten}</body></html>`;
}
function errorPage(message) {
	return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#101210;color:#e7efe4;font-family:Segoe UI,sans-serif"><p style="max-width:26rem;padding:1.5rem;line-height:1.5">${message.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p></body></html>`;
}
function page(message) {
	return new Response(errorPage(message), { headers: { "content-type": "text/html; charset=utf-8" } });
}
var Route$2 = createFileRoute("/api/play")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const target = readTarget(request);
		if (!/\.html?$/i.test(target.path)) return page("Only HTML files play here. Download other files instead.");
		const bytes = await pullFile(target);
		if (bytes.byteLength > 15e5) return page("That HTML file is too large to play here. Download it instead.");
		const html = injectPlayable(new TextDecoder().decode(bytes), target);
		return new Response(html, { headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": "no-store",
			"x-content-type-options": "nosniff"
		} });
	} catch (error) {
		return page(error instanceof Error ? error.message : "Couldn't open that file.");
	}
} } } });
var Route$1 = createFileRoute("/api/raw")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const target = readTarget(request);
		const upstream = await openFile(target);
		const download = new URL(request.url).searchParams.get("download") === "1";
		const name = (target.path.split("/").pop() || "download").replace(/["\r\n]/g, "");
		const headers = {
			"content-type": guessType(target.path),
			"cache-control": "no-store",
			"x-content-type-options": "nosniff"
		};
		const length = upstream.headers.get("content-length");
		if (length) headers["content-length"] = length;
		if (download) headers["content-disposition"] = `attachment; filename="${name}"`;
		return new Response(upstream.body, { headers });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Couldn't download that file.";
		return new Response(message, {
			status: 400,
			headers: { "content-type": "text/plain; charset=utf-8" }
		});
	}
} } } });
function fail(message, status) {
	return new Response(errorPage(message), {
		status,
		headers: {
			"content-type": "text/html; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "no-store"
		}
	});
}
var Route = createFileRoute("/api/cdn/$")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const pathname = new URL(request.url).pathname;
		const target = targetFromCdnSplat(pathname.startsWith("/api/cdn/") ? pathname.slice(9) : "");
		const bytes = await pullFile(target);
		const html = /\.html?$/i.test(target.path);
		const body = html ? injectPlayable(new TextDecoder().decode(bytes), target) : bytes;
		return new Response(body, { headers: {
			"content-type": html ? "text/html; charset=utf-8" : guessType(target.path),
			"cache-control": "private, max-age=300",
			"access-control-allow-origin": "*",
			"x-content-type-options": "nosniff"
		} });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Couldn't open that file.";
		return fail(message, message.includes("doesn't have") ? 404 : 400);
	}
} } } });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	ApiPlayRoute: Route$2.update({
		id: "/api/play",
		path: "/api/play",
		getParentRoute: () => Route$4
	}),
	ApiRawRoute: Route$1.update({
		id: "/api/raw",
		path: "/api/raw",
		getParentRoute: () => Route$4
	}),
	ApiCdnSplatRoute: Route.update({
		id: "/api/cdn/$",
		path: "/api/cdn/$",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { previewPathPrefix as n, router_exports as t };
