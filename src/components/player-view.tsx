import { useEffect, useRef, useState, type RefObject } from "react";
import { appPath } from "@/lib/app-path";
import { ghostBtn } from "@/components/controls";

export type PlayTarget =
  | { kind: "builtin"; title: string; src: string }
  | { kind: "github"; title: string; owner: string; repo: string; ref: string; path: string };

const CODES = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  a: "KeyZ",
  b: "KeyX",
  x: "KeyC",
  y: "KeyV",
} as const;

const KEYS: Record<string, { key: string; keyCode: number }> = {
  ArrowUp: { key: "ArrowUp", keyCode: 38 },
  ArrowDown: { key: "ArrowDown", keyCode: 40 },
  ArrowLeft: { key: "ArrowLeft", keyCode: 37 },
  ArrowRight: { key: "ArrowRight", keyCode: 39 },
  KeyZ: { key: "z", keyCode: 90 },
  KeyX: { key: "x", keyCode: 88 },
  KeyC: { key: "c", keyCode: 67 },
  KeyV: { key: "v", keyCode: 86 },
  Space: { key: " ", keyCode: 32 },
};

function playSrc(target: PlayTarget) {
  if (target.kind === "builtin") return appPath(target.src);
  const params = new URLSearchParams({
    owner: target.owner,
    repo: target.repo,
    ref: target.ref,
    path: target.path,
  });
  return appPath(`/api/play?${params.toString()}`);
}

function emit(frame: HTMLIFrameElement | null, phase: "keydown" | "keyup", code: string) {
  const info = KEYS[code];
  const win = frame?.contentWindow;
  if (!info || !win) return;
  win.postMessage({ source: "portlight", phase, code, key: info.key, keyCode: info.keyCode }, "*");
}

export function PlayerView({ target, onExit }: { target: PlayTarget; onExit: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [pad, setPad] = useState(true);
  const src = playSrc(target);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) setPad(false);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onExit();
        return;
      }
      if (!KEYS[event.code]) return;
      if (event.target === frame.current) return;
      event.preventDefault();
      emit(frame.current, event.type === "keyup" ? "keyup" : "keydown", event.code);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [onExit]);

  useEffect(() => {
    frame.current?.focus();
  }, [src]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4">
        <button type="button" className={ghostBtn} onClick={onExit}>
          Exit
        </button>
        <h1 className="min-w-0 flex-1 truncate font-display text-lg font-semibold">{target.title}</h1>
        <button type="button" className={ghostBtn} onClick={() => setPad((value) => !value)}>
          {pad ? "Hide pad" : "Show pad"}
        </button>
      </header>
      <iframe
        ref={frame}
        title={target.title}
        src={src}
        tabIndex={0}
        sandbox="allow-scripts allow-modals allow-pointer-lock allow-popups allow-forms allow-downloads"
        className="min-h-0 w-full flex-1 border-0 bg-bg"
      />
      {pad ? (
        <div className="grid shrink-0 grid-cols-2 items-center gap-2 border-t border-line px-3 py-3">
          <Cluster
            cells={[
              null,
              ["up", "U"],
              null,
              ["left", "L"],
              null,
              ["right", "R"],
              null,
              ["down", "D"],
              null,
            ]}
            frame={frame}
          />
          <Cluster
            cells={[
              null,
              ["y", "Y"],
              null,
              ["x", "X"],
              null,
              ["a", "A"],
              null,
              ["b", "B"],
              null,
            ]}
            frame={frame}
            signal="a"
          />
        </div>
      ) : (
        <p className="flex h-10 shrink-0 items-center border-t border-line px-4 font-display text-xs tracking-widest text-muted uppercase">
          Arrows move · Z action · Esc exit
        </p>
      )}
    </div>
  );
}

function Cluster({
  cells,
  frame,
  signal,
}: {
  cells: Array<[keyof typeof CODES, string] | null>;
  frame: RefObject<HTMLIFrameElement | null>;
  signal?: keyof typeof CODES;
}) {
  return (
    <div className="mx-auto grid aspect-square w-full max-w-36 grid-cols-3 grid-rows-3">
      {cells.map((cell, index) => {
        if (!cell) return <span key={index} />;
        const [name, label] = cell;
        const code = CODES[name];
        const primary = signal === name;
        return (
          <button
            key={name}
            type="button"
            aria-label={name}
            className={
              primary
                ? "m-1 bg-signal font-display text-sm font-semibold text-ink"
                : "m-1 border border-line bg-raised font-display text-sm font-semibold text-fg"
            }
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              emit(frame.current, "keydown", code);
            }}
            onPointerUp={() => {
              emit(frame.current, "keyup", code);
              frame.current?.focus();
            }}
            onPointerCancel={() => emit(frame.current, "keyup", code)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
