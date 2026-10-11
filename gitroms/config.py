# GitROMs configuration

# UI colors (dark theme + signal orange)
BG = (16, 18, 16)          # #101210
SURFACE = (24, 28, 24)     # slightly raised
RAISED = (35, 41, 36)      # #232924
FG = (231, 239, 228)       # #e7efe4
MUTED = (168, 181, 166)    # #a8b5a6
LINE = (49, 56, 50)        # #313832
SIGNAL = (230, 162, 60)    # #e6a23c
INK = (22, 19, 12)         # #16130c

# Screen (R36S is usually 640x480)
WIDTH = 640
HEIGHT = 480
FPS = 30

# Default GitHub user
DEFAULT_USER = "xenodorian"

# Only these extensions are ever shown or downloaded
ROM_EXTENSIONS = {
    ".nes", ".smc", ".sfc", ".gba", ".gbc", ".gb",
    ".md", ".gen", ".bin", ".sms", ".gg", ".pce",
    ".z64", ".n64", ".v64", ".nds",
    ".chd", ".pbp", ".iso", ".cso", ".cue",
    ".zip", ".7z",
}

# Map extension -> ArkOS rom folder name
# First match wins. zip/7z go to a generic place or we try to guess later.
EXT_TO_SYSTEM = {
    ".nes": "nes",
    ".smc": "snes",
    ".sfc": "snes",
    ".gba": "gba",
    ".gbc": "gbc",
    ".gb": "gb",
    ".md": "megadrive",
    ".gen": "megadrive",
    ".bin": "megadrive",      # common for Genesis; user can move if wrong
    ".sms": "mastersystem",
    ".gg": "gamegear",
    ".pce": "pcengine",
    ".z64": "n64",
    ".n64": "n64",
    ".v64": "n64",
    ".nds": "nds",
    ".chd": "psx",            # most common for CHD on this device
    ".pbp": "psx",
    ".iso": "psp",            # or dreamcast/psx – user can move
    ".cso": "psp",
    ".cue": "psx",
    ".zip": "arcade",         # safest default for zip
    ".7z": "arcade",
}

# Possible locations of the roms partition on ArkOS / R36S
ROM_ROOT_CANDIDATES = [
    "/roms",
    "/roms2",
    "/storage/roms",
    "/mnt/SDCARD/roms",
    "/mnt/sdcard/roms",
    "/media/roms",
    "/EASYROMS",
]

# GitHub API
GITHUB_API = "https://api.github.com"
USER_AGENT = "GitROMs-R36S/1.0"
# Optional: set a personal access token here later for higher rate limits
GITHUB_TOKEN = None
