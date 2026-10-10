//#region node_modules/@tanstack/history/dist/esm/index.js
var stateIndexKey = "__TSR_index";
var popStateEvent = "popstate";
var beforeUnloadEvent = "beforeunload";
/**
* Turn protocol-relative inputs such as "//evil.example" into paths
* such as "/evil.example", keeping navigation on the current origin.
*
* For HTTP(S) URLs, WHATWG parsing ignores leading C0 controls and spaces,
* removes tabs/newlines, and treats backslashes as slashes, so inputs like
* "/\evil.example" also need normalization. This only allocates when those
* rules would make the input protocol-relative.
*/
var protocolRelativePrefix = /^[\x00-\x20]*(?:[\\/][\t\n\r]*){2,}/;
function normalizeProtocolRelative(url) {
	const match = protocolRelativePrefix.exec(url);
	return match ? "/" + url.slice(match[0].length) : url;
}
function normalizeHref(href) {
	if (/[\x00-\x1f\x7f]/.test(href)) href = href.replace(/[\x00-\x1f\x7f]/g, (character) => "	\n\r".includes(character) ? "" : encodeURIComponent(character));
	return normalizeProtocolRelative(href);
}
function createHistory(opts) {
	let location = opts.getLocation();
	const subscribers = /* @__PURE__ */ new Set();
	const notify = (action) => {
		location = opts.getLocation();
		subscribers.forEach((subscriber) => subscriber({
			location,
			action
		}));
	};
	const handleIndexChange = (action) => {
		var _opts$notifyOnIndexCh;
		if ((_opts$notifyOnIndexCh = opts.notifyOnIndexChange) !== null && _opts$notifyOnIndexCh !== void 0 ? _opts$notifyOnIndexCh : true) notify(action);
		else location = opts.getLocation();
	};
	const tryNavigation = async ({ task, navigateOpts, ...actionInfo }) => {
		var _navigateOpts$ignoreB, _opts$getBlockers, _opts$getBlockers2;
		if ((_navigateOpts$ignoreB = navigateOpts === null || navigateOpts === void 0 ? void 0 : navigateOpts.ignoreBlocker) !== null && _navigateOpts$ignoreB !== void 0 ? _navigateOpts$ignoreB : false) {
			task();
			return;
		}
		const blockers = (_opts$getBlockers = (_opts$getBlockers2 = opts.getBlockers) === null || _opts$getBlockers2 === void 0 ? void 0 : _opts$getBlockers2.call(opts)) !== null && _opts$getBlockers !== void 0 ? _opts$getBlockers : [];
		const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
		if (typeof document !== "undefined" && blockers.length && isPushOrReplace) for (const blocker of blockers) {
			const nextLocation = parseHref(actionInfo.path, actionInfo.state);
			if (await blocker.blockerFn({
				currentLocation: location,
				nextLocation,
				action: actionInfo.type
			})) {
				var _opts$onBlocked;
				(_opts$onBlocked = opts.onBlocked) === null || _opts$onBlocked === void 0 || _opts$onBlocked.call(opts);
				return;
			}
		}
		task();
	};
	return {
		get location() {
			return location;
		},
		get length() {
			return opts.getLength();
		},
		subscribers,
		subscribe: (cb) => {
			subscribers.add(cb);
			return () => {
				subscribers.delete(cb);
			};
		},
		push: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex + 1, state);
			tryNavigation({
				task: () => {
					opts.pushState(path, state);
					notify({ type: "PUSH" });
				},
				navigateOpts,
				type: "PUSH",
				path,
				state
			});
		},
		replace: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex, state);
			tryNavigation({
				task: () => {
					opts.replaceState(path, state);
					notify({ type: "REPLACE" });
				},
				navigateOpts,
				type: "REPLACE",
				path,
				state
			});
		},
		go: (index, navigateOpts) => {
			tryNavigation({
				task: () => {
					var _navigateOpts$ignoreB2;
					opts.go(index, (_navigateOpts$ignoreB2 = navigateOpts === null || navigateOpts === void 0 ? void 0 : navigateOpts.ignoreBlocker) !== null && _navigateOpts$ignoreB2 !== void 0 ? _navigateOpts$ignoreB2 : false);
					handleIndexChange({
						type: "GO",
						index
					});
				},
				navigateOpts,
				type: "GO"
			});
		},
		back: (navigateOpts) => {
			tryNavigation({
				task: () => {
					var _navigateOpts$ignoreB3;
					opts.back((_navigateOpts$ignoreB3 = navigateOpts === null || navigateOpts === void 0 ? void 0 : navigateOpts.ignoreBlocker) !== null && _navigateOpts$ignoreB3 !== void 0 ? _navigateOpts$ignoreB3 : false);
					handleIndexChange({ type: "BACK" });
				},
				navigateOpts,
				type: "BACK"
			});
		},
		forward: (navigateOpts) => {
			tryNavigation({
				task: () => {
					var _navigateOpts$ignoreB4;
					opts.forward((_navigateOpts$ignoreB4 = navigateOpts === null || navigateOpts === void 0 ? void 0 : navigateOpts.ignoreBlocker) !== null && _navigateOpts$ignoreB4 !== void 0 ? _navigateOpts$ignoreB4 : false);
					handleIndexChange({ type: "FORWARD" });
				},
				navigateOpts,
				type: "FORWARD"
			});
		},
		canGoBack: () => location.state[stateIndexKey] !== 0,
		createHref: (str) => opts.createHref(str),
		block: (blocker) => {
			var _opts$getBlockers3, _opts$getBlockers4;
			if (!opts.setBlockers) return () => {};
			const blockers = (_opts$getBlockers3 = (_opts$getBlockers4 = opts.getBlockers) === null || _opts$getBlockers4 === void 0 ? void 0 : _opts$getBlockers4.call(opts)) !== null && _opts$getBlockers3 !== void 0 ? _opts$getBlockers3 : [];
			opts.setBlockers([...blockers, blocker]);
			return () => {
				var _opts$getBlockers5, _opts$getBlockers6, _opts$setBlockers;
				const blockers = (_opts$getBlockers5 = (_opts$getBlockers6 = opts.getBlockers) === null || _opts$getBlockers6 === void 0 ? void 0 : _opts$getBlockers6.call(opts)) !== null && _opts$getBlockers5 !== void 0 ? _opts$getBlockers5 : [];
				(_opts$setBlockers = opts.setBlockers) === null || _opts$setBlockers === void 0 || _opts$setBlockers.call(opts, blockers.filter((b) => b !== blocker));
			};
		},
		flush: () => {
			var _opts$flush;
			return (_opts$flush = opts.flush) === null || _opts$flush === void 0 ? void 0 : _opts$flush.call(opts);
		},
		destroy: () => {
			var _opts$destroy;
			return (_opts$destroy = opts.destroy) === null || _opts$destroy === void 0 ? void 0 : _opts$destroy.call(opts);
		},
		notify,
		_getBlockers: () => {
			var _opts$getBlockers7, _opts$getBlockers8;
			return (_opts$getBlockers7 = (_opts$getBlockers8 = opts.getBlockers) === null || _opts$getBlockers8 === void 0 ? void 0 : _opts$getBlockers8.call(opts)) !== null && _opts$getBlockers7 !== void 0 ? _opts$getBlockers7 : [];
		}
	};
}
function assignKeyAndIndex(index, state) {
	const key = createRandomKey();
	return {
		...state,
		key,
		__TSR_key: key,
		[stateIndexKey]: index
	};
}
/**
* Creates a history object that can be used to interact with the browser's
* navigation. This is a lightweight API wrapping the browser's native methods.
* It is designed to work with TanStack Router, but could be used as a standalone API as well.
* IMPORTANT: This API implements history throttling via a microtask to prevent
* excessive calls to the history API. In some browsers, calling history.pushState or
* history.replaceState in quick succession can cause the browser to ignore subsequent
* calls. This API smooths out those differences and ensures that your application
* state will *eventually* match the browser state. In most cases, this is not a problem,
* but if you need to ensure that the browser state is up to date, you can use the
* `history.flush` method to immediately flush all pending state changes to the browser URL.
* @param opts
* @param opts.getHref A function that returns the current href (path + search + hash)
* @param opts.createHref A function that takes a path and returns a href (path + search + hash)
* @returns A history instance
*/
function createBrowserHistory(opts) {
	var _opts$window, _opts$parseLocation, _win$history$state, _win$history$state2;
	const win = (_opts$window = opts === null || opts === void 0 ? void 0 : opts.window) !== null && _opts$window !== void 0 ? _opts$window : typeof document !== "undefined" ? window : void 0;
	const originalPushState = win.history.pushState;
	const originalReplaceState = win.history.replaceState;
	let blockers = [];
	const _getBlockers = () => blockers;
	const _setBlockers = (newBlockers) => blockers = newBlockers;
	const createHref = (path) => normalizeHref((opts === null || opts === void 0 ? void 0 : opts.createHref) ? opts.createHref(path) : path);
	const parseLocation = (_opts$parseLocation = opts === null || opts === void 0 ? void 0 : opts.parseLocation) !== null && _opts$parseLocation !== void 0 ? _opts$parseLocation : (() => parseHref(`${win.location.pathname}${win.location.search}${win.location.hash}`, win.history.state));
	if (!((_win$history$state = win.history.state) === null || _win$history$state === void 0 ? void 0 : _win$history$state.__TSR_key) && !((_win$history$state2 = win.history.state) === null || _win$history$state2 === void 0 ? void 0 : _win$history$state2.key)) {
		const addedKey = createRandomKey();
		win.history.replaceState({
			[stateIndexKey]: 0,
			key: addedKey,
			__TSR_key: addedKey
		}, "");
	}
	let currentLocation = parseLocation();
	let rollbackLocation;
	let nextPopIsGo = false;
	let ignoreNextPop = false;
	let skipBlockerNextPop = false;
	let ignoreNextBeforeUnload = false;
	const getLocation = () => currentLocation;
	let next;
	const flush = () => {
		if (!next) return;
		history._ignoreSubscribers = true;
		(next[2] ? win.history.pushState : win.history.replaceState)(next[1], "", next[0]);
		history._ignoreSubscribers = false;
		next = void 0;
		rollbackLocation = void 0;
	};
	const queueHistoryAction = (isPush, destHref, state) => {
		const href = (opts === null || opts === void 0 ? void 0 : opts.createHref) ? createHref(destHref) : void 0;
		const hasPendingAction = !!next;
		if (!hasPendingAction) rollbackLocation = currentLocation;
		currentLocation = parseHref(destHref, state);
		next = [
			href !== null && href !== void 0 ? href : currentLocation.href,
			state,
			(next === null || next === void 0 ? void 0 : next[2]) || isPush
		];
		if (!hasPendingAction) queueMicrotask(() => flush());
	};
	const onPushPop = (type) => {
		currentLocation = parseLocation();
		history.notify({ type });
	};
	const onPushPopEvent = async () => {
		ignoreNextBeforeUnload = false;
		if (ignoreNextPop) {
			ignoreNextPop = false;
			return;
		}
		const nextLocation = parseLocation();
		const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
		const isForward = delta === 1;
		const isBack = delta === -1;
		const isGo = !isForward && !isBack || nextPopIsGo;
		nextPopIsGo = false;
		const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
		const notify = isGo ? {
			type: "GO",
			index: delta
		} : { type: isBack ? "BACK" : "FORWARD" };
		if (skipBlockerNextPop) skipBlockerNextPop = false;
		else {
			const blockers = _getBlockers();
			if (typeof document !== "undefined" && blockers.length) {
				for (const blocker of blockers) if (await blocker.blockerFn({
					currentLocation,
					nextLocation,
					action
				})) {
					ignoreNextPop = true;
					win.history.go(-delta);
					history.notify(notify);
					return;
				}
			}
		}
		currentLocation = parseLocation();
		history.notify(notify);
	};
	const onBeforeUnload = (e) => {
		if (ignoreNextBeforeUnload) {
			ignoreNextBeforeUnload = false;
			return;
		}
		let shouldBlock = false;
		const blockers = _getBlockers();
		if (typeof document !== "undefined" && blockers.length) for (const blocker of blockers) {
			var _blocker$enableBefore;
			const shouldHaveBeforeUnload = (_blocker$enableBefore = blocker.enableBeforeUnload) !== null && _blocker$enableBefore !== void 0 ? _blocker$enableBefore : true;
			if (shouldHaveBeforeUnload === true) {
				shouldBlock = true;
				break;
			}
			if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
				shouldBlock = true;
				break;
			}
		}
		if (shouldBlock) {
			e.preventDefault();
			return e.returnValue = "";
		}
	};
	const history = createHistory({
		getLocation,
		getLength: () => win.history.length,
		pushState: (href, state) => queueHistoryAction(true, href, state),
		replaceState: (href, state) => queueHistoryAction(false, href, state),
		back: (ignoreBlocker) => {
			if (ignoreBlocker) {
				skipBlockerNextPop = true;
				ignoreNextBeforeUnload = true;
			}
			return win.history.back();
		},
		forward: (ignoreBlocker) => {
			if (ignoreBlocker) {
				skipBlockerNextPop = true;
				ignoreNextBeforeUnload = true;
			}
			win.history.forward();
		},
		go: (n, ignoreBlocker) => {
			nextPopIsGo = true;
			if (ignoreBlocker) {
				skipBlockerNextPop = true;
				ignoreNextBeforeUnload = true;
			}
			win.history.go(n);
		},
		createHref: (href) => createHref(href),
		flush,
		destroy: () => {
			win.history.pushState = originalPushState;
			win.history.replaceState = originalReplaceState;
			win.removeEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
			win.removeEventListener(popStateEvent, onPushPopEvent);
		},
		onBlocked: () => {
			if (rollbackLocation && currentLocation !== rollbackLocation) currentLocation = rollbackLocation;
		},
		getBlockers: _getBlockers,
		setBlockers: _setBlockers,
		notifyOnIndexChange: false
	});
	history._ignoreNextBeforeUnload = (href) => {
		ignoreNextBeforeUnload = false;
		try {
			href = new URL(href, win.document.baseURI).href;
			ignoreNextBeforeUnload = /^https?:/.test(href) && (!href.includes("#") || href.split("#")[0] !== win.location.href.split("#")[0]);
		} catch {}
	};
	win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
	win.addEventListener(popStateEvent, onPushPopEvent);
	win.history.pushState = function(...args) {
		const res = originalPushState.apply(win.history, args);
		if (!history._ignoreSubscribers) onPushPop("PUSH");
		return res;
	};
	win.history.replaceState = function(...args) {
		const res = originalReplaceState.apply(win.history, args);
		if (!history._ignoreSubscribers) onPushPop("REPLACE");
		return res;
	};
	return history;
}
var noop = () => {};
var ServerHistory = class {
	constructor(location) {
		this.location = location;
	}
	get length() {
		return 1;
	}
	get subscribers() {
		var _this$_subscribers;
		return (_this$_subscribers = this._subscribers) !== null && _this$_subscribers !== void 0 ? _this$_subscribers : this._subscribers = /* @__PURE__ */ new Set();
	}
	subscribe() {
		return noop;
	}
	push() {}
	replace() {}
	go() {}
	back() {}
	forward() {}
	canGoBack() {
		return false;
	}
	createHref(href) {
		return normalizeHref(href);
	}
	block() {
		return noop;
	}
	flush() {}
	destroy() {}
	notify() {}
	_getBlockers() {
		return [];
	}
};
/** A fixed request location; server navigation is a no-op. */
function createServerHistory(href) {
	return new ServerHistory(parseHref(href, void 0));
}
function parseHref(href, state) {
	const sanitizedHref = normalizeHref(href);
	const hashIndex = sanitizedHref.indexOf("#");
	const searchIndex = sanitizedHref.indexOf("?");
	if (!state) {
		const key = createRandomKey();
		state = {
			[stateIndexKey]: 0,
			key,
			__TSR_key: key
		};
	}
	return {
		href: sanitizedHref,
		pathname: sanitizedHref.substring(0, hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : sanitizedHref.length),
		hash: hashIndex > -1 ? sanitizedHref.substring(hashIndex) : "",
		search: searchIndex > -1 ? sanitizedHref.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
		state
	};
}
function createRandomKey() {
	return (Math.random() + 1).toString(36).substring(7);
}
//#endregion
export { parseHref as i, createServerHistory as n, normalizeProtocolRelative as r, createBrowserHistory as t };
