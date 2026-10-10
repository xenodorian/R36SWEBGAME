import { useEffect, useRef, useState } from "react";
import { FileCode2, Trash2 } from "lucide-react";
import type { Cart } from "@/lib/shelf";
import { HintBar, ghostBtn, primaryBtn } from "@/components/controls";

export type Builtin = {
  id: string;
  title: string;
  blurb: string;
  src: string;
  mark: "lantern" | "snake" | "break";
};

export const BUILTINS: Builtin[] = [
  {
    id: "lantern",
    title: "Lantern Run",
    blurb: "Jump the posts. Up or Z launches the lantern.",
    src: "/ports/lantern.html",
    mark: "lantern",
  },
  {
    id: "snake",
    title: "Grid Snake",
    blurb: "Turn with the D-pad. Don't bite the trail.",
    src: "/ports/snake.html",
    mark: "snake",
  },
  {
    id: "break",
    title: "Break Amber",
    blurb: "Move the paddle. Z or A launches the ball.",
    src: "/ports/break.html",
    mark: "break",
  },
];

type Item =
  | { kind: "builtin"; game: Builtin }
  | { kind: "cart"; cart: Cart };

function Mark({ mark }: { mark: Builtin["mark"] }) {
  if (mark === "snake") {
    return (
      <div className="grid size-16 shrink-0 grid-cols-4 gap-1 border border-line bg-raised p-2">
        <span className="bg-signal" />
        <span className="bg-signal" />
        <span className="bg-signal" />
        <span className="col-start-3 row-start-2 bg-signal" />
        <span className="col-start-4 row-start-4 bg-fg" />
      </div>
    );
  }
  if (mark === "break") {
    return (
      <div className="flex size-16 shrink-0 flex-col justify-between border border-line bg-raised p-2">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 8 }, (_, index) => (
            <span key={index} className="h-2 bg-signal" />
          ))}
        </div>
        <span className="mx-auto h-2 w-8 bg-fg" />
      </div>
    );
  }
  return (
    <div className="relative size-16 shrink-0 border border-line bg-raised">
      <div className="absolute inset-x-4 top-3 bottom-4 bg-signal">
        <div className="absolute inset-x-2 top-2 h-3 bg-ink" />
      </div>
    </div>
  );
}

function typingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea"));
}

export function LibraryView({
  active,
  carts,
  onPlayBuiltin,
  onPlayCart,
  onRemove,
}: {
  active: boolean;
  carts: Cart[];
  onPlayBuiltin: (game: Builtin) => void;
  onPlayCart: (cart: Cart) => void;
  onRemove: (id: string) => void;
}) {
  const items: Item[] = [
    ...BUILTINS.map((game) => ({ kind: "builtin" as const, game })),
    ...carts.map((cart) => ({ kind: "cart" as const, cart })),
  ];
  const [cursor, setCursor] = useState(0);
  const rows = useRef<Array<HTMLButtonElement | null>>([]);
  const safeCursor = Math.min(cursor, Math.max(0, items.length - 1));
  const current = items[safeCursor];

  useEffect(() => {
    rows.current[safeCursor]?.scrollIntoView({ block: "nearest" });
  }, [safeCursor, items.length]);

  useEffect(() => {
    if (!active) return;
    function onKey(event: KeyboardEvent) {
      if (typingTarget(event.target)) return;
      const onControl =
        event.target instanceof HTMLElement &&
        Boolean(event.target.closest("button, a")) &&
        (event.key === "Enter" || event.key === " ");
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
  }, [active, cursor, items, onPlayBuiltin, onPlayCart]);

  function playCurrent() {
    if (!current) return;
    if (current.kind === "builtin") onPlayBuiltin(current.game);
    else onPlayCart(current.cart);
  }

  const kicker = current?.kind === "cart" ? "Shelved from GitHub" : "Built-in port";
  const title = current?.kind === "cart" ? current.cart.title : current?.game.title;
  const blurb =
    current?.kind === "cart" ? `${current.cart.owner}/${current.cart.repo} · ${current.cart.path}` : current?.game.blurb;

  return (
    <>
      <section className="shrink-0 border-b border-line px-4 py-5">
        <div className="flex items-start gap-4">
          {current?.kind === "builtin" ? (
            <Mark mark={current.game.mark} />
          ) : (
            <div className="grid size-16 shrink-0 place-items-center border border-line bg-raised text-signal">
              <FileCode2 className="size-7" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-xs tracking-widest text-signal uppercase">{kicker}</p>
            <h1 className="mt-1 truncate font-display text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-2 line-clamp-2 text-sm text-muted">{blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={primaryBtn} onClick={playCurrent}>
                Play
              </button>
              {current?.kind === "cart" ? (
                <button type="button" className={ghostBtn} onClick={() => onRemove(current.cart.id)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <div role="listbox" aria-label="Library" className="min-h-0 flex-1 overflow-y-auto">
        {items.map((item, index) => {
          const selected = index === safeCursor;
          const label = item.kind === "builtin" ? item.game.title : item.cart.title;
          const meta = item.kind === "builtin" ? "On device" : `${item.cart.owner}/${item.cart.repo}`;
          const showShelf = item.kind === "cart" && (index === 0 || items[index - 1]?.kind === "builtin");
          const showDevice = index === 0;
          return (
            <div key={item.kind === "builtin" ? item.game.id : item.cart.id}>
              {showDevice ? (
                <p className="px-4 pt-3 pb-1 font-display text-xs tracking-widest text-muted uppercase">On device</p>
              ) : null}
              {showShelf ? (
                <p className="px-4 pt-3 pb-1 font-display text-xs tracking-widest text-muted uppercase">From GitHub</p>
              ) : null}
              <button
                type="button"
                role="option"
                aria-selected={selected}
                ref={(node) => {
                  rows.current[index] = node;
                }}
                className={
                  selected
                    ? "flex min-h-12 w-full items-center gap-3 border-b border-line bg-signal px-4 py-3 text-left text-ink"
                    : "flex min-h-12 w-full items-center gap-3 border-b border-line px-4 py-3 text-left text-fg hover:bg-raised"
                }
                onClick={() => {
                  if (safeCursor === index) playCurrent();
                  else setCursor(index);
                }}
                onDoubleClick={() => {
                  setCursor(index);
                  if (item.kind === "builtin") onPlayBuiltin(item.game);
                  else onPlayCart(item.cart);
                }}
              >
                <span className="w-8 shrink-0 font-display text-sm font-semibold tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-semibold">{label}</span>
                  <span className={selected ? "block truncate text-sm text-ink/75" : "block truncate text-sm text-muted"}>
                    {meta}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
        {carts.length === 0 ? (
          <p className="px-4 py-4 text-sm text-muted">
            The shelf is empty. Open GitHub, pick an HTML file, and play it. It stays here.
          </p>
        ) : null}
      </div>
      <HintBar>D-pad move · A play · GitHub browses public repos</HintBar>
    </>
  );
}
