import { useEffect, useRef, useState } from "react";
import { readPad } from "@/lib/pad";

function visible(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function targets() {
  return [...document.querySelectorAll<HTMLElement>("[data-pad]")].filter(visible);
}

function currentTarget() {
  return document.querySelector<HTMLElement>("[data-pad-current='true']");
}

function point(dir: "up" | "down" | "left" | "right") {
  const items = targets();
  if (!items.length) return;
  const current = currentTarget();
  const start = current && items.includes(current) ? current : (items.find((el) => el.getAttribute("aria-selected") === "true") ?? items[0]);
  const box = start.getBoundingClientRect();
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of items) {
    if (el === start) continue;
    const rect = el.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - cx;
    const dy = rect.top + rect.height / 2 - cy;
    if (dir === "down" && dy < 10) continue;
    if (dir === "up" && dy > -10) continue;
    if (dir === "right" && dx < 10) continue;
    if (dir === "left" && dx > -10) continue;
    const primary = dir === "up" || dir === "down" ? Math.abs(dy) : Math.abs(dx);
    const secondary = dir === "up" || dir === "down" ? Math.abs(dx) : Math.abs(dy);
    const score = primary + secondary * 1.4;
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  }
  const next = best ?? start;
  if (current && current !== next) current.removeAttribute("data-pad-current");
  next.setAttribute("data-pad-current", "true");
  next.scrollIntoView({ block: "nearest" });
  if (next.getAttribute("role") === "option" && next.getAttribute("aria-selected") !== "true") next.click();
}

function pressCurrent() {
  const current = currentTarget() ?? targets().find((el) => el.getAttribute("aria-selected") === "true");
  current?.click();
}

function pressBack() {
  const back = targets().find((el) => el.dataset.pad === "back");
  back?.click();
}

function clickAt(x: number, y: number, button: 0 | 2) {
  const hit = document.elementFromPoint(x, y);
  const target = hit?.closest("button, a, input");
  if (!(target instanceof HTMLElement)) return;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    target.focus();
    return;
  }
  if (button === 2) {
    target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    return;
  }
  target.click();
}

export function MenuControls() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const shown = useRef(false);
  const [mouse, setMouse] = useState(false);
  const hold = useRef({ code: "", next: 0 });
  const clickPrev = useRef([false, false, false, false]);
  const stickSince = useRef(0);

  useEffect(() => {
    pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    function onKey(event: KeyboardEvent) {
      const typing = event.target instanceof HTMLElement && Boolean(event.target.closest("input, textarea"));
      if (typing) return;
      const dir =
        event.key === "ArrowUp" ? "up" : event.key === "ArrowDown" ? "down" : event.key === "ArrowLeft" ? "left" : event.key === "ArrowRight" ? "right" : "";
      if (dir) {
        event.preventDefault();
        event.stopImmediatePropagation();
        point(dir);
        return;
      }
      if (shown.current && (event.code === "KeyQ" || event.code === "KeyE")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!event.repeat) clickAt(pos.current.x, pos.current.y, event.code === "KeyQ" ? 0 : 2);
        return;
      }
      if (event.key === "z" || event.key === "Z" || event.key === "Enter") {
        const current = currentTarget();
        if (current && current.getAttribute("role") !== "option") {
          event.preventDefault();
          event.stopImmediatePropagation();
          current.click();
        }
      }
    }
    window.addEventListener("keydown", onKey, true);
    let last = performance.now();
    let raf = 0;
    const keys = new Set<string>();
    function down(event: KeyboardEvent) {
      if (event.code === "KeyW" || event.code === "KeyA" || event.code === "KeyS" || event.code === "KeyD") keys.add(event.code);
    }
    function up(event: KeyboardEvent) {
      keys.delete(event.code);
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const pads = navigator.getGamepads?.() ?? [];
      let pad: Gamepad | null = null;
      for (const candidate of pads) {
        if (candidate) {
          pad = candidate;
          break;
        }
      }
      let mx = 0;
      let my = 0;
      if (keys.has("KeyA")) mx -= 1;
      if (keys.has("KeyD")) mx += 1;
      if (keys.has("KeyW")) my -= 1;
      if (keys.has("KeyS")) my += 1;
      if (pad) {
        const state = readPad(pad);
        if (state.lx || state.ly) {
          if (!stickSince.current) stickSince.current = now;
          if (!shown.current && now - stickSince.current > 250) {
            shown.current = true;
            setMouse(true);
          }
          mx += state.lx;
          my += state.ly;
        } else {
          stickSince.current = 0;
        }
        let code = "";
        if (state.up) code = "up";
        else if (state.down) code = "down";
        else if (state.left) code = "left";
        else if (state.right) code = "right";
        if (!code) hold.current = { code: "", next: 0 };
        else if (code !== hold.current.code) {
          point(code as "up");
          hold.current = { code, next: now + 280 };
        } else if (now >= hold.current.next) {
          point(code as "up");
          hold.current = { code, next: now + 90 };
        }
        const prev = clickPrev.current;
        if (state.a && !prev[0]) pressCurrent();
        if (state.b && !prev[1]) pressBack();
        if (shown.current && state.l3 && !prev[2]) clickAt(pos.current.x, pos.current.y, 0);
        if (shown.current && state.r3 && !prev[3]) clickAt(pos.current.x, pos.current.y, 2);
        clickPrev.current = [state.a, state.b, state.l3, state.r3];
      }
      if (shown.current && (mx || my)) {
        const mag = Math.hypot(mx, my);
        if (mag > 1) {
          mx /= mag;
          my /= mag;
        }
        pos.current.x = Math.min(window.innerWidth - 2, Math.max(0, pos.current.x + mx * 780 * dt));
        pos.current.y = Math.min(window.innerHeight - 2, Math.max(0, pos.current.y + my * 780 * dt));
        const node = cursorRef.current;
        if (node) {
          node.style.left = `${pos.current.x}px`;
          node.style.top = `${pos.current.y}px`;
        }
        const under = document.elementFromPoint(pos.current.x, pos.current.y);
        const scroller = under?.closest(".overflow-y-auto");
        if (scroller instanceof HTMLElement) {
          const rect = scroller.getBoundingClientRect();
          if (pos.current.y > rect.bottom - 28) scroller.scrollTop += 14;
          if (pos.current.y < rect.top + 28) scroller.scrollTop -= 14;
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      currentTarget()?.removeAttribute("data-pad-current");
    };
  }, []);

  if (!mouse) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div ref={cursorRef} className="absolute h-5 w-5" style={{ left: "50%", top: "50%" }}>
        <svg viewBox="0 0 16 16" className="h-5 w-5">
          <path d="M1 1 L1 13 L5.2 9.4 L8.4 15 L10.6 14 L7.3 8.4 L13 8.4 Z" fill="#e6a23c" stroke="#16130c" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
