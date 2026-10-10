import { useEffect, useRef, useState, type FormEvent } from "react";
import { Download, File, FileCode2, Folder, Gamepad2, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  fetchRepoMeta,
  fetchRepos,
  fetchTree,
  isHtmlName,
  isRomName,
  locationUrl,
  resolveAddress,
  romLabel,
  type Entry,
  type Repo,
} from "@/lib/github";
import { cartTitle } from "@/lib/shelf";
import { appPath } from "@/lib/app-path";
import { HintBar, ghostBtn, primaryBtn } from "@/components/controls";

export type GhPlay = {
  title: string;
  owner: string;
  repo: string;
  ref: string;
  path: string;
};

type Loc = {
  kind: "repos" | "tree";
  user: string;
  owner: string;
  repo: string;
  ref: string;
  path: string;
  description: string | null;
};

type Row =
  | { kind: "repo"; repo: Repo }
  | { kind: "dir"; entry: Entry }
  | { kind: "html"; entry: Entry }
  | { kind: "file"; entry: Entry };

const HOME: Loc = {
  kind: "repos",
  user: "xenodorian",
  owner: "xenodorian",
  repo: "",
  ref: "",
  path: "",
  description: null,
};

type ViewMode = "html" | "roms" | "all";

const VIEW_KEY = "portlight.github.view";

const VIEWS: Array<{ id: ViewMode; label: string }> = [
  { id: "html", label: "Show HTML only" },
  { id: "roms", label: "Show HTML and roms" },
  { id: "all", label: "Show all" },
];

function rowVisible(row: Row, mode: ViewMode) {
  if (row.kind !== "file") return true;
  if (mode === "all") return true;
  if (mode === "roms") return isRomName(row.entry.name);
  return false;
}

function locKey(loc: Loc) {
  return `${loc.kind}|${loc.user}|${loc.owner}|${loc.repo}|${loc.ref}|${loc.path}`;
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 102.4) / 10)} KB`;
  return `${Math.round(size / 1024 / 102.4) / 10} MB`;
}

function toRow(entry: Entry): Row {
  if (entry.type === "dir") return { kind: "dir", entry };
  if (isHtmlName(entry.name)) return { kind: "html", entry };
  return { kind: "file", entry };
}

function rowName(row: Row) {
  return row.kind === "repo" ? row.repo.name : row.entry.name;
}

function typingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea"));
}

export function GithubView({ active, onLibrary, onPlay }: { active: boolean; onLibrary: () => void; onPlay: (game: GhPlay) => void }) {
  const [stack, setStack] = useState<Loc[]>([HOME]);
  const [rows, setRows] = useState<Row[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(locationUrl(HOME));
  const [editing, setEditing] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [armed, setArmed] = useState(false);
  const [view, setView] = useState<ViewMode>("html");
  const pendingFocus = useRef<string | null>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const loc = stack[stack.length - 1] ?? HOME;
  const key = locKey(loc);
  const url = locationUrl(loc);
  const listed = rows.filter((row) => rowVisible(row, view));
  const shown = query.trim()
    ? listed.filter((row) => rowName(row).toLowerCase().includes(query.trim().toLowerCase()))
    : listed;
  const safeCursor = Math.min(cursor, Math.max(0, shown.length - 1));
  const current = shown[safeCursor];

  useEffect(() => {
    if (!editing) setDraft(url);
  }, [url, editing]);

  useEffect(() => {
    if (active) setArmed(true);
  }, [active]);

  useEffect(() => {
    if (!armed) return;
    let cancel = false;
    setLoading(true);
    setError(null);
    setQuery("");
    setCursor(0);
    setRows([]);
    async function run() {
      try {
        if (loc.kind === "repos") {
          const repos = await fetchRepos(loc.user);
          if (cancel) return;
          setRows(repos.map((repo) => ({ kind: "repo", repo })));
        } else {
          const entries = await fetchTree(loc.owner, loc.repo, loc.ref, loc.path);
          if (cancel) return;
          const next = entries.map(toRow);
          setRows(next);
          if (pendingFocus.current) {
            const name = pendingFocus.current;
            pendingFocus.current = null;
            const visible = next.filter((row) => rowVisible(row, view));
            const index = visible.findIndex((row) => rowName(row) === name);
            if (index >= 0) setCursor(index);
          }
          if (loc.path === "" && loc.description === null) {
            fetchRepoMeta(loc.owner, loc.repo)
              .then((meta) => {
                if (cancel) return;
                setStack((prev) =>
                  prev.map((item, index) =>
                    index === prev.length - 1 && locKey(item) === key ? { ...item, description: meta.description } : item,
                  ),
                );
              })
              .catch(() => undefined);
          }
        }
      } catch (err) {
        if (!cancel) setError(err instanceof Error ? err.message : "Couldn't reach GitHub.");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    void run();
    return () => {
      cancel = true;
    };
  }, [key, reload, armed]);

  useEffect(() => {
    rowRefs.current[safeCursor]?.scrollIntoView({ block: "nearest" });
  }, [safeCursor, shown.length, key]);

  function back() {
    if (stack.length > 1) setStack((prev) => prev.slice(0, -1));
    else onLibrary();
  }

  function openRepo(repo: Repo) {
    setStack((prev) => [
      ...prev,
      {
        kind: "tree",
        user: loc.user,
        owner: loc.user,
        repo: repo.name,
        ref: repo.defaultBranch,
        path: "",
        description: repo.description,
      },
    ]);
  }

  function openDir(path: string) {
    setStack((prev) => [...prev, { ...loc, path }]);
  }

  function playEntry(entry: Entry) {
    onPlay({
      title: cartTitle(loc.repo, entry.path),
      owner: loc.owner,
      repo: loc.repo,
      ref: loc.ref,
      path: entry.path,
    });
  }

  function download(entry: Entry) {
    const params = new URLSearchParams({
      owner: loc.owner,
      repo: loc.repo,
      ref: loc.ref,
      path: entry.path,
      download: "1",
    });
    const link = document.createElement("a");
    link.href = appPath(`/api/raw?${params.toString()}`);
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function activate(row: Row | undefined) {
    if (!row || loading) return;
    if (row.kind === "repo") openRepo(row.repo);
    else if (row.kind === "dir") openDir(row.entry.path);
    else if (row.kind === "html") playEntry(row.entry);
    else download(row.entry);
  }

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
        setCursor((value) => Math.min(shown.length - 1, value + 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setCursor((value) => Math.max(0, value - 1));
      } else if (event.key === "Backspace" || event.key === "Escape" || event.key === "x" || event.key === "X") {
        event.preventDefault();
        back();
      } else if (!onControl && (event.key === "Enter" || event.key === " " || event.key === "z" || event.key === "Z")) {
        event.preventDefault();
        activate(shown[Math.min(cursor, Math.max(0, shown.length - 1))]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setResolving(true);
    setError(null);
    try {
      const dest = await resolveAddress(draft);
      pendingFocus.current = dest.focusName ?? null;
      if (dest.kind === "repos") {
        setStack([
          {
            kind: "repos",
            user: dest.user,
            owner: dest.user,
            repo: "",
            ref: "",
            path: "",
            description: null,
          },
        ]);
      } else {
        setStack([
          {
            kind: "repos",
            user: dest.owner,
            owner: dest.owner,
            repo: "",
            ref: "",
            path: "",
            description: null,
          },
          {
            kind: "tree",
            user: dest.owner,
            owner: dest.owner,
            repo: dest.repo,
            ref: dest.ref,
            path: dest.path,
            description: null,
          },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't open that address.");
    } finally {
      setResolving(false);
    }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "roms" || saved === "all") setView(saved);
  }, []);

  function chooseView(next: ViewMode) {
    setView(next);
    setCursor(0);
    window.localStorage.setItem(VIEW_KEY, next);
  }

  const htmlCount = listed.filter((row) => row.kind === "html").length;
  const romCount = listed.filter((row) => row.kind === "file" && isRomName(row.entry.name)).length;
  const title = loc.kind === "repos" ? loc.user : loc.repo;
  const kicker = loc.kind === "repos" ? "Public · no login" : loc.owner;
  const blurb =
    loc.kind === "repos"
      ? "Public repositories. HTML files can be played or downloaded."
      : loc.path
        ? loc.path
        : view === "all"
          ? listed.length > 0
            ? `${listed.length} item${listed.length === 1 ? "" : "s"}`
            : "Nothing in this folder."
          : view === "roms"
            ? htmlCount + romCount > 0
              ? `${htmlCount} HTML · ${romCount} ROM${romCount === 1 ? "" : "s"}`
              : "No HTML or ROM files in this folder."
            : htmlCount > 0
              ? `${htmlCount} playable HTML file${htmlCount === 1 ? "" : "s"}`
              : (loc.description ?? "No HTML in this folder.");

  const segments = loc.kind === "tree" ? loc.path.split("/").filter(Boolean) : [];

  return (
    <>
      <form onSubmit={onSubmit} className="flex shrink-0 gap-2 border-b border-line px-4 py-3">
        <input
          aria-label="GitHub address"
          value={draft}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setDraft(event.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          className="h-11 min-w-0 flex-1 border border-line bg-bg px-3 text-sm text-fg"
        />
        <button type="submit" data-pad="action" className={ghostBtn} disabled={resolving}>
          {resolving ? "…" : "Go"}
        </button>
      </form>
      <div className="flex shrink-0 flex-wrap gap-2 border-b border-line px-4 py-3" role="group" aria-label="Files to show">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            data-pad="toggle"
            aria-pressed={view === item.id}
            className={
              view === item.id
                ? "inline-flex min-h-10 items-center bg-signal px-3 py-2 font-display text-sm font-semibold text-ink"
                : "inline-flex min-h-10 items-center border border-line px-3 py-2 font-display text-sm font-semibold text-fg"
            }
            onClick={() => chooseView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <section className="shrink-0 border-b border-line px-4 py-5">
        <p className="font-display text-xs tracking-widest text-signal uppercase">{kicker}</p>
        <h1 className="mt-1 truncate font-display text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{loading && rows.length === 0 ? "Reading GitHub…" : blurb}</p>
        {loc.kind === "tree" ? (
          <div className="mt-3 flex flex-wrap items-center gap-1 text-sm">
            <button type="button" data-pad="crumb" className="text-muted hover:text-fg" onClick={() => setStack([{ ...HOME, user: loc.owner, owner: loc.owner }])}>
              {loc.owner}
            </button>
            <span className="text-line">/</span>
            <button type="button" data-pad="crumb" className="text-muted hover:text-fg" onClick={() => openDirReset("")}>
              {loc.repo}
            </button>
            {segments.map((segment, index) => {
              const path = segments.slice(0, index + 1).join("/");
              return (
                <span key={path} className="inline-flex items-center gap-1">
                  <span className="text-line">/</span>
                  <button type="button" data-pad="crumb" className="text-muted hover:text-fg" onClick={() => openDirReset(path)}>
                    {segment}
                  </button>
                </span>
              );
            })}
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" data-pad="back" className={ghostBtn} onClick={back}>
            Back
          </button>
          {current?.kind === "html" ? (
            <button type="button" data-pad="action" className={primaryBtn} onClick={() => playEntry(current.entry)}>
              Play
            </button>
          ) : null}
          {current && current.kind !== "html" && current.kind !== "file" ? (
            <button type="button" data-pad="action" className={primaryBtn} onClick={() => activate(current)}>
              Open
            </button>
          ) : null}
          {current?.kind === "file" ? (
            <button type="button" data-pad="action" className={primaryBtn} onClick={() => download(current.entry)}>
              <Download className="size-4" aria-hidden="true" />
              Download
            </button>
          ) : null}
          {current?.kind === "html" ? (
            <button type="button" data-pad="action" className={ghostBtn} onClick={() => download(current.entry)}>
              <Download className="size-4" aria-hidden="true" />
              Download
            </button>
          ) : null}
        </div>
      </section>
      <div role="listbox" aria-label="GitHub" className="min-h-0 flex-1 overflow-y-auto">
        {error ? (
          <div className="px-4 py-4" aria-live="polite">
            <p className="text-sm text-fg">{error}</p>
            <button type="button" data-pad="action" className={`${ghostBtn} mt-3`} onClick={() => setReload((value) => value + 1)}>
              Try again
            </button>
          </div>
        ) : null}
        {!error && loading && shown.length === 0 ? <p className="px-4 py-4 text-sm text-muted">Reading GitHub…</p> : null}
        {!error && !loading && shown.length === 0 ? (
          <p className="px-4 py-4 text-sm text-muted">
            {query
              ? "Nothing matches that filter."
              : loc.kind === "repos"
                ? "No public repositories."
                : view === "all"
                  ? "This folder is empty."
                  : view === "roms"
                    ? "No HTML or ROM files in this folder."
                    : "No HTML files in this folder."}
          </p>
        ) : null}
        {shown.map((row, index) => {
          const selected = index === safeCursor;
          return (
            <button
              key={row.kind === "repo" ? row.repo.name : row.entry.path}
              type="button"
              role="option"
              data-pad="item"
              aria-selected={selected}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              className={
                selected
                  ? "flex min-h-12 w-full items-center gap-3 border-b border-line bg-signal px-4 py-3 text-left text-ink"
                  : "flex min-h-12 w-full items-center gap-3 border-b border-line px-4 py-3 text-left text-fg hover:bg-raised"
              }
              onClick={() => {
                if (safeCursor === index) activate(row);
                else setCursor(index);
              }}
              onDoubleClick={() => activate(row)}
            >
              <RowIcon row={row} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg font-semibold">{rowName(row)}</span>
                <span className={selected ? "block truncate text-sm text-ink/75" : "block truncate text-sm text-muted"}>
                  <RowMeta row={row} />
                </span>
              </span>
              {row.kind === "repo" && row.repo.stars > 0 ? (
                <span className="inline-flex shrink-0 items-center gap-1 font-display text-sm tabular-nums">
                  <Star className="size-4" aria-hidden="true" />
                  {row.repo.stars}
                </span>
              ) : null}
              {row.kind === "html" ? (
                <span className={selected ? "shrink-0 border border-ink px-2 py-1 font-display text-xs tracking-widest uppercase" : "shrink-0 border border-signal px-2 py-1 font-display text-xs tracking-widest text-signal uppercase"}>
                  Play
                </span>
              ) : null}
              {row.kind === "file" && isRomName(row.entry.name) ? (
                <span className={selected ? "shrink-0 border border-ink px-2 py-1 font-display text-xs tracking-widest uppercase" : "shrink-0 border border-line px-2 py-1 font-display text-xs tracking-widest text-muted uppercase"}>
                  ROM
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {listed.length > 12 ? (
        <form
          className="flex shrink-0 gap-2 border-t border-line px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            setCursor(0);
          }}
        >
          <input
            aria-label="Filter names"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            placeholder="Filter names"
            className="h-11 min-w-0 flex-1 border border-line bg-bg px-3 text-sm text-fg"
          />
        </form>
      ) : null}
      <HintBar>D-pad moves · A press · B back · Stick mouse</HintBar>
    </>
  );

  function openDirReset(path: string) {
    if (loc.kind !== "tree") return;
    setStack([
      { kind: "repos", user: loc.owner, owner: loc.owner, repo: "", ref: "", path: "", description: null },
      { ...loc, path },
    ]);
  }
}

function RowIcon({ row }: { row: Row }) {
  const className = "size-5 shrink-0";
  if (row.kind === "dir") return <Folder className={className} aria-hidden="true" />;
  if (row.kind === "html") return <FileCode2 className={className} aria-hidden="true" />;
  if (row.kind === "file" && isRomName(row.entry.name)) return <Gamepad2 className={className} aria-hidden="true" />;
  if (row.kind === "file") return <File className={className} aria-hidden="true" />;
  return <Folder className={className} aria-hidden="true" />;
}

function RowMeta({ row }: { row: Row }) {
  if (row.kind === "repo") {
    const when = row.repo.updatedAt ? safeWhen(row.repo.updatedAt) : "";
    return (
      <>
        {row.repo.language ?? "Repo"}
        {when ? ` · ${when}` : ""}
        {row.repo.description ? ` · ${row.repo.description}` : ""}
      </>
    );
  }
  if (row.kind === "dir") return <>Folder</>;
  if (row.kind === "html") return <>Playable HTML · {formatBytes(row.entry.size)}</>;
  if (isRomName(row.entry.name)) return <>{romLabel(row.entry.name)} · {formatBytes(row.entry.size)}</>;
  return <>{formatBytes(row.entry.size)}</>;
}

function safeWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
}
