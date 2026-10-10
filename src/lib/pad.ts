/** R36S sticks often rest well above a small deadzone. */
export const STICK_DEAD = 0.55;

export function stickAxis(value: number) {
  if (Math.abs(value) < STICK_DEAD) return 0;
  return Math.sign(value) * ((Math.abs(value) - STICK_DEAD) / (1 - STICK_DEAD));
}

function down(pad: Gamepad, index: number) {
  const button = pad.buttons[index];
  return !!button && (button.pressed || button.value > 0.5);
}

export type PadState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  a: boolean;
  b: boolean;
  l: boolean;
  r: boolean;
  l3: boolean;
  r3: boolean;
  lx: number;
  ly: number;
};

function hatAxis(value: number) {
  if (!(value >= 0) || value > 1) return null;
  const step = Math.round(value * 7);
  if (step === 7 || step === 0) return "up";
  if (step === 1 || step === 2) return "right";
  if (step === 3 || step === 4) return "down";
  if (step === 5 || step === 6) return "left";
  return null;
}

export function readPad(pad: Gamepad): PadState {
  let up = down(pad, 12);
  let downB = down(pad, 13);
  let left = down(pad, 14);
  let right = down(pad, 15);
  if (!up && !downB && !left && !right) {
    const hat = hatAxis(pad.axes[9] ?? -1);
    up = hat === "up";
    downB = hat === "down";
    left = hat === "left";
    right = hat === "right";
  }
  return {
    up,
    down: downB,
    left,
    right,
    a: down(pad, 0),
    b: down(pad, 1),
    l: down(pad, 4),
    r: down(pad, 5),
    l3: down(pad, 10),
    r3: down(pad, 11),
    lx: stickAxis(pad.axes[0] ?? 0),
    ly: stickAxis(pad.axes[1] ?? 0),
  };
}
