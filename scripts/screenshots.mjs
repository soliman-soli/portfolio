// Captures reference and verification screenshots.
//
//   node scripts/screenshots.mjs original   -> reference/baseline/
//   node scripts/screenshots.mjs app        -> reference/current/   (needs local server running)
//
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const target = process.argv[2] ?? 'app'

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

async function scrollToSection(page, sectionId) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY,
        behavior: 'instant',
      })
    }
  }, sectionId)
  await sleep(1000)
}

async function run() {
  await mkdir(cfg.out, { recursive: true })
  const browser = await chromium.launch()
  const shot = (page, vp, name) =>
    page.screenshot({ path: path.join(cfg.out, `${vp.name}-${name}.png`) })

  for (const vp of VIEWPORTS) {
    // a) Loader at ~50%
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

    // b) Hero revealed
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
      // Desktop arcade cabinet tests
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)
      await scrollToSection(page, 'work')

      // c1) Cabinet at 1s after hovering row 01
      const row1 = await page.locator(`${cfg.row}:nth-child(1)`).boundingBox()
      if (row1) {
        await page.mouse.move(row1.x + row1.width * 0.35, row1.y + row1.height / 2, { steps: 8 })
        await sleep(1000)
        await shot(page, vp, 'c-cabinet-boot')

        // c2) Cabinet at +400ms after hopping to row 03 (glitch swap)
        const row3 = await page.locator(`${cfg.row}:nth-child(3)`).boundingBox()
        if (row3) {
          await page.mouse.move(row3.x + row3.width * 0.35, row3.y + row3.height / 2, { steps: 5 })
          await sleep(400)
          await shot(page, vp, 'c2-cabinet-hop')
        }
      }

      // f) About section
      await scrollToSection(page, 'about')
      await sleep(800)
      await shot(page, vp, 'f-about')

      // g1) Contact screen before inserting coin
      await scrollToSection(page, 'contact')
      await sleep(1200)
      await shot(page, vp, 'g-contact-before')

      // g2) Contact screen after inserting coin
      const coinBtn = page.locator('#contact button.arcade-coin-btn')
      if (await coinBtn.count()) {
        await coinBtn.click()
        await sleep(900)
        await shot(page, vp, 'g2-contact-after')
      }

      await context.close()

      // e) Reduced motion captures: cabinet + contact section
      {
        const { context: rmContext, page: rmPage } = await newPage(browser, vp, {
          reducedMotion: 'reduce',
        })
        await rmPage.goto(cfg.url, { waitUntil: 'load' })
        await rmPage.evaluate(() => document.fonts.ready)
        await sleep(400)
        await scrollToSection(rmPage, 'work')
        const rmRow1 = await rmPage.locator(`${cfg.row}:nth-child(1)`).boundingBox()
        if (rmRow1) {
          await rmPage.mouse.move(rmRow1.x + rmRow1.width * 0.35, rmRow1.y + rmRow1.height / 2)
          await sleep(500)
          await shot(rmPage, vp, 'e2-cabinet-reduced')
        }
        await scrollToSection(rmPage, 'contact')
        await sleep(400)
        await shot(rmPage, vp, 'e-contact-reduced')
        await rmContext.close()
      }
    } else {
      // Mobile tests
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)

      // d) Mobile expanded row
      await scrollToSection(page, 'work')
      await page.waitForSelector(`${cfg.row}:nth-child(4)`)
      await sleep(1600)
      await page.locator(`${cfg.row}:nth-child(1)`).tap()
      // Let mobile stage screen boot animation complete
      await sleep(1000)
      await shot(page, vp, 'd-expanded')

      // f) Mobile About section
      await scrollToSection(page, 'about')
      await sleep(800)
      await shot(page, vp, 'f-about')

      // g) Mobile Contact screen
      await scrollToSection(page, 'contact')
      await sleep(1000)
      await shot(page, vp, 'g-contact')

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
