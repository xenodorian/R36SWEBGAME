export type GhTarget = {
  owner: string;
  repo: string;
  ref: string;
  path: string;
};

const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;
const REF = /^(?!.*\.\.)[A-Za-z0-9._\-/]{1,200}$/;
const FILEPATH = /^(?!.*\.\.)[A-Za-z0-9._+\-/ ()@[\],']{1,500}$/;

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
  mid: "audio/midi",
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

export function cdnDir(target: GhTarget) {
  const dir = target.path.includes("/") ? target.path.slice(0, target.path.lastIndexOf("/") + 1) : "";
  const enc = encodeGitPath(dir);
  const root = `/api/cdn/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/${encodeURIComponent(target.ref)}/`;
  return `${root}${enc}${enc ? "/" : ""}`;
}

export function targetFromCdnSplat(splat: string): GhTarget {
  const parts = splat
    .split("/")
    .filter((part) => part.length > 0)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });
  if (parts.length < 3) throw new Error("That GitHub path can't be opened.");
  const owner = parts[0] ?? "";
  const repo = parts[1] ?? "";
  const ref = parts[2] ?? "";
  let path = parts.slice(3).join("/");
  if (!path || !/\.[A-Za-z0-9]{1,8}$/.test(path)) {
    path = `${path.replace(/\/$/, "")}${path ? "/" : ""}index.html`;
  }
  if (!OWNER.test(owner) || !REPO.test(repo) || !REF.test(ref) || !FILEPATH.test(path)) {
    throw new Error("That GitHub path can't be opened.");
  }
  return { owner, repo, ref, path };
}

export function rawGithubUrl(target: GhTarget) {
  return `https://raw.githubusercontent.com/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/${encodeGitPath(target.ref)}/${encodeGitPath(target.path)}`;
}

export async function openFile(target: GhTarget, timeoutMs = 0) {
  const res = await fetch(rawGithubUrl(target), {
    headers: { "User-Agent": "Portlight", Accept: "application/octet-stream" },
    redirect: "follow",
    signal: timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined,
  });
  if (!res.ok) {
    throw new Error(res.status === 404 ? "GitHub doesn't have that file." : `GitHub returned ${res.status}.`);
  }
  return res;
}

export async function pullFile(target: GhTarget) {
  const res = await openFile(target, 20000);
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

const BRIDGE = `(function(){function fireKey(d){var nodes=[document,window];if(document.body)nodes.push(document.body);if(document.activeElement)nodes.push(document.activeElement);var canvas=document.querySelector("canvas");if(canvas)nodes.push(canvas);for(var i=0;i<nodes.length;i++){if(!nodes[i]||!nodes[i].dispatchEvent)continue;try{var ev=new KeyboardEvent(d.phase,{key:d.key,code:d.code,bubbles:true,cancelable:true,shiftKey:!!d.shiftKey,ctrlKey:!!d.ctrlKey,altKey:!!d.altKey});try{Object.defineProperty(ev,"keyCode",{get:function(){return d.keyCode}});Object.defineProperty(ev,"which",{get:function(){return d.keyCode}})}catch(err){}nodes[i].dispatchEvent(ev)}catch(err){}}}function fireMouse(d){var x=(+d.nx||0)*window.innerWidth;var y=(+d.ny||0)*window.innerHeight;var button=d.button===2?2:0;var buttons=d.phase==="up"?0:(button===2?2:1);var target=document.elementFromPoint(x,y)||document.body;var common={bubbles:true,cancelable:true,view:window,clientX:x,clientY:y,screenX:x,screenY:y,button:button,buttons:buttons};if(window.PointerEvent){var ptype=d.phase==="move"?"pointermove":d.phase==="down"?"pointerdown":"pointerup";try{target.dispatchEvent(new PointerEvent(ptype,Object.assign({pointerId:1,pointerType:"mouse",isPrimary:true},common)))}catch(err){}}var mtype=d.phase==="move"?"mousemove":d.phase==="down"?"mousedown":"mouseup";target.dispatchEvent(new MouseEvent(mtype,common));if(d.phase==="up"){target.dispatchEvent(new MouseEvent("click",common));if(button===2)target.dispatchEvent(new MouseEvent("contextmenu",common));}}window.addEventListener("message",function(e){var d=e.data;if(!d||d.source!=="portlight")return;if(d.type==="mouse"){fireMouse(d);return;}if(d.phase!=="keydown"&&d.phase!=="keyup")return;fireKey(d);});})();`;

export function injectPlayable(html: string, target: GhTarget) {
  const repoRoot = cdnDir({ ...target, path: "index.html" });
  const dirBase = cdnDir(target);
  const root = escAttr(repoRoot);
  const rewritten = html
    .replace(/<base\b[^>]*>/gi, "")
    .replace(/(\s(?:src|href|poster)=["'])\/(?!\/)/gi, `$1${root}`)
    .replace(/url\(\s*(['"]?)\/(?!\/)/gi, `url($1${root}`)
    .replace(/(\s(?:src|href|poster)=["'])(?![a-z]+:|\/\/|#|\/)/gi, `$1${escAttr(dirBase)}`);
  const rootJson = JSON.stringify(dirBase);
  const assets = `(function(){var root=${rootJson};function abs(url){if(typeof url!=="string"||!url)return url;var t=url.trim();if(/^[a-z][a-z0-9+.-]*:/i.test(t)||t.indexOf("//")===0||t.charAt(0)==="#"||t.indexOf("data:")===0||t.indexOf("blob:")===0)return url;var origin=(location.origin&&location.origin!=="null")?location.origin:"";if(t.charAt(0)==="/")return origin?origin+t:url;try{var u=new URL(t,"https://portlight.local"+root);return (origin||"")+u.pathname+u.search+u.hash}catch(e){return (origin||"")+root+t}}function hook(proto,prop){var d=Object.getOwnPropertyDescriptor(proto,prop);if(!d||!d.set||!d.get)return;Object.defineProperty(proto,prop,{configurable:true,enumerable:d.enumerable,get:function(){return d.get.call(this)},set:function(v){d.set.call(this,abs(v))}})}hook(HTMLImageElement.prototype,"src");if(window.HTMLMediaElement)hook(HTMLMediaElement.prototype,"src");var setAttr=Element.prototype.setAttribute;Element.prototype.setAttribute=function(name,value){if((name==="src"||name==="href"||name==="poster")&&typeof value==="string")value=abs(value);return setAttr.call(this,name,value)};if(window.fetch){var origFetch=window.fetch;window.fetch=function(input,init){if(typeof input==="string")input=abs(input);return origFetch.call(this,input,init)}}var origOpen=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url){var args=Array.prototype.slice.call(arguments);args[1]=abs(String(url));return origOpen.apply(this,args)}})();`;
  const head = `<script>${assets}</script><script>${BRIDGE}</script>`;
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
