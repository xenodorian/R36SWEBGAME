import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { loadCarts, saveCarts, cartId, cartTitle, type Cart } from "@/lib/shelf";
import { LibraryView, type Builtin } from "@/components/library-view";
import { GithubView, type GhPlay } from "@/components/github-view";
import { PlayerView, type PlayTarget } from "@/components/player-view";
import { MenuControls } from "@/components/menu-controls";
import { tabBtn } from "@/components/controls";

export const Route = createFileRoute("/")({ component: Home });

type Screen = "library" | "github" | "play";

function Home() {
  const [screen, setScreen] = useState<Screen>("library");
  const [play, setPlay] = useState<PlayTarget | null>(null);
  const [carts, setCarts] = useState<Cart[] | null>(null);
  const returnTo = useRef<Exclude<Screen, "play">>("library");

  useEffect(() => {
    setCarts(loadCarts());
  }, []);

  useEffect(() => {
    if (carts === null) return;
    saveCarts(carts);
  }, [carts]);

  function remember(game: Omit<Cart, "id" | "addedAt" | "title"> & { title?: string }) {
    const title = game.title ?? cartTitle(game.repo, game.path);
    const id = cartId(game.owner, game.repo, game.ref, game.path);
    setCarts((prev) => [{ id, title, owner: game.owner, repo: game.repo, ref: game.ref, path: game.path, addedAt: Date.now() }, ...(prev ?? []).filter((cart) => cart.id !== id)]);
  }

  function openBuiltin(game: Builtin) {
    returnTo.current = screen === "github" ? "github" : "library";
    setPlay({ kind: "builtin", title: game.title, src: game.src });
    setScreen("play");
  }

  function openCart(cart: Cart) {
    returnTo.current = "library";
    setPlay({ kind: "github", title: cart.title, owner: cart.owner, repo: cart.repo, ref: cart.ref, path: cart.path });
    setScreen("play");
  }

  function openGithub(game: GhPlay) {
    remember(game);
    returnTo.current = "github";
    setPlay({ kind: "github", ...game });
    setScreen("play");
  }

  function exitPlay() {
    setScreen(returnTo.current);
    setPlay(null);
  }

  const shelf = carts ?? [];
  const libraryOn = screen === "library";
  const githubOn = screen === "github";

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      {screen !== "play" ? (
        <header className="flex h-16 shrink-0 items-center gap-3 border-t-2 border-b border-t-signal border-b-line px-4">
          <div className="grid size-8 shrink-0 place-items-center bg-signal font-display text-lg font-semibold text-ink">P</div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-display text-lg font-semibold tracking-wide">PORTLIGHT</p>
            <p className="hidden text-xs text-muted sm:block">ArkOS HTML station</p>
          </div>
          <nav className="flex shrink-0 gap-2">
            <button
              type="button"
              data-pad="library"
              className={libraryOn ? `${tabBtn} bg-signal text-ink` : `${tabBtn} border border-line text-fg`}
              onClick={() => setScreen("library")}
            >
              Library
            </button>
            <button
              type="button"
              data-pad="github"
              className={githubOn ? `${tabBtn} bg-signal text-ink` : `${tabBtn} border border-line text-fg`}
              onClick={() => setScreen("github")}
            >
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </button>
          </nav>
        </header>
      ) : null}
      <div className={libraryOn ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
        <LibraryView
          active={libraryOn}
          carts={shelf}
          onPlayBuiltin={openBuiltin}
          onPlayCart={openCart}
          onRemove={(id) => setCarts((prev) => (prev ?? []).filter((cart) => cart.id !== id))}
        />
      </div>
      <div className={githubOn ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
        <GithubView active={githubOn} onLibrary={() => setScreen("library")} onPlay={openGithub} />
      </div>
      {screen !== "play" ? <MenuControls /> : null}
      {screen === "play" && play ? <PlayerView target={play} onExit={exitPlay} /> : null}
    </main>
  );
}
