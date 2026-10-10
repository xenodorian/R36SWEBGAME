export type GhTarget = {
  owner: string;
  repo: string;
  ref: string;
  path: string;
};

const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;
const REF = /^(?!.*\.\.)[A-Za-z0-9._\-/]{1,200}$/;
const FILEPATH = /^(?!.*\.\.)[A-Za-z0-9._+\- ()@[\],']{1,500}$/;

const TYPES: Record<string, string> = {
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
  txt: "text/plain; charset=utf-8",
  md: "text/plain; charset=utf-8",
};

export function readTarget(request: Request): GhTarget {
  const url = new URL(request.url);
  const owner = url.searchParams.get("owner") ?? "";
  const repo = url.searchParams.get("repo") ?? "";
  const ref = url.searchParams.get("ref") ?? "";
  const path = url.searchParams.get("path") ?? "";
  if (!OWNER.test(owner) || !REPO.test(repo) || !REF.test(ref) || !FILEPATH.test(path)) {
    throw new Error("That GitHub path can't be opened.");
  }
  return { owner, repo, ref, path };
}

function encodeGitPath(value: string) {
  return value
    .split("/")
    .filter((part) => part.length > 0)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function guessType(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return TYPES[ext] ?? "application/octet-stream";
}

export function rawGithubUrl(target: GhTarget) {
  return `https://raw.githubusercontent.com/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/${encodeGitPath(target.ref)}/${encodeGitPath(target.path)}`;
}

export async function pullFile(target: GhTarget) {
  const res = await fetch(rawGithubUrl(target), {
    headers: { "User-Agent": "Portlight" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "GitHub doesn't have that file." : `GitHub returned ${res.status}.`);
  }
  const advertised = Number(res.headers.get("content-length") || 0);
  if (advertised > 12 * 1024 * 1024) throw new Error("That file is over 12 MB.");
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength > 12 * 1024 * 1024) throw new Error("That file is over 12 MB.");
  return bytes;
}

function escAttr(value: string) {
  const amp = "&" + "amp;";
  const quot = "&" + "quot;";
  const lt = "&" + "lt;";
  return value.replace(/&/g, amp).replace(/"/g, quot).replace(/</g, lt);
}

const BRIDGE = `(function(){window.addEventListener("message",function(e){var d=e.data;if(!d||d.source!=="portlight"||(d.phase!=="keydown"&&d.phase!=="keyup"))return;var nodes=[document,window];if(document.body)nodes.push(document.body);if(document.activeElement)nodes.push(document.activeElement);var canvas=document.querySelector("canvas");if(canvas)nodes.push(canvas);for(var i=0;i<nodes.length;i++){if(!nodes[i]||!nodes[i].dispatchEvent)continue;try{var ev=new KeyboardEvent(d.phase,{key:d.key,code:d.code,bubbles:true,cancelable:true});try{Object.defineProperty(ev,"keyCode",{get:function(){return d.keyCode}});Object.defineProperty(ev,"which",{get:function(){return d.keyCode}})}catch(err){}nodes[i].dispatchEvent(ev)}catch(err){}}});})();`;

export function injectPlayable(html: string, target: GhTarget) {
  const repoRoot = `https://cdn.jsdelivr.net/gh/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}@${encodeURIComponent(target.ref)}/`;
  const dir = target.path.includes("/") ? target.path.slice(0, target.path.lastIndexOf("/") + 1) : "";
  const dirBase = `${repoRoot}${encodeGitPath(dir)}${dir ? "/" : ""}`;
  const root = escAttr(repoRoot);
  const rewritten = html
    .replace(/<base\b[^>]*>/gi, "")
    .replace(/(\s(?:src|href|poster)=["'])\/(?!\/)/gi, `$1${root}`)
    .replace(/url\(\s*(['"]?)\/(?!\/)/gi, `url($1${root}`);
  const head = `<base href="${escAttr(dirBase)}"><script>${BRIDGE}</script>`;
  if (/<head[^>]*>/i.test(rewritten)) {
    return rewritten.replace(/<head[^>]*>/i, (match) => `${match}${head}`);
  }
  if (/<html[^>]*>/i.test(rewritten)) {
    return rewritten.replace(/<html[^>]*>/i, (match) => `${match}<head>${head}</head>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8">${head}</head><body>${rewritten}</body></html>`;
}

export function errorPage(message: string) {
  const amp = "&" + "amp;";
  const lt = "&" + "lt;";
  const safe = message.replace(/&/g, amp).replace(/</g, lt);
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#101210;color:#e7efe4;font-family:Segoe UI,sans-serif"><p style="max-width:26rem;padding:1.5rem;line-height:1.5">${safe}</p></body></html>`;
}
