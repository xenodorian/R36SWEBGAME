import { useEffect, useRef, useState } from "react";
import { appPath } from "@/lib/app-path";
import { ghostBtn } from "@/components/controls";

export type PlayTarget =
  | { kind: "builtin"; title: string; src: string }
  | { kind: "github"; title: string; owner: string; repo: string; ref: string; path: string };

type Phase = "keydown" | "keyup";
type VKey = {
  label: string;
  code: string;
  key: string;
  keyCode: number;
  span?: number;
  sticky?: "shift" | "ctrl" | "alt" | "caps";
};

type Mods = { shift: boolean; ctrl: boolean; alt: boolean; caps: boolean };

const ARROWS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
const MOUSE_MOVE = new Set(["KeyW", "KeyA", "KeyS", "KeyD"]);

const SHIFTED: Record<string, string> = {
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
  "/": "?",
};

function letter(ch: string): VKey {
  const upper = ch.toUpperCase();
  return { label: upper, code: `Key${upper}`, key: ch, keyCode: upper.charCodeAt(0) };
}

function digit(n: number): VKey {
  const label = String(n);
  return { label, code: `Digit${label}`, key: label, keyCode: label.charCodeAt(0) };
}

const ROWS: VKey[][] = [
  [
    { label: "Esc", code: "Escape", key: "Escape", keyCode: 27 },
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
    { label: "Bksp", code: "Backspace", key: "Backspace", keyCode: 8 },
  ],
  [
    { label: "Tab", code: "Tab", key: "Tab", keyCode: 9 },
    letter("q"),
    letter("w"),
    letter("e"),
    letter("r"),
    letter("t"),
    letter("y"),
    letter("u"),
    letter("i"),
    letter("o"),
    letter("p"),
  ],
  [
    { label: "Caps", code: "CapsLock", key: "CapsLock", keyCode: 20, sticky: "caps" },
    letter("a"),
    letter("s"),
    letter("d"),
    letter("f"),
    letter("g"),
    letter("h"),
    letter("j"),
    letter("k"),
    letter("l"),
    { label: "Enter", code: "Enter", key: "Enter", keyCode: 13 },
  ],
  [
    { label: "Shift", code: "ShiftLeft", key: "Shift", keyCode: 16, sticky: "shift", span: 2 },
    letter("z"),
    letter("x"),
    letter("c"),
    letter("v"),
    letter("b"),
    letter("n"),
    letter("m"),
    { label: ",", code: "Comma", key: ",", keyCode: 188 },
    { label: ".", code: "Period", key: ".", keyCode: 190 },
    { label: "/", code: "Slash", key: "/", keyCode: 191 },
  ],
  [
    { label: "Ctrl", code: "ControlLeft", key: "Control", keyCode: 17, sticky: "ctrl" },
    { label: "Alt", code: "AltLeft", key: "Alt", keyCode: 18, sticky: "alt" },
    { label: "Space", code: "Space", key: " ", keyCode: 32, span: 4 },
    { label: "←", code: "ArrowLeft", key: "ArrowLeft", keyCode: 37 },
    { label: "↑", code: "ArrowUp", key: "ArrowUp", keyCode: 38 },
    { label: "↓", code: "ArrowDown", key: "ArrowDown", keyCode: 40 },
    { label: "→", code: "ArrowRight", key: "ArrowRight", keyCode: 39 },
  ],
];

const KEY_INFO: Record<string, { key: string; keyCode: number }> = {};
for (const row of ROWS) {
  for (const key of row) KEY_INFO[key.code] = { key: key.key, keyCode: key.keyCode };
}
KEY_INFO.KeyZ = KEY_INFO.KeyZ ?? { key: "z", keyCode: 90 };
KEY_INFO.KeyX = { key: "x", keyCode: 88 };
KEY_INFO.KeyC = { key: "c", keyCode: 67 };
KEY_INFO.KeyV = { key: "v", keyCode: 86 };
KEY_INFO.KeyQ = KEY_INFO.KeyQ ?? { key: "q", keyCode: 81 };
KEY_INFO.KeyE = KEY_INFO.KeyE ?? { key: "e", keyCode: 69 };
KEY_INFO.KeyW = KEY_INFO.KeyW ?? { key: "w", keyCode: 87 };
KEY_INFO.KeyA = KEY_INFO.KeyA ?? { key: "a", keyCode: 65 };
KEY_INFO.KeyS = KEY_INFO.KeyS ?? { key: "s", keyCode: 83 };
KEY_INFO.KeyD = KEY_INFO.KeyD ?? { key: "d", keyCode: 68 };

const HAT = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] as const;

function playSrc(target: PlayTarget) {
  const ifBuiltin = target.kind === "builtin";
  if (ifBuiltin) return appPath(target.src);
  const params = new URLSearchParams({
    owner: target.owner,
    repo: target.repo,
    ref: target.ref,
    path: target.path,
  });
  return appPath(`/api/play?${params.toString()}`);
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function stickAxis(value: number) {
  const dead = 0.2;
  if (Math.abs(value) < dead) return 0;
  return Math.sign(value) * ((Math.abs(value) - dead) / (1 - dead));
}

type MouseProbe = {
  getPos: () => { x: number; y: number };
  setHeld: (codes: string[]) => void;
};

function emitKey(frame: HTMLIFrameElement | null, phase: Phase, code: string, key: string, keyCode: number, mods: Mods) {
  const win = frame?.contentWindow;
  if (!win) return;
  win.postMessage(
    {
      source: "portlight",
      phase,
      code,
      key,
      keyCode,
      shiftKey: mods.shift,
      ctrlKey: mods.ctrl,
      altKey: mods.alt,
    },
    "*",
  );
}

function emitMouse(frame: HTMLIFrameElement | null, phase: "move" | "down" | "up", button: 0 | 2, nx: number, ny: number) {
  const win = frame?.contentWindow;
  if (!win) return;
  win.postMessage({ source: "portlight", type: "mouse", phase, button, nx, ny }, "*");
}

function outputKey(vkey: VKey, mods: Mods) {
  const upper = (mods.shift || mods.caps) && vkey.key.length === 1 && /[a-z]/.test(vkey.key);
  const shifted = mods.shift ? SHIFTED[vkey.key] : undefined;
  return shifted ?? (upper ? vkey.key.toUpperCase() : vkey.key);
}

export function PlayerView({ target, onExit }: { target: PlayTarget; onExit: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0.5, y: 0.5 });
  const held = useRef(new Set<string>());
  const mods = useRef<Mods>({ shift: false, ctrl: false, alt: false, caps: false });
  const keyboardRef = useRef(false);
  const mouseRef = useRef(false);
  const cellRef = useRef({ r: 2, c: 1 });
  const typing = useRef<VKey | null>(null);
  const clicks = useRef({ left: false, right: false });
  const hatPrev = useRef([false, false, false, false]);
  const hatHold = useRef({ code: "", next: 0 });
  const confirmPrev = useRef(false);
  const chromeRef = useRef<number | null>(null);
  const shoulderPrev = useRef([false, false, false]);
  const [doc, setDoc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [keyboardOn, setKeyboardOn] = useState(false);
  const [mouseOn, setMouseOn] = useState(false);
  const [cell, setCell] = useState({ r: 2, c: 1 });
  const [modView, setModView] = useState<Mods>({ shift: false, ctrl: false, alt: false, caps: false });
  const [chrome, setChrome] = useState<number | null>(null);
  const src = playSrc(target);
  keyboardRef.current = keyboardOn;
  mouseRef.current = mouseOn;
  cellRef.current = cell;

  function paintCursor() {
    const node = cursorRef.current;
    if (!node) return;
    node.style.left = `${pos.current.x * 100}%`;
    node.style.top = `${pos.current.y * 100}%`;
  }

  function moveCell(code: string) {
    setCell((prev) => {
      let r = prev.r;
      let c = prev.c;
      if (code === "ArrowUp") r = Math.max(0, r - 1);
      if (code === "ArrowDown") r = Math.min(ROWS.length - 1, r + 1);
      if (code === "ArrowLeft") c -= 1;
      if (code === "ArrowRight") c += 1;
      c = Math.max(0, Math.min(ROWS[r].length - 1, c));
      return { r, c };
    });
  }

  function selectedKey() {
    const here = cellRef.current;
    return ROWS[here.r]?.[here.c] ?? ROWS[0][0];
  }

  function typeSelected(down: boolean) {
    const vkey = selectedKey();
    if (vkey.sticky) {
      if (!down) return;
      const next = { ...mods.current, [vkey.sticky]: !mods.current[vkey.sticky] };
      mods.current = next;
      setModView(next);
      emitKey(frame.current, next[vkey.sticky] ? "keydown" : "keyup", vkey.code, vkey.key, vkey.keyCode, next);
      return;
    }
    if (down) {
      if (typing.current?.code === vkey.code) return;
      typing.current = vkey;
      emitKey(frame.current, "keydown", vkey.code, outputKey(vkey, mods.current), vkey.keyCode, mods.current);
      return;
    }
    if (!typing.current) return;
    const released = typing.current;
    typing.current = null;
    emitKey(frame.current, "keyup", released.code, outputKey(released, mods.current), released.keyCode, mods.current);
  }

  function setClick(button: 0 | 2, down: boolean) {
    if (!mouseRef.current) return;
    const side = button === 0 ? "left" : "right";
    if (clicks.current[side] === down) return;
    clicks.current[side] = down;
    emitMouse(frame.current, down ? "down" : "up", button, pos.current.x, pos.current.y);
  }

  useEffect(() => {
    const node = frame.current;
    if (!node || !doc) return;
    const origin = window.location.origin;
    const html = doc.replace(/(\s(?:src|href|poster)=["'])\/api\//g, `$1${origin}/api/`);
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    node.src = url;
    return () => URL.revokeObjectURL(url);
  }, [doc]);

  useEffect(() => {
    let cancel = false;
    setDoc(null);
    setLoadError(null);
    fetch(src, { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        if (!cancel) setDoc(text);
      })
      .catch(() => {
        if (!cancel) setLoadError("Couldn't open this game.");
      });
    return () => {
      cancel = true;
    };
  }, [src]);

  useEffect(() => {
    frame.current?.focus();
  }, [doc]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
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

  useEffect(() => {
    const probe = window as Window & { __portlightMouse?: MouseProbe };
    probe.__portlightMouse = {
      getPos: () => ({ x: pos.current.x, y: pos.current.y }),
      setHeld: (codes: string[]) => {
        held.current = new Set(codes);
      },
    };
    let last = performance.now();
    let raf = 0;
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let mx = 0;
      let my = 0;
      let stickX = 0;
      let stickY = 0;
      const pads = navigator.getGamepads?.() ?? [];
      let pad: Gamepad | null = null;
      for (const candidate of pads) {
        if (candidate) {
          pad = candidate;
          break;
        }
      }
      if (pad) {
        stickX = stickAxis(pad.axes[0] ?? 0);
        stickY = stickAxis(pad.axes[1] ?? 0);
        const hatNow = [12, 13, 14, 15].map((index) => {
          const button = pad?.buttons[index];
          return !!button && (button.pressed || button.value > 0.5);
        });
        if (keyboardRef.current) {
          let code = "";
          if (hatNow[0]) code = "ArrowUp";
          else if (hatNow[1]) code = "ArrowDown";
          else if (hatNow[2]) code = "ArrowLeft";
          else if (hatNow[3]) code = "ArrowRight";
          if (!code) hatHold.current = { code: "", next: 0 };
          else if (code !== hatHold.current.code) {
            moveCell(code);
            hatHold.current = { code, next: now + 280 };
          } else if (now >= hatHold.current.next) {
            moveCell(code);
            hatHold.current = { code, next: now + 90 };
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
        const south = pad.buttons[0];
        const confirm = !!south && (south.pressed || south.value > 0.5);
        const shoulders = [4, 5, 1].map((index) => {
          const button = pad.buttons[index];
          return !!button && (button.pressed || button.value > 0.5);
        });
        shoulders.forEach((down, index) => {
          if (down === shoulderPrev.current[index]) return;
          shoulderPrev.current[index] = down;
          if (!down) return;
          const nodes = [...document.querySelectorAll<HTMLButtonElement>("[data-chrome]")];
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
              const nodes = [...document.querySelectorAll<HTMLButtonElement>("[data-chrome]")];
              nodes[chromeRef.current]?.click();
            }
          } else if (keyboardRef.current) typeSelected(confirm);
        }
        if (mouseRef.current) {
          const l3 = pad.buttons[10];
          const r3 = pad.buttons[11];
          setClick(0, !!l3 && (l3.pressed || l3.value > 0.5));
          setClick(2, !!r3 && (r3.pressed || r3.value > 0.5));
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
          pos.current.x = clamp01(pos.current.x + mx * 0.72 * dt);
          pos.current.y = clamp01(pos.current.y + my * 0.72 * dt);
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
    "Esc leaves",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg">
      <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <button type="button" data-chrome="" data-chrome-current={chrome === 0 ? "true" : undefined} className={ghostBtn} onClick={onExit}>
          Exit
        </button>
        <h1 className="min-w-0 flex-1 truncate font-display text-lg font-semibold">{target.title}</h1>
        <button
          type="button"
          data-chrome=""
          data-chrome-current={chrome === 1 ? "true" : undefined}
          aria-pressed={keyboardOn}
          className={keyboardOn ? `${ghostBtn} border-signal bg-signal text-ink` : ghostBtn}
          onClick={() => setKeyboardOn((value) => !value)}
        >
          Keyboard
        </button>
        <button
          type="button"
          data-chrome=""
          data-chrome-current={chrome === 2 ? "true" : undefined}
          aria-pressed={mouseOn}
          className={mouseOn ? `${ghostBtn} border-signal bg-signal text-ink` : ghostBtn}
          onClick={() => {
            setMouseOn((value) => {
              if (value) {
                if (clicks.current.left) emitMouse(frame.current, "up", 0, pos.current.x, pos.current.y);
                if (clicks.current.right) emitMouse(frame.current, "up", 2, pos.current.x, pos.current.y);
                clicks.current = { left: false, right: false };
                held.current.clear();
              }
              return !value;
            });
          }}
        >
          Mouse
        </button>
      </header>
      {loadError ? (
        <p className="px-4 py-6 text-sm text-fg">{loadError}</p>
      ) : doc ? (
        <div className="relative min-h-0 flex-1">
          <iframe
            ref={frame}
            title={target.title}
            tabIndex={0}
            className="absolute inset-0 h-full w-full border-0 bg-bg"
          />
          {mouseOn ? (
            <div className="pointer-events-none absolute inset-0 z-10">
              <div ref={cursorRef} className="absolute h-5 w-5" style={{ left: "50%", top: "50%" }}>
                <svg viewBox="0 0 16 16" className="h-5 w-5">
                  <path d="M1 1 L1 13 L5.2 9.4 L8.4 15 L10.6 14 L7.3 8.4 L13 8.4 Z" fill="#e6a23c" stroke="#16130c" strokeWidth="1" />
                </svg>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="px-4 py-6 text-sm text-muted">Opening…</p>
      )}
      {keyboardOn ? (
        <div className="shrink-0 border-t border-line px-2 py-2" role="grid" aria-label="Virtual keyboard">
          <div className="grid grid-cols-12 gap-1">
            {ROWS.map((row, r) =>
              row.map((vkey, c) => {
                const selected = cell.r === r && cell.c === c;
                const sticky = vkey.sticky ? modView[vkey.sticky] : false;
                return (
                  <button
                    key={`${vkey.code}-${c}`}
                    type="button"
                    role="gridcell"
                    aria-selected={selected}
                    style={{ gridColumn: `span ${vkey.span ?? 1}` }}
                    className={
                      selected
                        ? "flex h-9 items-center justify-center bg-signal font-display text-xs font-semibold text-ink"
                        : sticky
                          ? "flex h-9 items-center justify-center border border-signal bg-raised font-display text-xs font-semibold text-signal"
                          : "flex h-9 items-center justify-center border border-line bg-raised font-display text-xs font-semibold text-fg"
                    }
                    onPointerDown={(event) => {
                      event.preventDefault();
                      setCell({ r, c });
                      cellRef.current = { r, c };
                      typeSelected(true);
                    }}
                    onPointerUp={() => typeSelected(false)}
                    onPointerCancel={() => typeSelected(false)}
                  >
                    {vkey.label}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      ) : null}
      <p className="flex h-10 min-w-0 shrink-0 items-center overflow-hidden border-t border-line px-4 font-display text-xs tracking-widest text-muted uppercase">
        <span className="truncate">{hint}</span>
      </p>
    </div>
  );
}
