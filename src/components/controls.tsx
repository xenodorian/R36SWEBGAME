import type { ReactNode } from "react";

export const primaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 bg-signal px-4 font-display text-base font-semibold text-ink disabled:opacity-50";

export const ghostBtn =
  "inline-flex h-12 items-center justify-center gap-2 border border-line bg-bg px-4 font-display text-base font-semibold text-fg disabled:opacity-50";

export const tabBtn = "inline-flex h-10 shrink-0 items-center justify-center gap-2 px-3 font-display text-sm font-semibold";

export function HintBar({ children }: { children: ReactNode }) {
  return (
    <footer className="flex h-12 shrink-0 items-center border-t border-line px-4">
      <p className="truncate font-display text-xs tracking-widest text-muted uppercase">{children}</p>
    </footer>
  );
}
