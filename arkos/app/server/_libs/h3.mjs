import nodeHTTP from "node:http";
import { PassThrough, Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import nodeHTTPS from "node:https";
import nodeHTTP2 from "node:http2";
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/checkPrivateRedeclaration.js
function _checkPrivateRedeclaration(e, t) {
	if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/classPrivateMethodInitSpec.js
function _classPrivateMethodInitSpec(e, a) {
	_checkPrivateRedeclaration(e, a), a.add(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/classPrivateFieldInitSpec.js
function _classPrivateFieldInitSpec(e, t, a) {
	_checkPrivateRedeclaration(e, t), t.set(e, a);
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/assertClassBrand.js
function _assertClassBrand(e, t, n) {
	if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw new TypeError("Private element is not present on this object");
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/classPrivateFieldSet2.js
function _classPrivateFieldSet2(s, a, r) {
	return s.set(_assertClassBrand(s, a), r), r;
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/classPrivateFieldGet2.js
function _classPrivateFieldGet2(s, a) {
	return s.get(_assertClassBrand(s, a));
}
//#endregion
//#region node_modules/srvx/dist/_chunks/_url.mjs
function lazyInherit(target, source, sourceKey) {
	for (const key of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
		if (key === "constructor") continue;
		const targetDesc = Object.getOwnPropertyDescriptor(target, key);
		const desc = Object.getOwnPropertyDescriptor(source, key);
		let modified = false;
		if (desc.get) {
			modified = true;
			desc.get = (targetDesc === null || targetDesc === void 0 ? void 0 : targetDesc.get) || function() {
				return this[sourceKey][key];
			};
		}
		if (desc.set) {
			modified = true;
			desc.set = (targetDesc === null || targetDesc === void 0 ? void 0 : targetDesc.set) || function(value) {
				this[sourceKey][key] = value;
			};
		}
		if (!(targetDesc === null || targetDesc === void 0 ? void 0 : targetDesc.value) && typeof desc.value === "function") {
			modified = true;
			desc.value = function(...args) {
				return this[sourceKey][key](...args);
			};
		}
		if (modified) Object.defineProperty(target, key, desc);
	}
}
var _needsNormRE = /(?:(?:^|\/)(?:\.|\.\.|%2e|%2e\.|\.%2e|%2e%2e)(?:\/|$))|[\\^#"<>{}`\x80-\uffff]/i;
var _searchNeedsNormRE = /[#"'<>]/;
var FastURL = /* @__PURE__ */ (() => {
	var _url, _href, _protocol, _host, _pathname, _search, _searchParams, _pos, _URL_brand;
	let _Symbol$hasInstance;
	const NativeURL = globalThis.URL;
	const FastURL = (_url = /* @__PURE__ */ new WeakMap(), _href = /* @__PURE__ */ new WeakMap(), _protocol = /* @__PURE__ */ new WeakMap(), _host = /* @__PURE__ */ new WeakMap(), _pathname = /* @__PURE__ */ new WeakMap(), _search = /* @__PURE__ */ new WeakMap(), _searchParams = /* @__PURE__ */ new WeakMap(), _pos = /* @__PURE__ */ new WeakMap(), _URL_brand = /* @__PURE__ */ new WeakSet(), _Symbol$hasInstance = Symbol.hasInstance, class URL {
		constructor(url) {
			_classPrivateMethodInitSpec(this, _URL_brand);
			_classPrivateFieldInitSpec(this, _url, void 0);
			_classPrivateFieldInitSpec(this, _href, void 0);
			_classPrivateFieldInitSpec(this, _protocol, void 0);
			_classPrivateFieldInitSpec(this, _host, void 0);
			_classPrivateFieldInitSpec(this, _pathname, void 0);
			_classPrivateFieldInitSpec(this, _search, void 0);
			_classPrivateFieldInitSpec(this, _searchParams, void 0);
			_classPrivateFieldInitSpec(this, _pos, void 0);
			if (typeof url === "string") {
				const isOriginForm = url[0] === "/";
				if (isOriginForm && !_searchNeedsNormRE.test(url)) _classPrivateFieldSet2(_href, this, url);
				else _classPrivateFieldSet2(_url, this, new NativeURL(isOriginForm ? `http://localhost${url}` : url));
			} else if (_needsNormRE.test(url.pathname) || url.search && _searchNeedsNormRE.test(url.search)) _classPrivateFieldSet2(_url, this, new NativeURL(`${url.protocol || "http:"}//${url.host || "localhost"}${url.pathname}${url.search || ""}`));
			else {
				_classPrivateFieldSet2(_protocol, this, url.protocol);
				_classPrivateFieldSet2(_host, this, url.host);
				_classPrivateFieldSet2(_pathname, this, url.pathname);
				_classPrivateFieldSet2(_search, this, url.search);
			}
		}
		static [_Symbol$hasInstance](val) {
			return val instanceof NativeURL;
		}
		get _url() {
			if (_classPrivateFieldGet2(_url, this)) return _classPrivateFieldGet2(_url, this);
			_classPrivateFieldSet2(_url, this, new NativeURL(this.href));
			_classPrivateFieldSet2(_href, this, void 0);
			_classPrivateFieldSet2(_protocol, this, void 0);
			_classPrivateFieldSet2(_host, this, void 0);
			_classPrivateFieldSet2(_pathname, this, void 0);
			_classPrivateFieldSet2(_search, this, void 0);
			_classPrivateFieldSet2(_searchParams, this, void 0);
			_classPrivateFieldSet2(_pos, this, void 0);
			return _classPrivateFieldGet2(_url, this);
		}
		get href() {
			if (_classPrivateFieldGet2(_url, this)) return _classPrivateFieldGet2(_url, this).href;
			if (!_classPrivateFieldGet2(_href, this)) _classPrivateFieldSet2(_href, this, `${_classPrivateFieldGet2(_protocol, this) || "http:"}//${_classPrivateFieldGet2(_host, this) || "localhost"}${_classPrivateFieldGet2(_pathname, this) || "/"}${_classPrivateFieldGet2(_search, this) || ""}`);
			return _classPrivateFieldGet2(_href, this);
		}
		get pathname() {
			if (_classPrivateFieldGet2(_url, this)) return _classPrivateFieldGet2(_url, this).pathname;
			if (_classPrivateFieldGet2(_pathname, this) === void 0) {
				const [, pathnameIndex, queryIndex] = _assertClassBrand(_URL_brand, this, _getPos).call(this);
				if (pathnameIndex === -1) return this._url.pathname;
				_classPrivateFieldSet2(_pathname, this, this.href.slice(pathnameIndex, queryIndex === -1 ? void 0 : queryIndex));
			}
			return _classPrivateFieldGet2(_pathname, this);
		}
		get search() {
			if (_classPrivateFieldGet2(_url, this)) return _classPrivateFieldGet2(_url, this).search;
			if (_classPrivateFieldGet2(_search, this) === void 0) {
				const [, pathnameIndex, queryIndex] = _assertClassBrand(_URL_brand, this, _getPos).call(this);
				if (pathnameIndex === -1) return this._url.search;
				const url = this.href;
				_classPrivateFieldSet2(_search, this, queryIndex === -1 || queryIndex === url.length - 1 ? "" : url.slice(queryIndex));
			}
			return _classPrivateFieldGet2(_search, this);
		}
		get searchParams() {
			if (_classPrivateFieldGet2(_url, this)) return _classPrivateFieldGet2(_url, this).searchParams;
			if (!_classPrivateFieldGet2(_searchParams, this)) _classPrivateFieldSet2(_searchParams, this, new URLSearchParams(this.search));
			return _classPrivateFieldGet2(_searchParams, this);
		}
		get protocol() {
			if (_classPrivateFieldGet2(_url, this)) return _classPrivateFieldGet2(_url, this).protocol;
			if (_classPrivateFieldGet2(_protocol, this) === void 0) {
				const [protocolIndex] = _assertClassBrand(_URL_brand, this, _getPos).call(this);
				if (protocolIndex === -1) return this._url.protocol;
				const url = this.href;
				_classPrivateFieldSet2(_protocol, this, url.slice(0, protocolIndex + 1));
			}
			return _classPrivateFieldGet2(_protocol, this);
		}
		toString() {
			return this.href;
		}
		toJSON() {
			return this.href;
		}
	});
	function _getPos() {
		if (!_classPrivateFieldGet2(_pos, this)) {
			const url = this.href;
			const protoIndex = url.indexOf("://");
			const pathnameIndex = protoIndex === -1 ? -1 : url.indexOf("/", protoIndex + 4);
			const qIndex = pathnameIndex === -1 ? -1 : url.indexOf("?", pathnameIndex);
			_classPrivateFieldSet2(_pos, this, [
				protoIndex,
				pathnameIndex,
				qIndex
			]);
		}
		return _classPrivateFieldGet2(_pos, this);
	}
	lazyInherit(FastURL.prototype, NativeURL.prototype, "_url");
	Object.setPrototypeOf(FastURL.prototype, NativeURL.prototype);
	Object.setPrototypeOf(FastURL, NativeURL);
	return FastURL;
})();
//#endregion
//#region node_modules/srvx/dist/_chunks/_utils2.mjs
function resolvePortAndHost(opts) {
	var _ref, _opts$port, _globalThis$process, _opts$hostname, _globalThis$process2;
	const _port = (_ref = (_opts$port = opts.port) !== null && _opts$port !== void 0 ? _opts$port : (_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 ? void 0 : _globalThis$process.env.PORT) !== null && _ref !== void 0 ? _ref : 3e3;
	const port = typeof _port === "number" ? _port : Number.parseInt(_port, 10);
	if (port < 0 || port > 65535) throw new RangeError(`Port must be between 0 and 65535 (got "${port}").`);
	return {
		port,
		hostname: (_opts$hostname = opts.hostname) !== null && _opts$hostname !== void 0 ? _opts$hostname : (_globalThis$process2 = globalThis.process) === null || _globalThis$process2 === void 0 ? void 0 : _globalThis$process2.env.HOST
	};
}
function fmtURL(host, port, secure) {
	if (!host || !port) return;
	if (host.includes(":")) host = `[${host}]`;
	return `http${secure ? "s" : ""}://${host}:${port}/`;
}
function printListening(opts, url) {
	var _opts$silent, _globalThis$process3, _globalThis$process$s;
	if (!url || ((_opts$silent = opts.silent) !== null && _opts$silent !== void 0 ? _opts$silent : (_globalThis$process3 = globalThis.process) === null || _globalThis$process3 === void 0 || (_globalThis$process3 = _globalThis$process3.env) === null || _globalThis$process3 === void 0 ? void 0 : _globalThis$process3.TEST)) return;
	let additionalInfo = "";
	try {
		const _url = new URL(url);
		if (_url.hostname === "[::]" || _url.hostname === "0.0.0.0") {
			_url.hostname = "localhost";
			url = _url.href;
			additionalInfo = " (all interfaces)";
		}
	} catch {}
	let listeningOn = `➜ Listening on:`;
	if ((_globalThis$process$s = globalThis.process.stdout) === null || _globalThis$process$s === void 0 ? void 0 : _globalThis$process$s.isTTY) {
		listeningOn = `\u001B[32m${listeningOn}\u001B[0m`;
		url = `\u001B[36m${url}\u001B[0m`;
		additionalInfo = `\u001B[2m${additionalInfo}\u001B[0m`;
	}
	console.log(`${listeningOn} ${url}${additionalInfo}`);
}
function resolveTLSOptions(opts) {
	if (!opts.tls || opts.protocol === "http") return;
	const cert = resolveCertOrKey(opts.tls.cert);
	const key = resolveCertOrKey(opts.tls.key);
	if (!cert && !key) {
		if (opts.protocol === "https") throw new TypeError("TLS `cert` and `key` must be provided for `https` protocol.");
		return;
	}
	if (!cert || !key) throw new TypeError("TLS `cert` and `key` must be provided together.");
	return {
		cert,
		key,
		passphrase: opts.tls.passphrase
	};
}
function resolveCertOrKey(value) {
	if (!value) return;
	if (typeof value !== "string") throw new TypeError("TLS certificate and key must be strings in PEM format or file paths.");
	if (value.startsWith("-----BEGIN ")) return value;
	const { readFileSync } = process.getBuiltinModule("node:fs");
	return readFileSync(value, "utf8");
}
function createWaitUntil() {
	const promises = /* @__PURE__ */ new Set();
	return {
		waitUntil: (promise) => {
			if (typeof (promise === null || promise === void 0 ? void 0 : promise.then) !== "function") return;
			promises.add(Promise.resolve(promise).catch(console.error).finally(() => {
				promises.delete(promise);
			}));
		},
		wait: () => {
			return Promise.all(promises);
		}
	};
}
//#endregion
//#region node_modules/srvx/dist/_chunks/_utils.mjs
var noColor = /* @__PURE__ */ (() => {
	var _globalThis$process$e, _globalThis$process;
	const env = (_globalThis$process$e = (_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 ? void 0 : _globalThis$process.env) !== null && _globalThis$process$e !== void 0 ? _globalThis$process$e : {};
	return env.NO_COLOR === "1" || env.TERM === "dumb";
})();
var _c = (c, r = 39) => (t) => noColor ? t : `\u001B[${c}m${t}\u001B[${r}m`;
var bold = /* @__PURE__ */ _c(1, 22);
var red = /* @__PURE__ */ _c(31);
var green = /* @__PURE__ */ _c(32);
var gray = /* @__PURE__ */ _c(90);
//#endregion
//#region node_modules/srvx/dist/_chunks/_plugins.mjs
function wrapFetch(server) {
	const fetchHandler = server.options.fetch;
	const middleware = server.options.middleware || [];
	return middleware.length === 0 ? fetchHandler : (request) => callMiddleware$1(request, fetchHandler, middleware, 0);
}
function callMiddleware$1(request, fetchHandler, middleware, index) {
	if (index === middleware.length) return fetchHandler(request);
	return middleware[index](request, () => callMiddleware$1(request, fetchHandler, middleware, index + 1));
}
var errorPlugin = (server) => {
	const errorHandler = server.options.error;
	if (!errorHandler) return;
	server.options.middleware.unshift((_req, next) => {
		try {
			const res = next();
			return res instanceof Promise ? res.catch((error) => errorHandler(error)) : res;
		} catch (error) {
			return errorHandler(error);
		}
	});
};
var gracefulShutdownPlugin = (server) => {
	var _server$options, _globalThis$process;
	const config = (_server$options = server.options) === null || _server$options === void 0 ? void 0 : _server$options.gracefulShutdown;
	if (!((_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 ? void 0 : _globalThis$process.on) || config === false || config === void 0 && (process.env.CI || process.env.TEST)) return;
	const gracefulTimeout = config === true || !(config === null || config === void 0 ? void 0 : config.gracefulTimeout) ? Number.parseInt(process.env.SERVER_SHUTDOWN_TIMEOUT || "") || 5 : config.gracefulTimeout;
	let isClosing = false;
	let isClosed = false;
	const w = server.options.silent ? () => {} : process.stderr.write.bind(process.stderr);
	const forceClose = async () => {
		if (isClosed) return;
		w(red("\x1B[2K\rForcibly closing connections...\n"));
		isClosed = true;
		await server.close(true);
	};
	const shutdown = async () => {
		if (isClosing || isClosed) return;
		setTimeout(() => {
			globalThis.process.once("SIGINT", forceClose);
		}, 100);
		isClosing = true;
		const closePromise = server.close();
		for (let remaining = gracefulTimeout; remaining > 0; remaining--) {
			w(gray(`\rStopping server gracefully (${remaining}s)... Press ${bold("Ctrl+C")} again to force close.`));
			if (await Promise.race([closePromise.then(() => true), new Promise((r) => setTimeout(() => r(false), 1e3))])) {
				w("\x1B[2K\r" + green("Server closed successfully.\n"));
				isClosed = true;
				return;
			}
		}
		w("\x1B[2K\rGraceful shutdown timed out.\n");
		await forceClose();
	};
	for (const sig of ["SIGINT", "SIGTERM"]) globalThis.process.on(sig, shutdown);
};
//#endregion
//#region node_modules/srvx/dist/_chunks/_trust-proxy.mjs
function isTrustedProxy(trustProxy, remoteAddress) {
	if (trustProxy === void 0 || trustProxy === false) return false;
	if (trustProxy === true) return true;
	if (trustProxy === "loopback") return isLoopbackAddress(remoteAddress);
	if (remoteAddress === void 0) return false;
	if (trustProxy.includes(remoteAddress)) return true;
	const mapped = ipv4FromMapped(remoteAddress);
	return mapped !== void 0 && trustProxy.includes(mapped);
}
function ipv4FromMapped(address) {
	return address.startsWith("::ffff:") && address.includes(".") ? address.slice(7) : void 0;
}
function isLoopbackAddress(address) {
	return !!address && (address === "::1" || address.startsWith("127.") || address.startsWith("::ffff:127."));
}
var HOST_RE = /^(\[(?:[A-Fa-f0-9:.]+)\]|(?:[A-Za-z0-9_-]+\.)*[A-Za-z0-9_-]+|(?:\d{1,3}\.){3}\d{1,3})(:\d{1,5})?$/;
function firstForwardedValue(value) {
	if (!value) return;
	return (Array.isArray(value) ? value[0] : value).split(",")[0].trim() || void 0;
}
//#endregion
//#region node_modules/srvx/dist/_chunks/_body-limit.mjs
function createBodyTooLargeError(maxRequestBodySize) {
	return Object.assign(/* @__PURE__ */ new Error(`Request body exceeds the maximum allowed size of ${maxRequestBodySize} bytes.`), {
		code: "ERR_BODY_TOO_LARGE",
		statusCode: 413,
		status: 413
	});
}
function limitBodyStream(stream, maxRequestBodySize) {
	const reader = stream.getReader();
	let size = 0;
	return new ReadableStream({
		async pull(controller) {
			const { done, value } = await reader.read();
			if (done) {
				controller.close();
				return;
			}
			size += value.byteLength;
			if (size > maxRequestBodySize) {
				const error = createBodyTooLargeError(maxRequestBodySize);
				reader.cancel(error).catch(() => {});
				controller.error(error);
				return;
			}
			controller.enqueue(value);
		},
		cancel(reason) {
			return reader.cancel(reason);
		}
	});
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.153.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
var _isSecure;
var _listeningPromise;
var _listenError;
var _wait;
function sendNodeResponseDetached(nodeRes, webRes) {
	try {
		return _sendNodeResponse(nodeRes, webRes, true);
	} catch (error) {
		handleSendError(nodeRes, error);
	}
}
function handleSendError(nodeRes, _error) {
	if (nodeRes.headersSent) nodeRes.destroy();
	else {
		nodeRes.statusCode = 500;
		nodeRes.end();
	}
}
function _sendNodeResponse(nodeRes, webRes, detached) {
	if (!webRes) {
		nodeRes.statusCode = 500;
		return endNodeResponse(nodeRes, detached);
	}
	if (webRes._toNodeResponse) {
		const res = webRes._toNodeResponse();
		if (res.body) {
			var _res$body;
			if (res.body instanceof ReadableStream) {
				writeHead(nodeRes, res.status, res.statusText, res.headers);
				return streamBody(res.body, nodeRes);
			} else if (typeof ((_res$body = res.body) === null || _res$body === void 0 ? void 0 : _res$body.pipe) === "function") return pipeBody(res.body, nodeRes, res.status, res.statusText, res.headers);
			writeHead(nodeRes, res.status, res.statusText, res.headers);
			nodeRes.write(res.body);
		} else writeHead(nodeRes, res.status, res.statusText, res.headers);
		return endNodeResponse(nodeRes, detached);
	}
	const rawHeaders = [];
	for (const [key, value] of webRes.headers) rawHeaders.push(key, value);
	writeHead(nodeRes, webRes.status, webRes.statusText, rawHeaders);
	return webRes.body ? streamBody(webRes.body, nodeRes) : endNodeResponse(nodeRes, detached);
}
function writeHead(nodeRes, status, statusText, rawHeaders) {
	var _nodeRes$req;
	if (!nodeRes.headersSent) if (((_nodeRes$req = nodeRes.req) === null || _nodeRes$req === void 0 ? void 0 : _nodeRes$req.httpVersion) === "2.0") nodeRes.writeHead(status, rawHeaders);
	else nodeRes.writeHead(status, statusText, rawHeaders);
}
function endNodeResponse(nodeRes, detached) {
	if (detached) {
		nodeRes.end();
		return;
	}
	return new Promise((resolve) => nodeRes.end(resolve));
}
function pipeBody(stream, nodeRes, status, statusText, headers) {
	if (nodeRes.destroyed) {
		var _stream$destroy;
		(_stream$destroy = stream.destroy) === null || _stream$destroy === void 0 || _stream$destroy.call(stream);
		return;
	}
	if (typeof stream.on !== "function" || typeof stream.destroy !== "function") {
		writeHead(nodeRes, status, statusText, headers);
		stream.pipe(nodeRes);
		return new Promise((resolve) => nodeRes.on("close", resolve));
	}
	if (stream.destroyed) {
		writeHead(nodeRes, 500, "Internal Server Error", []);
		return endNodeResponse(nodeRes);
	}
	return new Promise((resolve) => {
		function onEarlyError() {
			stream.off("readable", onReadable);
			stream.destroy();
			writeHead(nodeRes, 500, "Internal Server Error", []);
			endNodeResponse(nodeRes).then(resolve);
		}
		function onReadable() {
			stream.off("error", onEarlyError);
			if (nodeRes.destroyed) {
				stream.destroy();
				return resolve();
			}
			writeHead(nodeRes, status, statusText, headers);
			pipeline(stream, nodeRes).catch(() => {}).then(() => resolve());
		}
		stream.once("error", onEarlyError);
		stream.once("readable", onReadable);
	});
}
function streamBody(stream, nodeRes) {
	if (nodeRes.destroyed) {
		stream.cancel();
		return;
	}
	const reader = stream.getReader();
	function streamCancel(error) {
		reader.cancel(error).catch(() => {});
		if (error) nodeRes.destroy(error);
	}
	function streamHandle({ done, value }) {
		try {
			if (done) nodeRes.end();
			else if (nodeRes.write(value)) reader.read().then(streamHandle, streamCancel);
			else nodeRes.once("drain", () => reader.read().then(streamHandle, streamCancel));
		} catch (error) {
			streamCancel(error instanceof Error ? error : void 0);
		}
	}
	nodeRes.on("close", streamCancel);
	nodeRes.on("error", streamCancel);
	reader.read().then(streamHandle, streamCancel);
	return reader.closed.catch(streamCancel).finally(() => {
		nodeRes.off("close", streamCancel);
		nodeRes.off("error", streamCancel);
	});
}
var NodeRequestURL = class extends FastURL {
	constructor({ req, trusted = false }) {
		var _req$socket, _req$socket2;
		const path = req.url || "/";
		const forwardedHost = trusted ? firstForwardedValue(req.headers["x-forwarded-host"]) : void 0;
		let host = (forwardedHost && HOST_RE.test(forwardedHost) ? forwardedHost : void 0) || req.headers.host || req.headers[":authority"];
		if (host && !HOST_RE.test(host)) host = "_invalid_";
		else if (!host) if (req.socket) host = `${req.socket.localFamily === "IPv6" ? "[" + req.socket.localAddress + "]" : req.socket.localAddress}:${((_req$socket = req.socket) === null || _req$socket === void 0 ? void 0 : _req$socket.localPort) || "80"}`;
		else host = "localhost";
		const forwardedProto = trusted ? firstForwardedValue(req.headers["x-forwarded-proto"]) : void 0;
		const protocol = ((_req$socket2 = req.socket) === null || _req$socket2 === void 0 ? void 0 : _req$socket2.encrypted) || forwardedProto === "https" || trusted && req.headers[":scheme"] === "https" ? "https:" : "http:";
		if (path[0] === "/") {
			const qIndex = path.indexOf("?");
			super({
				protocol,
				host,
				pathname: qIndex === -1 ? path : path.slice(0, qIndex) || "/",
				search: qIndex === -1 ? "" : path.slice(qIndex) || ""
			});
		} else if (path === "*") super({
			protocol,
			host,
			pathname: "/*",
			search: ""
		});
		else super(path);
	}
};
var _nonJoinedHeaders = /* @__PURE__ */ new Set([
	"age",
	"authorization",
	"content-length",
	"content-type",
	"etag",
	"expires",
	"from",
	"host",
	"if-modified-since",
	"if-unmodified-since",
	"last-modified",
	"location",
	"max-forwards",
	"proxy-authorization",
	"referer",
	"retry-after",
	"server",
	"user-agent"
]);
var _validHeaderNameRE = /^[!#$%&'*+\-.^_`|~\dA-Za-z]+$/;
function _isRepeated(rawHeaders, lowerName) {
	let seen = false;
	for (let i = 0; i < rawHeaders.length; i += 2) {
		const key = rawHeaders[i];
		if (key.length === lowerName.length && key.toLowerCase() === lowerName) {
			if (seen) return true;
			seen = true;
		}
	}
	return false;
}
var NodeRequestHeaders = /* @__PURE__ */ (() => {
	let _Symbol$hasInstance, _Symbol$iterator;
	const NativeHeaders = globalThis.Headers;
	var _req = /* @__PURE__ */ new WeakMap();
	var _headers2 = /* @__PURE__ */ new WeakMap();
	_Symbol$hasInstance = Symbol.hasInstance;
	_Symbol$iterator = Symbol.iterator;
	class Headers {
		constructor(req) {
			_classPrivateFieldInitSpec(this, _req, void 0);
			_classPrivateFieldInitSpec(this, _headers2, void 0);
			_classPrivateFieldSet2(_req, this, req);
		}
		static [_Symbol$hasInstance](val) {
			return val instanceof NativeHeaders;
		}
		get _headers() {
			if (!_classPrivateFieldGet2(_headers2, this)) {
				const headers = new NativeHeaders();
				const rawHeaders = _classPrivateFieldGet2(_req, this).rawHeaders;
				const len = rawHeaders.length;
				for (let i = 0; i < len; i += 2) {
					const key = rawHeaders[i];
					if (key.charCodeAt(0) === 58) continue;
					const value = rawHeaders[i + 1];
					headers.append(key, value);
				}
				_classPrivateFieldSet2(_headers2, this, headers);
			}
			return _classPrivateFieldGet2(_headers2, this);
		}
		get(name) {
			if (_classPrivateFieldGet2(_headers2, this)) return _classPrivateFieldGet2(_headers2, this).get(name);
			const lower = name.toLowerCase();
			if (lower.charCodeAt(0) === 58) return this._headers.get(name);
			const value = _classPrivateFieldGet2(_req, this).headers[lower];
			if (typeof value === "string") return _nonJoinedHeaders.has(lower) && _isRepeated(_classPrivateFieldGet2(_req, this).rawHeaders, lower) ? this._headers.get(name) : value;
			if (Array.isArray(value)) return value.join(", ");
			return lower !== "__proto__" && _validHeaderNameRE.test(name) ? null : this._headers.get(name);
		}
		has(name) {
			if (_classPrivateFieldGet2(_headers2, this)) return _classPrivateFieldGet2(_headers2, this).has(name);
			const lower = name.toLowerCase();
			if (lower.charCodeAt(0) === 58) return this._headers.has(name);
			if (Object.hasOwn(_classPrivateFieldGet2(_req, this).headers, lower)) return true;
			return lower !== "__proto__" && _validHeaderNameRE.test(name) ? false : this._headers.has(name);
		}
		getSetCookie() {
			if (_classPrivateFieldGet2(_headers2, this)) return _classPrivateFieldGet2(_headers2, this).getSetCookie();
			const value = _classPrivateFieldGet2(_req, this).headers["set-cookie"];
			return Array.isArray(value) ? value.slice() : value ? [value] : [];
		}
		entries() {
			return this._headers.entries();
		}
		[_Symbol$iterator]() {
			return this.entries();
		}
	}
	lazyInherit(Headers.prototype, NativeHeaders.prototype, "_headers");
	Object.setPrototypeOf(Headers, NativeHeaders);
	Object.setPrototypeOf(Headers.prototype, NativeHeaders.prototype);
	return Headers;
})();
var kNativeRequest = /* @__PURE__ */ Symbol.for("srvx.nativeRequest");
var NodeRequest = /* @__PURE__ */ (() => {
	let _Symbol$hasInstance2;
	const NativeRequest = getNativeRequest();
	var _req2 = /* @__PURE__ */ new WeakMap();
	var _url = /* @__PURE__ */ new WeakMap();
	var _bodyStream = /* @__PURE__ */ new WeakMap();
	var _request = /* @__PURE__ */ new WeakMap();
	var _headers3 = /* @__PURE__ */ new WeakMap();
	var _abortController = /* @__PURE__ */ new WeakMap();
	var _maxRequestBodySize = /* @__PURE__ */ new WeakMap();
	var _trustProxy = /* @__PURE__ */ new WeakMap();
	var _ip = /* @__PURE__ */ new WeakMap();
	var _ipResolved = /* @__PURE__ */ new WeakMap();
	var _remoteAddress = /* @__PURE__ */ new WeakMap();
	var _trusted = /* @__PURE__ */ new WeakMap();
	var _Request_brand = /* @__PURE__ */ new WeakSet();
	_Symbol$hasInstance2 = Symbol.hasInstance;
	class Request {
		constructor(ctx) {
			_classPrivateMethodInitSpec(this, _Request_brand);
			_defineProperty(this, "runtime", void 0);
			_defineProperty(this, "waitUntil", void 0);
			_classPrivateFieldInitSpec(this, _req2, void 0);
			_classPrivateFieldInitSpec(this, _url, void 0);
			_classPrivateFieldInitSpec(this, _bodyStream, void 0);
			_classPrivateFieldInitSpec(this, _request, void 0);
			_classPrivateFieldInitSpec(this, _headers3, void 0);
			_classPrivateFieldInitSpec(this, _abortController, void 0);
			_classPrivateFieldInitSpec(this, _maxRequestBodySize, void 0);
			_classPrivateFieldInitSpec(this, _trustProxy, void 0);
			_classPrivateFieldInitSpec(this, _ip, void 0);
			_classPrivateFieldInitSpec(this, _ipResolved, false);
			_classPrivateFieldInitSpec(this, _remoteAddress, void 0);
			_classPrivateFieldInitSpec(this, _trusted, void 0);
			_classPrivateFieldSet2(_req2, this, ctx.req);
			_classPrivateFieldSet2(_maxRequestBodySize, this, ctx.maxRequestBodySize);
			_classPrivateFieldSet2(_trustProxy, this, ctx.trustProxy);
			this.runtime = {
				name: "node",
				node: ctx
			};
		}
		static [_Symbol$hasInstance2](val) {
			return val instanceof NativeRequest;
		}
		get ip() {
			if (_classPrivateFieldGet2(_ipResolved, this)) return _classPrivateFieldGet2(_ip, this);
			_classPrivateFieldSet2(_ipResolved, this, true);
			if (_assertClassBrand(_Request_brand, this, _resolveTrusted).call(this)) {
				const forwarded = firstForwardedValue(_classPrivateFieldGet2(_req2, this).headers["x-forwarded-for"]);
				if (forwarded) return _classPrivateFieldSet2(_ip, this, forwarded);
			}
			return _classPrivateFieldSet2(_ip, this, _classPrivateFieldGet2(_remoteAddress, this));
		}
		get method() {
			if (_classPrivateFieldGet2(_request, this)) return _classPrivateFieldGet2(_request, this).method;
			return _classPrivateFieldGet2(_req2, this).method || "GET";
		}
		get _url() {
			return _classPrivateFieldGet2(_url, this) || _classPrivateFieldSet2(_url, this, new NodeRequestURL({
				req: _classPrivateFieldGet2(_req2, this),
				trusted: _assertClassBrand(_Request_brand, this, _resolveTrusted).call(this)
			}));
		}
		set _url(url) {
			_classPrivateFieldSet2(_url, this, url);
		}
		get url() {
			if (_classPrivateFieldGet2(_request, this)) return _classPrivateFieldGet2(_request, this).url;
			return this._url.href;
		}
		get headers() {
			if (_classPrivateFieldGet2(_request, this)) return _classPrivateFieldGet2(_request, this).headers;
			return _classPrivateFieldGet2(_headers3, this) || _classPrivateFieldSet2(_headers3, this, new NodeRequestHeaders(_classPrivateFieldGet2(_req2, this)));
		}
		get _abortController() {
			if (!_classPrivateFieldGet2(_abortController, this)) {
				_classPrivateFieldSet2(_abortController, this, new AbortController());
				const { req, res } = this.runtime.node;
				const abortController = _classPrivateFieldGet2(_abortController, this);
				const abort = (err) => {
					var _abortController$abor;
					return (_abortController$abor = abortController.abort) === null || _abortController$abor === void 0 ? void 0 : _abortController$abor.call(abortController, err);
				};
				if (res) res.once("close", () => {
					const reqError = req.errored;
					if (reqError) abort(reqError);
					else if (!res.writableEnded) abort();
				});
				else req.once("close", () => {
					if (!req.complete) abort();
				});
			}
			return _classPrivateFieldGet2(_abortController, this);
		}
		get signal() {
			return _classPrivateFieldGet2(_request, this) ? _classPrivateFieldGet2(_request, this).signal : this._abortController.signal;
		}
		get body() {
			if (_classPrivateFieldGet2(_request, this)) return _classPrivateFieldGet2(_request, this).body;
			if (_classPrivateFieldGet2(_bodyStream, this) === void 0) {
				const method = this.method;
				let stream = !(method === "GET" || method === "HEAD") ? Readable.toWeb(_classPrivateFieldGet2(_req2, this)) : null;
				if (stream && _classPrivateFieldGet2(_maxRequestBodySize, this) !== void 0) stream = limitBodyStream(stream, _classPrivateFieldGet2(_maxRequestBodySize, this));
				_classPrivateFieldSet2(_bodyStream, this, stream);
			}
			return _classPrivateFieldGet2(_bodyStream, this);
		}
		text() {
			if (_classPrivateFieldGet2(_request, this)) return _classPrivateFieldGet2(_request, this).text();
			if (_classPrivateFieldGet2(_bodyStream, this) !== void 0) return _classPrivateFieldGet2(_bodyStream, this) ? new Response(_classPrivateFieldGet2(_bodyStream, this)).text() : Promise.resolve("");
			return _assertClassBrand(_Request_brand, this, _readBuffered).call(this).then((buf) => buf.toString());
		}
		json() {
			if (_classPrivateFieldGet2(_request, this)) return _classPrivateFieldGet2(_request, this).json();
			if (_classPrivateFieldGet2(_bodyStream, this) !== void 0) return this.text().then((text) => JSON.parse(text));
			return _assertClassBrand(_Request_brand, this, _readBuffered).call(this).then((buf) => JSON.parse(buf.toString()));
		}
		get _request() {
			if (!_classPrivateFieldGet2(_request, this)) {
				const body = this.body;
				_classPrivateFieldSet2(_request, this, new NativeRequest(this.url, {
					method: this.method,
					headers: this.headers,
					signal: this._abortController.signal,
					body,
					duplex: body ? "half" : void 0
				}));
				_classPrivateFieldSet2(_headers3, this, void 0);
				_classPrivateFieldSet2(_bodyStream, this, void 0);
			}
			return _classPrivateFieldGet2(_request, this);
		}
	}
	function _resolveTrusted() {
		if (_classPrivateFieldGet2(_trusted, this) === void 0) {
			var _classPrivateFieldGet2$2;
			_classPrivateFieldSet2(_remoteAddress, this, (_classPrivateFieldGet2$2 = _classPrivateFieldGet2(_req2, this).socket) === null || _classPrivateFieldGet2$2 === void 0 ? void 0 : _classPrivateFieldGet2$2.remoteAddress);
			_classPrivateFieldSet2(_trusted, this, isTrustedProxy(_classPrivateFieldGet2(_trustProxy, this), _classPrivateFieldGet2(_remoteAddress, this)));
		}
		return _classPrivateFieldGet2(_trusted, this);
	}
	function _readBuffered() {
		return readBody(_classPrivateFieldGet2(_req2, this), _classPrivateFieldGet2(_maxRequestBodySize, this));
	}
	lazyInherit(Request.prototype, NativeRequest.prototype, "_request");
	Object.setPrototypeOf(Request.prototype, NativeRequest.prototype);
	return Request;
})();
function readBody(req, maxRequestBodySize) {
	if ("rawBody" in req && Buffer.isBuffer(req.rawBody)) {
		if (maxRequestBodySize !== void 0 && req.rawBody.length > maxRequestBodySize) return Promise.reject(createBodyTooLargeError(maxRequestBodySize));
		return Promise.resolve(req.rawBody);
	}
	return new Promise((resolve, reject) => {
		const chunks = [];
		let size = 0;
		const cleanup = () => {
			req.off("data", onData);
			req.off("end", onEnd);
			req.off("error", onError);
		};
		const onData = (chunk) => {
			if (maxRequestBodySize !== void 0) {
				size += chunk.length;
				if (size > maxRequestBodySize) {
					var _req$pause;
					cleanup();
					(_req$pause = req.pause) === null || _req$pause === void 0 || _req$pause.call(req);
					reject(createBodyTooLargeError(maxRequestBodySize));
					return;
				}
			}
			chunks.push(chunk);
		};
		const onError = (err) => {
			cleanup();
			reject(err);
		};
		const onEnd = () => {
			cleanup();
			resolve(chunks.length === 1 ? chunks[0] : Buffer.concat(chunks));
		};
		req.on("data", onData).once("end", onEnd).once("error", onError);
	});
}
function getNativeRequest() {
	var _globalThis, _globalThis$kNativeRe;
	let R = globalThis[kNativeRequest] || globalThis.Request;
	while (R === null || R === void 0 ? void 0 : R._srvx) R = Object.getPrototypeOf(R);
	return (_globalThis$kNativeRe = (_globalThis = globalThis)[kNativeRequest]) !== null && _globalThis$kNativeRe !== void 0 ? _globalThis$kNativeRe : _globalThis[kNativeRequest] = R;
}
var NodeResponse = /* @__PURE__ */ (() => {
	var _globalThis$process, _globalThis$process$g;
	let _Symbol$hasInstance4;
	const NativeResponse = globalThis.Response;
	const STATUS_CODES = ((_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 || (_globalThis$process$g = _globalThis$process.getBuiltinModule) === null || _globalThis$process$g === void 0 || (_globalThis$process$g = _globalThis$process$g.call(_globalThis$process, "node:http")) === null || _globalThis$process$g === void 0 ? void 0 : _globalThis$process$g.STATUS_CODES) || {};
	var _body = /* @__PURE__ */ new WeakMap();
	var _init = /* @__PURE__ */ new WeakMap();
	var _headers4 = /* @__PURE__ */ new WeakMap();
	var _response = /* @__PURE__ */ new WeakMap();
	_Symbol$hasInstance4 = Symbol.hasInstance;
	class NodeResponse {
		constructor(body, init) {
			_classPrivateFieldInitSpec(this, _body, void 0);
			_classPrivateFieldInitSpec(this, _init, void 0);
			_classPrivateFieldInitSpec(this, _headers4, void 0);
			_classPrivateFieldInitSpec(this, _response, void 0);
			_classPrivateFieldSet2(_body, this, body);
			_classPrivateFieldSet2(_init, this, init);
		}
		static [_Symbol$hasInstance4](val) {
			return val instanceof NativeResponse;
		}
		get status() {
			var _classPrivateFieldGet3, _classPrivateFieldGet4;
			return ((_classPrivateFieldGet3 = _classPrivateFieldGet2(_response, this)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.status) || ((_classPrivateFieldGet4 = _classPrivateFieldGet2(_init, this)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.status) || 200;
		}
		get statusText() {
			var _classPrivateFieldGet5, _classPrivateFieldGet6;
			return ((_classPrivateFieldGet5 = _classPrivateFieldGet2(_response, this)) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.statusText) || ((_classPrivateFieldGet6 = _classPrivateFieldGet2(_init, this)) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.statusText) || STATUS_CODES[this.status] || "";
		}
		get headers() {
			var _classPrivateFieldGet7;
			if (_classPrivateFieldGet2(_response, this)) return _classPrivateFieldGet2(_response, this).headers;
			if (_classPrivateFieldGet2(_headers4, this)) return _classPrivateFieldGet2(_headers4, this);
			const initHeaders = (_classPrivateFieldGet7 = _classPrivateFieldGet2(_init, this)) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.headers;
			return _classPrivateFieldSet2(_headers4, this, initHeaders instanceof Headers ? initHeaders : new Headers(initHeaders));
		}
		get ok() {
			if (_classPrivateFieldGet2(_response, this)) return _classPrivateFieldGet2(_response, this).ok;
			const status = this.status;
			return status >= 200 && status < 300;
		}
		get _response() {
			if (_classPrivateFieldGet2(_response, this)) return _classPrivateFieldGet2(_response, this);
			let body = _classPrivateFieldGet2(_body, this);
			if (body && typeof body.pipe === "function" && !(body instanceof Readable)) {
				const stream = new PassThrough();
				body.pipe(stream);
				const abort = body.abort;
				if (abort) stream.once("close", () => abort());
				body = stream;
			}
			_classPrivateFieldSet2(_response, this, new NativeResponse(body, _classPrivateFieldGet2(_headers4, this) ? {
				..._classPrivateFieldGet2(_init, this),
				headers: _classPrivateFieldGet2(_headers4, this)
			} : _classPrivateFieldGet2(_init, this)));
			_classPrivateFieldSet2(_init, this, void 0);
			_classPrivateFieldSet2(_headers4, this, void 0);
			_classPrivateFieldSet2(_body, this, void 0);
			return _classPrivateFieldGet2(_response, this);
		}
		_toNodeResponse() {
			var _classPrivateFieldGet8, _classPrivateFieldGet9;
			const status = this.status;
			const statusText = this.statusText;
			let body;
			let contentType;
			let contentLength;
			if (_classPrivateFieldGet2(_response, this)) body = _classPrivateFieldGet2(_response, this).body;
			else if (_classPrivateFieldGet2(_body, this)) if (_classPrivateFieldGet2(_body, this) instanceof ReadableStream) body = _classPrivateFieldGet2(_body, this);
			else if (typeof _classPrivateFieldGet2(_body, this) === "string") {
				body = _classPrivateFieldGet2(_body, this);
				contentType = "text/plain; charset=UTF-8";
				contentLength = Buffer.byteLength(_classPrivateFieldGet2(_body, this));
			} else if (_classPrivateFieldGet2(_body, this) instanceof ArrayBuffer) {
				body = Buffer.from(_classPrivateFieldGet2(_body, this));
				contentLength = _classPrivateFieldGet2(_body, this).byteLength;
			} else if (_classPrivateFieldGet2(_body, this) instanceof Uint8Array) {
				body = _classPrivateFieldGet2(_body, this);
				contentLength = _classPrivateFieldGet2(_body, this).byteLength;
			} else if (_classPrivateFieldGet2(_body, this) instanceof DataView) {
				body = Buffer.from(_classPrivateFieldGet2(_body, this).buffer);
				contentLength = _classPrivateFieldGet2(_body, this).byteLength;
			} else if (_classPrivateFieldGet2(_body, this) instanceof Blob) {
				body = _classPrivateFieldGet2(_body, this).stream();
				contentType = _classPrivateFieldGet2(_body, this).type;
				contentLength = _classPrivateFieldGet2(_body, this).size;
			} else if (typeof _classPrivateFieldGet2(_body, this).pipe === "function") body = _classPrivateFieldGet2(_body, this);
			else body = this._response.body;
			const headers = [];
			const initHeaders = (_classPrivateFieldGet8 = _classPrivateFieldGet2(_init, this)) === null || _classPrivateFieldGet8 === void 0 ? void 0 : _classPrivateFieldGet8.headers;
			const headerEntries = ((_classPrivateFieldGet9 = _classPrivateFieldGet2(_response, this)) === null || _classPrivateFieldGet9 === void 0 ? void 0 : _classPrivateFieldGet9.headers) || _classPrivateFieldGet2(_headers4, this) || (initHeaders ? Array.isArray(initHeaders) ? initHeaders : (initHeaders === null || initHeaders === void 0 ? void 0 : initHeaders.entries) ? initHeaders.entries() : Object.entries(initHeaders) : void 0);
			let hasContentTypeHeader;
			let hasContentLength;
			if (headerEntries) for (const [key, value] of headerEntries) {
				const lowerKey = typeof key === "string" ? key.toLowerCase() : String(key);
				if (Array.isArray(value)) for (const v of value) headers.push(lowerKey, v);
				else headers.push(lowerKey, value);
				if (lowerKey === "content-type") hasContentTypeHeader = true;
				else if (lowerKey === "content-length") hasContentLength = true;
			}
			if (contentType && !hasContentTypeHeader) headers.push("content-type", contentType);
			if (contentLength && !hasContentLength) headers.push("content-length", String(contentLength));
			_classPrivateFieldSet2(_init, this, void 0);
			_classPrivateFieldSet2(_headers4, this, void 0);
			_classPrivateFieldSet2(_response, this, void 0);
			_classPrivateFieldSet2(_body, this, void 0);
			return {
				status,
				statusText,
				headers,
				body
			};
		}
	}
	lazyInherit(NodeResponse.prototype, NativeResponse.prototype, "_response");
	Object.setPrototypeOf(NodeResponse, NativeResponse);
	Object.setPrototypeOf(NodeResponse.prototype, NativeResponse.prototype);
	return NodeResponse;
})();
function serve(options) {
	return new NodeServer(options);
}
var NodeServer = (_isSecure = /* @__PURE__ */ new WeakMap(), _listeningPromise = /* @__PURE__ */ new WeakMap(), _listenError = /* @__PURE__ */ new WeakMap(), _wait = /* @__PURE__ */ new WeakMap(), class {
	constructor(options) {
		var _this$options$node$ht, _this$options$node;
		_defineProperty(this, "runtime", "node");
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "node", void 0);
		_defineProperty(this, "serveOptions", void 0);
		_defineProperty(this, "fetch", void 0);
		_defineProperty(this, "waitUntil", void 0);
		_classPrivateFieldInitSpec(this, _isSecure, void 0);
		_classPrivateFieldInitSpec(this, _listeningPromise, void 0);
		_classPrivateFieldInitSpec(this, _listenError, void 0);
		_classPrivateFieldInitSpec(this, _wait, void 0);
		this.options = {
			...options,
			middleware: [...options.middleware || []]
		};
		for (const plugin of options.plugins || []) plugin(this);
		errorPlugin(this);
		const fetchHandler = this.fetch = wrapFetch(this);
		const handler = (nodeReq, nodeRes) => {
			var _classPrivateFieldGet14;
			const reqUrl = nodeReq.url;
			if (reqUrl && reqUrl[0] !== "/" && reqUrl !== "*" && !URL.canParse(reqUrl)) {
				nodeRes.statusCode = 400;
				nodeRes.end();
				return;
			}
			const request = new NodeRequest({
				req: nodeReq,
				res: nodeRes,
				maxRequestBodySize: this.options.maxRequestBodySize,
				trustProxy: this.options.trustProxy
			});
			request.waitUntil = (_classPrivateFieldGet14 = _classPrivateFieldGet2(_wait, this)) === null || _classPrivateFieldGet14 === void 0 ? void 0 : _classPrivateFieldGet14.waitUntil;
			const res = fetchHandler(request);
			return res instanceof Promise ? res.then((resolvedRes) => sendNodeResponseDetached(nodeRes, resolvedRes)) : sendNodeResponseDetached(nodeRes, res);
		};
		this.node = {
			handler,
			server: void 0
		};
		const loader = globalThis.__srvxLoader__;
		if (loader) {
			loader({ server: this });
			return;
		}
		gracefulShutdownPlugin(this);
		_classPrivateFieldSet2(_wait, this, createWaitUntil());
		this.waitUntil = _classPrivateFieldGet2(_wait, this).waitUntil;
		const tls = resolveTLSOptions(this.options);
		const { port, hostname: host } = resolvePortAndHost(this.options);
		this.serveOptions = {
			port,
			host,
			exclusive: !this.options.reusePort,
			...tls,
			...this.options.node
		};
		let server;
		_classPrivateFieldSet2(_isSecure, this, !!this.serveOptions.cert && this.options.protocol !== "http");
		if ((_this$options$node$ht = (_this$options$node = this.options.node) === null || _this$options$node === void 0 ? void 0 : _this$options$node.http2) !== null && _this$options$node$ht !== void 0 ? _this$options$node$ht : _classPrivateFieldGet2(_isSecure, this)) if (_classPrivateFieldGet2(_isSecure, this)) server = nodeHTTP2.createSecureServer({
			allowHTTP1: true,
			...this.serveOptions
		}, handler);
		else throw new Error("node.http2 option requires tls certificate!");
		else if (_classPrivateFieldGet2(_isSecure, this)) server = nodeHTTPS.createServer(this.serveOptions, handler);
		else server = nodeHTTP.createServer(this.serveOptions, handler);
		this.node.server = server;
		if (!options.manual) this.serve().catch(() => {});
	}
	serve() {
		var _this$node;
		if (_classPrivateFieldGet2(_listeningPromise, this)) return _classPrivateFieldGet2(_listeningPromise, this).then(() => this);
		const server = (_this$node = this.node) === null || _this$node === void 0 ? void 0 : _this$node.server;
		if (!server) return Promise.reject(/* @__PURE__ */ new Error("Server not initialized"));
		_classPrivateFieldSet2(_listenError, this, void 0);
		_classPrivateFieldSet2(_listeningPromise, this, new Promise((resolve, reject) => {
			const onError = (error) => {
				server.off("listening", onListening);
				_classPrivateFieldSet2(_listenError, this, error);
				_classPrivateFieldSet2(_listeningPromise, this, void 0);
				reject(error);
			};
			const onListening = () => {
				server.off("error", onError);
				printListening(this.options, this.url);
				resolve();
			};
			server.once("error", onError);
			server.once("listening", onListening);
			server.listen(this.serveOptions);
		}));
		return _classPrivateFieldGet2(_listeningPromise, this).then(() => this);
	}
	get url() {
		var _this$node2;
		const addr = (_this$node2 = this.node) === null || _this$node2 === void 0 || (_this$node2 = _this$node2.server) === null || _this$node2 === void 0 ? void 0 : _this$node2.address();
		if (!addr) return;
		return typeof addr === "string" ? addr : fmtURL(addr.address, addr.port, _classPrivateFieldGet2(_isSecure, this));
	}
	ready() {
		if (_classPrivateFieldGet2(_listenError, this)) return Promise.reject(_classPrivateFieldGet2(_listenError, this));
		return Promise.resolve(_classPrivateFieldGet2(_listeningPromise, this)).then(() => this);
	}
	async close(closeAll) {
		var _classPrivateFieldGet15;
		await Promise.all([(_classPrivateFieldGet15 = _classPrivateFieldGet2(_wait, this)) === null || _classPrivateFieldGet15 === void 0 ? void 0 : _classPrivateFieldGet15.wait(), new Promise((resolve, reject) => {
			var _this$node3;
			const server = (_this$node3 = this.node) === null || _this$node3 === void 0 ? void 0 : _this$node3.server;
			if (server && closeAll && "closeAllConnections" in server) server.closeAllConnections();
			if (!server || !server.listening) return resolve();
			server.close((error) => error ? reject(error) : resolve());
		})]);
	}
});
//#endregion
//#region node_modules/h3/node_modules/rou3/dist/index.mjs
var NullProtoObj = /* @__PURE__ */ (() => {
	const e = function() {};
	return e.prototype = Object.create(null), Object.freeze(e.prototype), e;
})();
//#endregion
//#region node_modules/h3/dist/h3.mjs
var _Class;
var _headers;
var _init2;
var _Class2;
function decodePathname(pathname) {
	return decodeURI(pathname.includes("%25") ? pathname.replace(/%25/g, "%2525") : pathname);
}
var kEventNS = "h3.internal.event.";
var kEventRes = /* @__PURE__ */ Symbol.for(`${kEventNS}res`);
var kEventResHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.headers`);
var kEventResErrHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.err.headers`);
var H3Event = (_Class = class {
	constructor(req, context, app) {
		_defineProperty(this, "app", void 0);
		_defineProperty(this, "req", void 0);
		_defineProperty(this, "url", void 0);
		_defineProperty(this, "context", void 0);
		this.context = context || req.context || new NullProtoObj();
		this.req = req;
		this.app = app;
		const _url = req._url;
		const url = _url && _url instanceof URL ? _url : new FastURL(req.url);
		if (url.pathname.includes("%")) url.pathname = decodePathname(url.pathname);
		this.url = url;
	}
	get res() {
		return this[kEventRes] || (this[kEventRes] = new H3EventResponse());
	}
	get runtime() {
		return this.req.runtime;
	}
	waitUntil(promise) {
		var _this$req$waitUntil, _this$req;
		(_this$req$waitUntil = (_this$req = this.req).waitUntil) === null || _this$req$waitUntil === void 0 || _this$req$waitUntil.call(_this$req, promise);
	}
	toString() {
		return `[${this.req.method}] ${this.req.url}`;
	}
	toJSON() {
		return this.toString();
	}
	get node() {
		var _this$req$runtime;
		return (_this$req$runtime = this.req.runtime) === null || _this$req$runtime === void 0 ? void 0 : _this$req$runtime.node;
	}
	get headers() {
		return this.req.headers;
	}
	get path() {
		return this.url.pathname + this.url.search;
	}
	get method() {
		return this.req.method;
	}
}, _defineProperty(_Class, "__is_event__", true), _Class);
var H3EventResponse = class {
	constructor() {
		_defineProperty(this, "status", void 0);
		_defineProperty(this, "statusText", void 0);
	}
	get headers() {
		return this[kEventResHeaders] || (this[kEventResHeaders] = new Headers());
	}
	get errHeaders() {
		return this[kEventResErrHeaders] || (this[kEventResErrHeaders] = new Headers());
	}
};
var DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
	return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
	if (!statusCode) return defaultStatusCode;
	if (typeof statusCode === "string") statusCode = +statusCode;
	if (statusCode < 100 || statusCode > 599) return defaultStatusCode;
	return statusCode;
}
var HTTPError = class HTTPError extends Error {
	get name() {
		return "HTTPError";
	}
	static isError(input) {
		return input instanceof Error && (input === null || input === void 0 ? void 0 : input.name) === "HTTPError";
	}
	static status(status, statusText, details) {
		return new HTTPError({
			...details,
			statusText,
			status
		});
	}
	constructor(arg1, arg2) {
		var _details$cause, _details$cause2, _details$cause3, _details$cause4, _details$cause5, _details$cause6, _ref, _details$unhandled, _details$cause7;
		let messageInput;
		let details;
		if (typeof arg1 === "string") {
			messageInput = arg1;
			details = arg2;
		} else details = arg1;
		const status = sanitizeStatusCode((details === null || details === void 0 ? void 0 : details.status) || (details === null || details === void 0 ? void 0 : details.statusCode) || (details === null || details === void 0 || (_details$cause = details.cause) === null || _details$cause === void 0 ? void 0 : _details$cause.status) || (details === null || details === void 0 || (_details$cause2 = details.cause) === null || _details$cause2 === void 0 ? void 0 : _details$cause2.statusCode), 500);
		const statusText = sanitizeStatusMessage((details === null || details === void 0 ? void 0 : details.statusText) || (details === null || details === void 0 ? void 0 : details.statusMessage) || (details === null || details === void 0 || (_details$cause3 = details.cause) === null || _details$cause3 === void 0 ? void 0 : _details$cause3.statusText) || (details === null || details === void 0 || (_details$cause4 = details.cause) === null || _details$cause4 === void 0 ? void 0 : _details$cause4.statusMessage));
		const message = messageInput || (details === null || details === void 0 ? void 0 : details.message) || (details === null || details === void 0 || (_details$cause5 = details.cause) === null || _details$cause5 === void 0 ? void 0 : _details$cause5.message) || (details === null || details === void 0 ? void 0 : details.statusText) || (details === null || details === void 0 ? void 0 : details.statusMessage) || [
			"HTTPError",
			status,
			statusText
		].filter(Boolean).join(" ");
		super(message, { cause: details });
		_defineProperty(this, "status", void 0);
		_defineProperty(this, "statusText", void 0);
		_defineProperty(this, "headers", void 0);
		_defineProperty(this, "cause", void 0);
		_defineProperty(this, "data", void 0);
		_defineProperty(this, "body", void 0);
		_defineProperty(this, "unhandled", void 0);
		this.cause = details;
		this.status = status;
		this.statusText = statusText || void 0;
		const rawHeaders = (details === null || details === void 0 ? void 0 : details.headers) || (details === null || details === void 0 || (_details$cause6 = details.cause) === null || _details$cause6 === void 0 ? void 0 : _details$cause6.headers);
		this.headers = rawHeaders ? new Headers(rawHeaders) : void 0;
		this.unhandled = (_ref = (_details$unhandled = details === null || details === void 0 ? void 0 : details.unhandled) !== null && _details$unhandled !== void 0 ? _details$unhandled : details === null || details === void 0 || (_details$cause7 = details.cause) === null || _details$cause7 === void 0 ? void 0 : _details$cause7.unhandled) !== null && _ref !== void 0 ? _ref : void 0;
		this.data = details === null || details === void 0 ? void 0 : details.data;
		this.body = details === null || details === void 0 ? void 0 : details.body;
	}
	get statusCode() {
		return this.status;
	}
	get statusMessage() {
		return this.statusText;
	}
	toJSON() {
		const unhandled = this.unhandled;
		return {
			status: this.status,
			statusText: this.statusText,
			unhandled,
			message: unhandled ? "HTTPError" : this.message,
			data: unhandled ? void 0 : this.data,
			...unhandled ? void 0 : this.body
		};
	}
};
function isJSONSerializable(value, _type) {
	if (value === null || value === void 0) return true;
	if (_type !== "object") return _type === "boolean" || _type === "number" || _type === "string";
	if (typeof value.toJSON === "function") return true;
	if (Array.isArray(value)) return true;
	if (typeof value.pipe === "function" || typeof value.pipeTo === "function") return false;
	if (value instanceof NullProtoObj) return true;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
var kNotFound = /* @__PURE__ */ Symbol.for("h3.notFound");
var kHandled = /* @__PURE__ */ Symbol.for("h3.handled");
function toResponse(val, event, config = {}) {
	if (typeof (val === null || val === void 0 ? void 0 : val.then) === "function") return val.then((resolvedVal) => toResponse(resolvedVal, event, config), (r) => toResponse(typeof r === "number" ? new HTTPError({ status: r }) : r, event, config));
	const response = prepareResponse(val, event, config);
	if (typeof (response === null || response === void 0 ? void 0 : response.then) === "function") return toResponse(response, event, config);
	const { onResponse } = config;
	return onResponse ? Promise.resolve(onResponse(response, event)).then(() => response) : response;
}
var HTTPResponse = (_headers = /* @__PURE__ */ new WeakMap(), _init2 = /* @__PURE__ */ new WeakMap(), class {
	constructor(body, init) {
		_classPrivateFieldInitSpec(this, _headers, void 0);
		_classPrivateFieldInitSpec(this, _init2, void 0);
		_defineProperty(this, "body", void 0);
		this.body = body;
		_classPrivateFieldSet2(_init2, this, init);
	}
	get status() {
		var _classPrivateFieldGet2$1;
		return ((_classPrivateFieldGet2$1 = _classPrivateFieldGet2(_init2, this)) === null || _classPrivateFieldGet2$1 === void 0 ? void 0 : _classPrivateFieldGet2$1.status) || 200;
	}
	get statusText() {
		var _classPrivateFieldGet3;
		return ((_classPrivateFieldGet3 = _classPrivateFieldGet2(_init2, this)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.statusText) || "OK";
	}
	get headers() {
		var _classPrivateFieldGet4;
		return _classPrivateFieldGet2(_headers, this) || _classPrivateFieldSet2(_headers, this, new Headers((_classPrivateFieldGet4 = _classPrivateFieldGet2(_init2, this)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.headers));
	}
});
function prepareResponse(val, event, config, nested) {
	if (val === kHandled) return new NodeResponse(null);
	if (val === kNotFound) val = new HTTPError({
		status: 404,
		message: `Cannot find any route matching [${event.req.method}] ${event.url}`
	});
	if (val && val instanceof Error) {
		var _event$kEventRes;
		const isHTTPError = HTTPError.isError(val);
		const error = isHTTPError ? val : new HTTPError(val);
		if (!isHTTPError) {
			error.unhandled = true;
			if (val === null || val === void 0 ? void 0 : val.stack) error.stack = val.stack;
		}
		if (error.unhandled && !config.silent) console.error(error);
		const { onError } = config;
		const errHeaders = (_event$kEventRes = event[kEventRes]) === null || _event$kEventRes === void 0 ? void 0 : _event$kEventRes[kEventResErrHeaders];
		return onError && !nested ? Promise.resolve(onError(error, event)).catch((error) => error).then((newVal) => prepareResponse(newVal !== null && newVal !== void 0 ? newVal : val, event, config, true)) : errorResponse(error, config.debug, errHeaders);
	}
	const preparedRes = event[kEventRes];
	const preparedHeaders = preparedRes === null || preparedRes === void 0 ? void 0 : preparedRes[kEventResHeaders];
	event[kEventRes] = void 0;
	if (!(val instanceof Response)) {
		const res = prepareResponseBody(val, event, config);
		const status = res.status || (preparedRes === null || preparedRes === void 0 ? void 0 : preparedRes.status);
		return new NodeResponse(nullBody(event.req.method, status) ? null : res.body, {
			status,
			statusText: res.statusText || (preparedRes === null || preparedRes === void 0 ? void 0 : preparedRes.statusText),
			headers: res.headers && preparedHeaders ? mergeHeaders$1(res.headers, preparedHeaders) : res.headers || preparedHeaders
		});
	}
	if (!preparedHeaders || nested || !val.ok) return val;
	try {
		mergeHeaders$1(val.headers, preparedHeaders, val.headers);
		return val;
	} catch {
		return new NodeResponse(nullBody(event.req.method, val.status) ? null : val.body, {
			status: val.status,
			statusText: val.statusText,
			headers: mergeHeaders$1(val.headers, preparedHeaders)
		});
	}
}
function mergeHeaders$1(base, overrides, target = new Headers(base)) {
	for (const [name, value] of overrides) if (name === "set-cookie") target.append(name, value);
	else target.set(name, value);
	return target;
}
var frozen = (name) => (...args) => {
	throw new Error(`Headers are frozen (${name} ${args.join(", ")})`);
};
var FrozenHeaders = class extends Headers {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "set", frozen("set"));
		_defineProperty(this, "append", frozen("append"));
		_defineProperty(this, "delete", frozen("delete"));
	}
};
var emptyHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-length": "0" });
var jsonHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-type": "application/json;charset=UTF-8" });
function prepareResponseBody(val, event, config) {
	var _val$constructor;
	if (val === null || val === void 0) return {
		body: "",
		headers: emptyHeaders
	};
	const valType = typeof val;
	if (valType === "string") return { body: val };
	if (val instanceof Uint8Array) {
		event.res.headers.set("content-length", val.byteLength.toString());
		return { body: val };
	}
	if (val instanceof HTTPResponse || (val === null || val === void 0 || (_val$constructor = val.constructor) === null || _val$constructor === void 0 ? void 0 : _val$constructor.name) === "HTTPResponse") return val;
	if (isJSONSerializable(val, valType)) return {
		body: JSON.stringify(val, void 0, config.debug ? 2 : void 0),
		headers: jsonHeaders
	};
	if (valType === "bigint") return {
		body: val.toString(),
		headers: jsonHeaders
	};
	if (val instanceof Blob) {
		const headers = new Headers({
			"content-type": val.type,
			"content-length": val.size.toString()
		});
		let filename = val.name;
		if (filename) {
			filename = encodeURIComponent(filename);
			headers.set("content-disposition", `filename="${filename}"; filename*=UTF-8''${filename}`);
		}
		return {
			body: val.stream(),
			headers
		};
	}
	if (valType === "symbol") return { body: val.toString() };
	if (valType === "function") return { body: `${val.name}()` };
	return { body: val };
}
function nullBody(method, status) {
	return method === "HEAD" || status === 100 || status === 101 || status === 102 || status === 204 || status === 205 || status === 304;
}
function errorResponse(error, debug, errHeaders) {
	let headers = error.headers ? mergeHeaders$1(jsonHeaders, error.headers) : new Headers(jsonHeaders);
	if (errHeaders) headers = mergeHeaders$1(headers, errHeaders);
	return new NodeResponse(JSON.stringify({
		...error.toJSON(),
		stack: debug && error.stack ? error.stack.split("\n").map((l) => l.trim()) : void 0
	}, void 0, debug ? 2 : void 0), {
		status: error.status,
		statusText: error.statusText,
		headers
	});
}
function callMiddleware(event, middleware, handler, index = 0) {
	if (index === middleware.length) return handler(event);
	const fn = middleware[index];
	let nextCalled;
	let nextResult;
	const next = () => {
		if (nextCalled) return nextResult;
		nextCalled = true;
		nextResult = callMiddleware(event, middleware, handler, index + 1);
		return nextResult;
	};
	const ret = fn(event, next);
	return isUnhandledResponse(ret) ? next() : typeof (ret === null || ret === void 0 ? void 0 : ret.then) === "function" ? ret.then((resolved) => isUnhandledResponse(resolved) ? next() : resolved) : ret;
}
function isUnhandledResponse(val) {
	return val === void 0 || val === kNotFound;
}
function toRequest(input, options) {
	if (typeof input === "string") {
		let url = input;
		if (url[0] === "/") {
			const headers = (options === null || options === void 0 ? void 0 : options.headers) ? new Headers(options.headers) : void 0;
			const host = (headers === null || headers === void 0 ? void 0 : headers.get("host")) || "localhost";
			url = `${(headers === null || headers === void 0 ? void 0 : headers.get("x-forwarded-proto")) === "https" ? "https" : "http"}://${host}${url}`;
		}
		return new Request(url, options);
	} else if (options || input instanceof URL) return new Request(input, options);
	return input;
}
function defineHandler(input) {
	var _input$middleware;
	if (typeof input === "function") return handlerWithFetch(input);
	const handler = input.handler || (input.fetch ? function _fetchHandler(event) {
		return input.fetch(event.req);
	} : NoHandler);
	return Object.assign(handlerWithFetch(((_input$middleware = input.middleware) === null || _input$middleware === void 0 ? void 0 : _input$middleware.length) ? function _handlerMiddleware(event) {
		return callMiddleware(event, input.middleware, handler);
	} : handler), input);
}
function handlerWithFetch(handler) {
	if ("fetch" in handler) return handler;
	return Object.assign(handler, { fetch: (req) => {
		if (typeof req === "string") req = new URL(req, "http://_");
		if (req instanceof URL) req = new Request(req);
		const event = new H3Event(req);
		try {
			return Promise.resolve(toResponse(handler(event), event));
		} catch (error) {
			return Promise.resolve(toResponse(error, event));
		}
	} });
}
function defineLazyEventHandler(loader) {
	let handler;
	let promise;
	return defineHandler(function lazyHandler(event) {
		var _promise;
		return handler ? handler(event) : ((_promise = promise) !== null && _promise !== void 0 ? _promise : promise = Promise.resolve(loader()).then(function resolveLazyHandler(r) {
			handler = toEventHandler(r) || toEventHandler(r.default);
			if (typeof handler !== "function") throw new TypeError("Invalid lazy handler", { cause: { resolved: r } });
			return handler;
		})).then((r) => r(event));
	});
}
function toEventHandler(handler) {
	var _handler$constructor;
	if (typeof handler === "function") return handler;
	if (typeof (handler === null || handler === void 0 ? void 0 : handler.handler) === "function" && ((_handler$constructor = handler.constructor) === null || _handler$constructor === void 0 ? void 0 : _handler$constructor["~h3"])) return handler.handler;
	if (typeof (handler === null || handler === void 0 ? void 0 : handler.fetch) === "function") return function _fetchHandler(event) {
		return handler.fetch(event.req);
	};
}
var NoHandler = () => kNotFound;
var H3Core = (_Class2 = class {
	constructor(config = {}) {
		_defineProperty(this, "config", void 0);
		_defineProperty(this, "~middleware", void 0);
		_defineProperty(this, "~routes", []);
		this["~middleware"] = [];
		this.config = config;
		this.fetch = this.fetch.bind(this);
		this.handler = this.handler.bind(this);
	}
	fetch(request) {
		return this["~request"](request);
	}
	handler(event) {
		const route = this["~findRoute"](event);
		if (route) {
			event.context.params = route.params;
			event.context.matchedRoute = route.data;
		}
		const routeHandler = (route === null || route === void 0 ? void 0 : route.data.handler) || NoHandler;
		const middleware = this["~getMiddleware"](event, route);
		return middleware.length > 0 ? callMiddleware(event, middleware, routeHandler) : routeHandler(event);
	}
	"~request"(request, context) {
		const event = new H3Event(request, context, this);
		let handlerRes;
		try {
			if (this.config.onRequest) {
				const hookRes = this.config.onRequest(event);
				handlerRes = typeof (hookRes === null || hookRes === void 0 ? void 0 : hookRes.then) === "function" ? hookRes.then(() => this.handler(event)) : this.handler(event);
			} else handlerRes = this.handler(event);
		} catch (error) {
			handlerRes = Promise.reject(error);
		}
		return toResponse(handlerRes, event, this.config);
	}
	"~findRoute"(_event) {}
	"~addRoute"(_route) {
		this["~routes"].push(_route);
	}
	"~getMiddleware"(_event, route) {
		const routeMiddleware = route === null || route === void 0 ? void 0 : route.data.middleware;
		const globalMiddleware = this["~middleware"];
		return routeMiddleware ? [...globalMiddleware, ...routeMiddleware] : globalMiddleware;
	}
}, _defineProperty(_Class2, "~h3", true), _Class2);
//#endregion
export { toEventHandler as a, serve as c, _classPrivateFieldGet2 as d, _classPrivateFieldSet2 as f, defineLazyEventHandler as i, _defineProperty as l, HTTPError as n, toRequest as o, _classPrivateFieldInitSpec as p, defineHandler as r, NodeResponse as s, H3Core as t, FastURL as u };
