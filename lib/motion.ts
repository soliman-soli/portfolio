/**
 * Every timing, easing and motion-related number used by the page, ported
 * 1:1 from reference/original.html. CSS-side timings live as tokens in
 * app/globals.css; values that JavaScript needs live here.
 * Keep the two in sync if you ever change one.
 */

/* ---------- loader (boot sequence) ---------- */

/** Duration of the 000% to 100% count. */
export const LOADER_COUNT_MS = 1900
/** Pause on 100% before the overlay slides up. */
export const LOADER_HOLD_MS = 260
/**
 * Delay between the slide-up starting and the hero reveal (`data-intro="ready"`).
 * The slide itself takes 900ms (CSS token --dur-loader-slide).
 */
export const LOADER_REVEAL_DELAY_MS = 450

/** Status lines: shown once the counter reaches `at` percent. */
export const LOADER_STEPS = [
  { at: 0, msg: 'booting interface...' },
  { at: 35, msg: 'loading projects...' },
  { at: 70, msg: 'compiling styles...' },
  { at: 95, msg: 'ready.' },
] as const

/** Counter is zero-padded to this many digits ("007"). */
export const LOADER_DIGITS = 3

/** Standard easeInOutCubic, t in [0, 1]. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/* ---------- crosshair ---------- */

/** Readout offset from the cursor, in px (both axes). */
export const CROSSHAIR_READOUT_OFFSET = 14
/** Coordinates are zero-padded to this many digits ("x 0042"). */
export const CROSSHAIR_DIGITS = 4

/* ---------- floating preview ---------- */

/** Fraction of the remaining distance the card covers each frame. */
export const PREVIEW_LERP = 0.16
/** Card sits this far right of the cursor. */
export const PREVIEW_OFFSET_X = 28
/** Card sits this far above the cursor. */
export const PREVIEW_OFFSET_Y = -90
/** Keep the card at least this far from the right edge (~340px card + 24px gap). */
export const PREVIEW_RIGHT_CLEARANCE = 368
/** Minimum distance from the top of the viewport. */
export const PREVIEW_TOP_MIN = 12
/** Keep the card's top at least this far above the bottom edge. */
export const PREVIEW_BOTTOM_CLEARANCE = 440

/* ---------- arcade cabinet ---------- */

/** CRT power-on duration (0-180ms). */
export const ARCADE_POWERON_MS = 180
/** INSERT COIN blinking duration (180-800ms = 620ms). */
export const ARCADE_COIN_MS = 620
/** PLAYER 1 READY flash duration (800-1100ms = 300ms). */
export const ARCADE_READY_MS = 300
/** Total boot time until stage screen starts revealing. */
export const ARCADE_BOOT_TOTAL_MS = 1100
/** Stagger per stage screen line. */
export const ARCADE_STAGGER_MS = 60
/** Glitch hop swap duration when hopping between rows. */
export const ARCADE_GLITCH_MS = 250

/* ---------- work list ---------- */

/** IntersectionObserver threshold for the row rise-in. */
export const ROW_REVEAL_THRESHOLD = 0.2
