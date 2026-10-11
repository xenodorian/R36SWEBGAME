#!/usr/bin/env python3
"""GitROMs – pure pygame GitHub ROM browser for R36S / ArkOS."""

import os
import sys
import time
from typing import List, Dict, Optional, Tuple

import pygame

from config import (
    BG, SURFACE, RAISED, FG, MUTED, LINE, SIGNAL, INK,
    WIDTH, HEIGHT, FPS, DEFAULT_USER, EXT_TO_SYSTEM, ROM_ROOT_CANDIDATES,
)
from github_client import list_user_repos, list_contents, download_file

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def find_rom_root() -> str:
    for candidate in ROM_ROOT_CANDIDATES:
        if os.path.isdir(candidate):
            return candidate
    # Fallback: create under current working directory for testing
    fallback = os.path.join(os.path.dirname(os.path.abspath(__file__)), "roms")
    os.makedirs(fallback, exist_ok=True)
    return fallback


def system_for_filename(name: str) -> str:
    lower = name.lower()
    for ext, system in EXT_TO_SYSTEM.items():
        if lower.endswith(ext):
            return system
    return "misc"


def format_size(n: int) -> str:
    if n < 1024:
        return f"{n} B"
    if n < 1024 * 1024:
        return f"{n / 1024:.1f} KB"
    return f"{n / (1024 * 1024):.1f} MB"


# ---------------------------------------------------------------------------
# UI primitives
# ---------------------------------------------------------------------------

class Button:
    def __init__(self, rect: pygame.Rect, label: str, data=None, small=False):
        self.rect = rect
        self.label = label
        self.data = data
        self.small = small

    def draw(self, surface, font, focused: bool, offset_y: int = 0):
        r = self.rect.move(0, -offset_y)
        color = SIGNAL if focused else RAISED
        text_color = INK if focused else FG
        pygame.draw.rect(surface, color, r, border_radius=8)
        if focused:
            pygame.draw.rect(surface, SIGNAL, r, width=3, border_radius=8)
        else:
            pygame.draw.rect(surface, LINE, r, width=1, border_radius=8)

        text = font.render(self.label, True, text_color)
        tx = r.x + 16
        ty = r.centery - text.get_height() // 2
        surface.blit(text, (tx, ty))


# ---------------------------------------------------------------------------
# App state machine
# ---------------------------------------------------------------------------

class App:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption("GitROMs")
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont("DejaVu Sans", 22)
        self.font_small = pygame.font.SysFont("DejaVu Sans", 16)
        self.font_title = pygame.font.SysFont("DejaVu Sans", 28, bold=True)

        self.rom_root = find_rom_root()
        self.status = ""
        self.error = ""

        # Navigation stack of screens
        self.stack: List[Dict] = []
        self.focus = 0
        self.buttons: List[Button] = []
        self.scroll = 0

        # Start at home
        self.push_home()

    # ---- screen builders -------------------------------------------------

    def push_home(self):
        self.stack = [{"kind": "home", "user": DEFAULT_USER}]
        self.focus = 0
        self.scroll = 0
        self._rebuild()

    def push_repos(self, username: str):
        self.status = f"Loading repos for {username}…"
        self.error = ""
        self._draw()
        pygame.display.flip()

        repos, err = list_user_repos(username)
        if err:
            self.error = err
            self.status = ""
            self._rebuild()
            return

        self.stack.append({
            "kind": "repos",
            "user": username,
            "repos": repos,
        })
        self.focus = 0
        self.scroll = 0
        self.status = ""
        self._rebuild()

    def push_contents(self, owner: str, repo: str, path: str = "", ref: str = "main"):
        self.status = "Loading…"
        self.error = ""
        self._draw()
        pygame.display.flip()

        items, err = list_contents(owner, repo, path, ref)
        if err:
            self.error = err
            self.status = ""
            self._rebuild()
            return

        self.stack.append({
            "kind": "contents",
            "owner": owner,
            "repo": repo,
            "path": path,
            "ref": ref,
            "items": items,
        })
        self.focus = 0
        self.scroll = 0
        self.status = ""
        self._rebuild()

    def pop(self):
        if len(self.stack) > 1:
            self.stack.pop()
            self.focus = 0
            self.scroll = 0
            self.error = ""
            self.status = ""
            self._rebuild()

    # ---- rebuild button list for current screen --------------------------

    def _rebuild(self):
        self.buttons = []
        screen = self.stack[-1]
        kind = screen["kind"]

        y = 90
        btn_h = 52
        gap = 8
        margin = 24
        w = WIDTH - margin * 2

        if kind == "home":
            self.buttons.append(Button(
                pygame.Rect(margin, y, w, btn_h),
                f"Open {DEFAULT_USER}",
                data=("open_user", DEFAULT_USER),
            ))
            y += btn_h + gap
            self.buttons.append(Button(
                pygame.Rect(margin, y, w, btn_h),
                "Enter username…",
                data=("enter_user", None),
            ))

        elif kind == "repos":
            for repo in screen["repos"]:
                label = repo["name"]
                if repo["description"]:
                    label = f"{repo['name']}  –  {repo['description'][:40]}"
                self.buttons.append(Button(
                    pygame.Rect(margin, y, w, btn_h),
                    label,
                    data=("open_repo", repo),
                ))
                y += btn_h + gap

        elif kind == "contents":
            if screen["path"]:
                self.buttons.append(Button(
                    pygame.Rect(margin, y, w, btn_h),
                    ".. (up)",
                    data=("up", None),
                ))
                y += btn_h + gap

            for item in screen["items"]:
                if item["type"] == "dir":
                    label = f"[DIR]  {item['name']}"
                else:
                    label = f"[ROM]  {item['name']}  ({format_size(item['size'])})"
                self.buttons.append(Button(
                    pygame.Rect(margin, y, w, btn_h),
                    label,
                    data=("item", item),
                ))
                y += btn_h + gap

        if self.buttons:
            self.focus = max(0, min(self.focus, len(self.buttons) - 1))
        else:
            self.focus = 0

    # ---- drawing ---------------------------------------------------------

    def _draw(self):
        self.screen.fill(BG)

        # Header bar
        pygame.draw.rect(self.screen, SURFACE, (0, 0, WIDTH, 64))
        pygame.draw.line(self.screen, SIGNAL, (0, 64), (WIDTH, 64), 3)

        title = self.font_title.render("GitROMs", True, SIGNAL)
        self.screen.blit(title, (24, 16))

        screen = self.stack[-1]
        subtitle = ""
        if screen["kind"] == "home":
            subtitle = "GitHub ROM Browser"
        elif screen["kind"] == "repos":
            subtitle = f"{screen['user']} / repositories"
        elif screen["kind"] == "contents":
            p = screen["path"] or "/"
            subtitle = f"{screen['owner']}/{screen['repo']}  {p}"

        sub = self.font_small.render(subtitle, True, MUTED)
        self.screen.blit(sub, (24, 44))

        # Status / error
        if self.status:
            s = self.font_small.render(self.status, True, SIGNAL)
            self.screen.blit(s, (24, HEIGHT - 36))
        if self.error:
            e = self.font_small.render(self.error[:80], True, (220, 80, 80))
            self.screen.blit(e, (24, HEIGHT - 36))

        # Help bar
        help_text = "D-pad move   A select   B back"
        h = self.font_small.render(help_text, True, MUTED)
        self.screen.blit(h, (WIDTH - h.get_width() - 16, HEIGHT - 36))

        if not self.buttons:
            empty = self.font.render("No items", True, MUTED)
            self.screen.blit(empty, (24, 120))
            return

        top = 80
        bottom = HEIGHT - 50

        focused_btn = self.buttons[self.focus]
        if focused_btn.rect.bottom - self.scroll > bottom:
            self.scroll = focused_btn.rect.bottom - bottom
        if focused_btn.rect.top - self.scroll < top:
            self.scroll = focused_btn.rect.top - top
        self.scroll = max(0, self.scroll)

        for i, btn in enumerate(self.buttons):
            r = btn.rect.move(0, -self.scroll)
            if r.bottom < top or r.top > bottom:
                continue
            btn.draw(self.screen, self.font, i == self.focus, self.scroll)

    # ---- input -----------------------------------------------------------

    def _activate(self):
        if not self.buttons:
            return
        btn = self.buttons[self.focus]
        action, data = btn.data

        if action == "open_user":
            self.push_repos(data)
        elif action == "enter_user":
            self.push_repos(DEFAULT_USER)
        elif action == "open_repo":
            repo = data
            owner, name = repo["full_name"].split("/", 1)
            self.push_contents(owner, name, "", repo["default_branch"])
        elif action == "up":
            screen = self.stack[-1]
            path = screen["path"]
            parent = "/".join(path.split("/")[:-1]) if path else ""
            self.stack.pop()
            self.push_contents(screen["owner"], screen["repo"], parent, screen["ref"])
        elif action == "item":
            item = data
            screen = self.stack[-1]
            if item["type"] == "dir":
                self.push_contents(screen["owner"], screen["repo"], item["path"], screen["ref"])
            else:
                self._download(item)

    def _download(self, item: Dict):
        if not item.get("download_url"):
            self.error = "No download URL"
            return

        system = system_for_filename(item["name"])
        dest_dir = os.path.join(self.rom_root, system)
        os.makedirs(dest_dir, exist_ok=True)
        dest = os.path.join(dest_dir, item["name"])

        self.status = f"Downloading {item['name']} → {system}/ …"
        self.error = ""
        self._draw()
        pygame.display.flip()

        err = download_file(item["download_url"], dest)
        if err:
            self.error = f"Download failed: {err}"
            self.status = ""
        else:
            self.status = f"Saved to {system}/{item['name']}"
            self.error = ""
        self._rebuild()

    # ---- main loop -------------------------------------------------------

    def run(self):
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key in (pygame.K_ESCAPE, pygame.K_b):
                        if len(self.stack) > 1:
                            self.pop()
                        else:
                            running = False
                    elif event.key in (pygame.K_UP, pygame.K_w):
                        if self.buttons:
                            self.focus = (self.focus - 1) % len(self.buttons)
                    elif event.key in (pygame.K_DOWN, pygame.K_s):
                        if self.buttons:
                            self.focus = (self.focus + 1) % len(self.buttons)
                    elif event.key in (pygame.K_RETURN, pygame.K_SPACE, pygame.K_a, pygame.K_z):
                        self._activate()
                elif event.type == pygame.JOYBUTTONDOWN:
                    if event.button == 0:  # A
                        self._activate()
                    elif event.button == 1:  # B
                        if len(self.stack) > 1:
                            self.pop()
                        else:
                            running = False
                elif event.type == pygame.JOYHATMOTION:
                    x, y = event.value
                    if y == 1 and self.buttons:
                        self.focus = (self.focus - 1) % len(self.buttons)
                    elif y == -1 and self.buttons:
                        self.focus = (self.focus + 1) % len(self.buttons)

            self._draw()
            pygame.display.flip()
            self.clock.tick(FPS)

        pygame.quit()


if __name__ == "__main__":
    pygame.joystick.init()
    if pygame.joystick.get_count() > 0:
        js = pygame.joystick.Joystick(0)
        js.init()

    app = App()
    app.run()
