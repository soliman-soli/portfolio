/**
 * Shared Bayer dithering matrix and threshold utilities.
 * Used by DitherFrame and StageTransition to guarantee unified visual language
 * without code duplication.
 */

/** 8x8 Bayer matrix normalized to [0, 1] */
export const BAYER_8 = new Float32Array([
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64))

/**
 * Returns normalized Bayer threshold [0, 1] for coordinate (x, y) wrapped modulo 8.
 */
export function bayerThreshold(x: number, y: number): number {
  return BAYER_8[(y & 7) * 8 + (x & 7)]
}
