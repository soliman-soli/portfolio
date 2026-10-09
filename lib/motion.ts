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

/** Standard easeOutCubic, t in [0, 1]. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/* ---------- crosshair ---------- */

/** Readout offset from the cursor, in px (both axes). */
export const CROSSHAIR_READOUT_OFFSET = 14
/** Coordinates are zero-padded to this many digits ("x 0042"). */
export const CROSSHAIR_DIGITS = 4
/** Fade duration for the crosshair marker entering/exiting hero (~150ms). */
export const CROSSHAIR_FADE_MS = 150

/* ---------- arcade stage start transition ---------- */

/** Circular dithered wipe duration covering the screen (ms). */
export const STAGE_COVER_MS = 450
/** Minimum hold duration on the loading stage screen (ms). */
export const STAGE_HOLD_MIN_MS = 500
/** Fail-safe timeout to remove overlay and fallback (ms). */
export const STAGE_FAILSAFE_MS = 4000
/** Dithered reveal / contraction duration (ms). */
export const STAGE_REVEAL_MS = 450
/** Canvas dot size on desktop in px. */
export const STAGE_DOT_DESKTOP = 8
/** Canvas dot size on narrow viewports in px. */
export const STAGE_DOT_NARROW = 6
/** Width of the dithered leading edge band in px. */
export const STAGE_BAND_WIDTH = 120
/** Number of segments in the loading bar. */
export const STAGE_BAR_SEGMENTS = 10

/* ---------- animated dithered frame & water ripple ---------- */

/** Frame rate for the Bayer dither noise animation (~12-15 fps). */
export const DITHER_FPS = 14
/** Time multiplier for slow organic drifting noise. */
export const DITHER_SPEED = 0.0012
/** Size of each canvas dot in CSS px (rendered at low-res and scaled up). */
export const DITHER_DOT_SIZE = 3.5
/** Row hop brightness boost duration in ms. */
export const DITHER_HOP_BOOST_MS = 200
/** Row hop field value boost (+0.2). */
export const DITHER_HOP_BOOST = 0.2

/** Damping factor for 2D wave simulation (~0.965; ripples live ~1-1.5s). */
export const WAVE_DAMPING = 0.965
/** Multiplier converting pointer movement distance (px) into wave height. */
export const WAVE_K = 0.035
/** Maximum height injected per pointer movement event. */
export const WAVE_MAX = 0.8
/** Multiplier for click/tap pointerdown burst drop. */
export const WAVE_BURST_MULT = 2.5
/** Gain applied when adding wave height into the field before Bayer threshold. */
export const WAVE_GAIN = 0.42
/** Frame rate while ripples are active (~30 fps). */
export const WAVE_FPS_ACTIVE = 30
/** Frame rate when ripples are idle (~12-15 fps). */
export const WAVE_FPS_IDLE = 14
/** Radius (in dot cells) of energy injection footprint. */
export const WAVE_FOOTPRINT_RADIUS = 2
/** Margin (px) outside canvas bounding rect before ignoring pointer. */
export const WAVE_MARGIN_PX = 24
/** Activity threshold below which simulation drops back to idle fps. */
export const WAVE_ACTIVITY_THRESHOLD = 0.003

/* ---------- work list ---------- */

/** IntersectionObserver threshold for the row rise-in. */
export const ROW_REVEAL_THRESHOLD = 0.2

/* ---------- arcade console ---------- */

/** Stepped stagger delay between reveal lines (~25ms). */
export const CONSOLE_REVEAL_STAGGER_MS = 25
/** Maximum total duration for revealing a block of lines (~600ms). */
export const CONSOLE_REVEAL_MAX_MS = 600
/** Brightness flash duration on Konami code unlock (200ms). */
export const CONSOLE_FLASH_MS = 200
/** Maximum command history items stored in memory. */
export const CONSOLE_HISTORY_MAX = 50
