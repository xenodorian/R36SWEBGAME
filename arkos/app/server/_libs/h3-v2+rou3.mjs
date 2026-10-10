import { d as _classPrivateFieldGet2, f as _classPrivateFieldSet2, l as _defineProperty, p as _classPrivateFieldInitSpec, s as NodeResponse, u as FastURL } from "./h3.mjs";
//#region node_modules/h3-v2/node_modules/rou3/dist/index.mjs
var NullProtoObj = /* @__PURE__ */ (() => {
	const e = function() {};
	return e.prototype = Object.create(null), Object.freeze(e.prototype), e;
})();
//#endregion
//#region node_modules/h3-v2/dist/h3-Bz4OPZv_.mjs
var _Class;
var _headers;
var _init2;
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
	var _val$catch;
	if (typeof (val === null || val === void 0 ? void 0 : val.then) === "function") return (((_val$catch = val.catch) === null || _val$catch === void 0 ? void 0 : _val$catch.call(val, (error) => error)) || Promise.resolve(val)).then((resolvedVal) => toResponse(resolvedVal, event, config));
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
//#endregion
export { toResponse as n, H3Event as t };
