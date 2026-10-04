// Captures the reference states used to compare the rebuild against the
// original prototype.
//
//   node scripts/screenshots.mjs original   -> reference/baseline/
//   node scripts/screenshots.mjs app        -> reference/current/   (needs `pnpm dev` or `pnpm start` on :3000)
//
// States per viewport:
//   a-loader     loader frozen at ~50% (fake clock: easeInOutCubic hits 0.5 at t = 950ms)
//   b-hero       hero fully revealed, no mouse
//   b2-crosshair hero with the mouse parked (desktop only)
//   c-hover      work list, row 2 hovered with a mouse (desktop only)
//   d-expanded   work list, row 1 tapped open (mobile only, hover: none)
//   e-reduced    hero with prefers-reduced-motion (desktop only)
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const target = process.argv[2] ?? 'original'

const TARGETS = {
  original: {
    url: pathToFileURL(path.join(root, 'reference', 'original.html')).href,
    out: path.join(root, 'reference', 'baseline'),
    row: '#list > .row',
  },
  app: {
    url: process.env.APP_URL ?? 'http://localhost:3000/',
    out: path.join(root, 'reference', 'current'),
    row: '#work [data-row]',
  },
}

const cfg = TARGETS[target]
if (!cfg) throw new Error(`unknown target "${target}"`)

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
]

// Long enough for loader (1900 + 260 + 450) plus the slowest reveal (~2.3s).
const SETTLE_MS = 5400

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function newPage(browser, vp, extra = {}) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    ...extra,
  })
  return { context, page: await context.newPage() }
}

async function scrollToWork(page, rowSel) {
  await page.evaluate(() => {
    const el = document.getElementById('work')
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
  })
  // let IntersectionObserver fire and the staggered rise finish (3*90ms + 900ms)
  await page.waitForSelector(`${rowSel}:nth-child(4)`)
  await sleep(1600)
}

async function run() {
  await mkdir(cfg.out, { recursive: true })
  const browser = await chromium.launch()
  const shot = (page, vp, name) =>
    page.screenshot({ path: path.join(cfg.out, `${vp.name}-${name}.png`) })

  for (const vp of VIEWPORTS) {
    // a) loader at ~50%
    {
      const { context, page } = await newPage(browser, vp)
      await page.clock.install({ time: 0 })
      await page.clock.pauseAt(1000)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await page.clock.runFor(950)
      await shot(page, vp, 'a-loader')
      await context.close()
    }

    // b) hero revealed
    {
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)
      await shot(page, vp, 'b-hero')

      if (!vp.mobile) {
        await page.mouse.move(900, 500)
        await sleep(600)
        await shot(page, vp, 'b2-crosshair')
      }
      await context.close()
    }

    if (!vp.mobile) {
      // c) row 2 hovered
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)
      await scrollToWork(page, cfg.row)
      const box = await page.locator(`${cfg.row}:nth-child(2)`).boundingBox()
      await page.mouse.move(box.x + box.width * 0.35, box.y + box.height / 2, { steps: 8 })
      await sleep(900)
      await shot(page, vp, 'c-hover')
      await context.close()
    } else {
      // d) row 1 expanded by tap
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)
      await scrollToWork(page, cfg.row)
      await page.locator(`${cfg.row}:nth-child(1)`).tap()
      await sleep(400)
      await shot(page, vp, 'd-expanded')
      await context.close()
    }

    if (!vp.mobile) {
      // e) reduced motion: no loader, everything visible immediately
      const { context, page } = await newPage(browser, vp, { reducedMotion: 'reduce' })
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(300)
      await shot(page, vp, 'e-reduced')
      await context.close()
    }
  }

  await browser.close()
  console.log(`saved to ${path.relative(root, cfg.out)}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
