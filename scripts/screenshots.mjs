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

    // b) Hero revealed & full page order
    {
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)
      await shot(page, vp, 'b-hero')
      await page.screenshot({ path: path.join(cfg.out, `${vp.name}-order-fullpage.png`), fullPage: true })

      if (!vp.mobile) {
        await page.mouse.move(900, 500)
        await sleep(600)
        await shot(page, vp, 'b2-crosshair')
      }
      await context.close()
    }

    // c) Work list & Stage-start transition captures
    {
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)
      await scrollToSection(page, 'work')

      const listShotName = vp.mobile ? 'd0-work-list' : 'c0-work-list'
      await shot(page, vp, listShotName)

      // Hover row 01 on desktop to capture ▶ marker
      if (!vp.mobile) {
        const row1 = await page.locator(`${cfg.row}:nth-child(1)`).boundingBox()
        if (row1) {
          await page.mouse.move(row1.x + row1.width * 0.35, row1.y + row1.height / 2)
          await sleep(250)
          await shot(page, vp, 'c0-row-hover')
        }
      }

      // Click row 01 to start arcade stage transition
      const rowTarget = page.locator(`${cfg.row}:nth-child(1)`)
      const prefix = vp.mobile ? 'd' : 'c'

      // Click and capture at +150ms (COVER), +450ms (HOLD start), +800ms (HOLD midway)
      if (vp.mobile) {
        await rowTarget.tap()
      } else {
        await rowTarget.click()
      }

      await sleep(150)
      await shot(page, vp, `${prefix}1-stage-cover`)

      await sleep(300) // 150 + 300 = 450ms
      await shot(page, vp, `${prefix}2-stage-hold`)

      await sleep(350) // 450 + 350 = 800ms
      await shot(page, vp, `${prefix}3-stage-loading`)

      // Wait for transition completion (HOLD 500ms + REVEAL 450ms)
      await page.waitForURL('**/work/ai-candidate-evaluation', { timeout: 4000 })
      await page.waitForSelector('.stage-transition-overlay', { state: 'hidden', timeout: 3000 })
      await sleep(300)
      await shot(page, vp, `${prefix}4-stage-done`)

      // Assert overlay is unmounted/hidden and body scroll is restored
      const bodyOverflow = await page.evaluate(() => document.body.style.overflow)
      if (bodyOverflow !== '') {
        throw new Error(`Expected body overflow to be restored, got "${bodyOverflow}"`)
      }

      // Assert focus moved to h1 on the new page
      const focusedTag = await page.evaluate(() => document.activeElement?.tagName)
      if (focusedTag !== 'H1') {
        console.warn(`Expected focus on H1, got ${focusedTag}`)
      }

      await context.close()
    }

    if (!vp.mobile) {
      // Interactive Playwright checks on desktop
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)
      await scrollToSection(page, 'work')

      // Check 1: ctrl-click does not show transition overlay
      const [ctrlNewPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator(`${cfg.row}:nth-child(2)`).click({ modifiers: ['Control'] }),
      ])
      await ctrlNewPage.waitForLoadState('domcontentloaded')
      const isOverlayActiveOnCtrl = await page.evaluate(() => {
        const el = document.querySelector('.stage-transition-overlay')
        return el && getComputedStyle(el).display !== 'none'
      })
      if (isOverlayActiveOnCtrl) {
        throw new Error('ctrl-click triggered transition overlay!')
      }
      await ctrlNewPage.close()
      await sleep(500)

      // Check 2: middle-click does not show transition overlay
      const [midNewPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 8000 }),
        page.locator(`${cfg.row}:nth-child(2)`).click({ button: 'middle' }),
      ])
      await midNewPage.waitForLoadState('domcontentloaded')
      const isOverlayActiveOnMid = await page.evaluate(() => {
        const el = document.querySelector('.stage-transition-overlay')
        return el && getComputedStyle(el).display !== 'none'
      })
      if (isOverlayActiveOnMid) {
        throw new Error('middle-click triggered transition overlay!')
      }
      await midNewPage.close()

      // Check 3: keyboard Enter on focused row plays transition
      const row3 = page.locator(`${cfg.row}:nth-child(3)`)
      await row3.focus()
      await row3.press('Enter')
      await sleep(150)
      const overlayOnEnter = await page.evaluate(() => {
        const el = document.querySelector('.stage-transition-overlay')
        return el && getComputedStyle(el).display !== 'none'
      })
      if (!overlayOnEnter) {
        throw new Error('Keyboard Enter on focused row failed to trigger transition!')
      }
      await page.waitForURL('**/work/secure-multi-tenant-platform', { timeout: 4000 })
      await page.waitForSelector('.stage-transition-overlay', { state: 'hidden', timeout: 3000 })

      // Check 4: going Back returns to list without transition
      await page.goBack()
      await page.waitForURL(cfg.url)
      const overlayOnBack = await page.evaluate(() => {
        const el = document.querySelector('.stage-transition-overlay')
        return el && getComputedStyle(el).display !== 'none'
      })
      if (overlayOnBack) {
        throw new Error('Browser Back button unexpectedly triggered transition!')
      }

      // Check 5: double-click does not throw or double-trigger
      await scrollToSection(page, 'work')
      const row1 = page.locator(`${cfg.row}:nth-child(1)`)
      await row1.dblclick()
      await page.waitForURL('**/work/ai-candidate-evaluation', { timeout: 4000 })
      await page.waitForSelector('.stage-transition-overlay', { state: 'hidden', timeout: 3000 })
      await page.goBack()
      await page.waitForURL(cfg.url)
      await sleep(500)

      // f) About section
      await scrollToSection(page, 'about')
      await sleep(800)
      await shot(page, vp, 'f-about')

      // k) Console section tests & captures
      await scrollToSection(page, 'console')
      await sleep(600)
      await shot(page, vp, 'k0-console-onload')

      const consoleInput = page.locator('#console input.console-input')
      const screenPanel = page.locator('#console .console-screen')

      // Verify clicking screen does not scroll page
      const scrollBeforeClick = await page.evaluate(() => window.scrollY)
      await screenPanel.click({ position: { x: 50, y: 50 } })
      const scrollAfterClick = await page.evaluate(() => window.scrollY)
      if (Math.abs(scrollBeforeClick - scrollAfterClick) > 5) {
        throw new Error('Clicking console screen unexpectedly scrolled the page!')
      }

      // 1. run 'help'
      await consoleInput.fill('help')
      await consoleInput.press('Enter')
      await sleep(700)
      await shot(page, vp, 'k1-console-help')

      // 2. run 'cat 01'
      await consoleInput.fill('cat 01')
      await consoleInput.press('Enter')
      await sleep(700)
      await shot(page, vp, 'k2-console-cat')

      // 3. run unknown command with typo distance <= 2
      await consoleInput.fill('helpp')
      await consoleInput.press('Enter')
      await sleep(400)
      await shot(page, vp, 'k3-console-unknown')

      // 4. Verify Tab autocomplete & history with ArrowUp/Down
      await consoleInput.fill('cat ra')
      await consoleInput.press('Tab')
      const completedVal = await consoleInput.inputValue()
      if (!completedVal.includes('rag-document-qa-api')) {
        console.warn('Tab autocomplete for cat rag expected rag-document-qa-api, got:', completedVal)
      }
      await consoleInput.fill('')
      await consoleInput.press('ArrowUp')
      const histVal = await consoleInput.inputValue()
      if (!histVal) {
        console.warn('History navigation with ArrowUp expected a value!')
      }

      // 5. Test 'hiscores' before unlock (should be unknown)
      await consoleInput.fill('hiscores')
      await consoleInput.press('Enter')
      await sleep(300)

      // 6. Test 'sudo hire soliman'
      await consoleInput.fill('sudo hire soliman')
      await consoleInput.press('Enter')
      await sleep(700)

      // 7. Test 'cat 9'
      await consoleInput.fill('cat 9')
      await consoleInput.press('Enter')
      await sleep(300)

      // 8. Test 'clear'
      await consoleInput.fill('clear')
      await consoleInput.press('Enter')
      await sleep(200)

      // 9. Test Esc blur
      await consoleInput.fill('some text')
      await consoleInput.press('Escape')
      const isFocused = await page.evaluate(() => document.activeElement === document.querySelector('#console input.console-input'))
      if (isFocused) {
        console.warn('Expected input to be blurred after Escape!')
      }

      // 10. Konami code sequence
      await page.keyboard.press('ArrowUp')
      await page.keyboard.press('ArrowUp')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('b')
      await page.keyboard.press('a')
      await sleep(400)
      await shot(page, vp, 'k4-console-konami')

      // 11. Run unlocked 'hiscores'
      await consoleInput.fill('hiscores')
      await consoleInput.press('Enter')
      await sleep(700)
      await shot(page, vp, 'k5-console-hiscores')

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

      // h) Desktop project page capture
      if (target === 'app') {
        const { context: projContext, page: projPage } = await newPage(browser, vp)
        await projPage.goto(new URL('work/ai-candidate-evaluation', cfg.url).href, { waitUntil: 'load' })
        await projPage.evaluate(() => document.fonts.ready)
        await sleep(800)
        await shot(projPage, vp, 'h-project-desktop')

        // Move pointer across the green dithered frame band
        const article = await projPage.locator('article').boundingBox()
        if (article) {
          await projPage.mouse.move(article.x - 20, article.y + 80)
          await projPage.mouse.move(article.x - 6, article.y + 140, { steps: 8 })
          await projPage.mouse.move(article.x + 16, article.y + 200, { steps: 8 })
          await sleep(300)
          await shot(projPage, vp, 'h2-project-ripple')
        }

        await projContext.close()
      }

      // e) Reduced motion captures: asserts NO overlay and navigation still happens
      {
        const { context: rmContext, page: rmPage } = await newPage(browser, vp, {
          reducedMotion: 'reduce',
        })
        await rmPage.goto(cfg.url, { waitUntil: 'load' })
        await rmPage.evaluate(() => document.fonts.ready)
        await sleep(400)
        await scrollToSection(rmPage, 'console')
        await sleep(400)
        await shot(rmPage, vp, 'k-console-reduced')

        await scrollToSection(rmPage, 'work')
        const rmRow1 = rmPage.locator(`${cfg.row}:nth-child(1)`)
        await rmRow1.click()
        // In reduced motion, overlay is NEVER shown
        const overlayVisible = await rmPage.evaluate(() => {
          const el = document.querySelector('.stage-transition-overlay')
          return el && getComputedStyle(el).display !== 'none'
        })
        if (overlayVisible) {
          throw new Error('Reduced motion mode unexpectedly displayed transition overlay!')
        }
        await rmPage.waitForURL('**/work/ai-candidate-evaluation')
        await sleep(300)
        await shot(rmPage, vp, 'e-stage-reduced')

        await rmPage.goto(cfg.url)
        await scrollToSection(rmPage, 'contact')
        await sleep(400)
        await shot(rmPage, vp, 'e-contact-reduced')

        await rmContext.close()
      }
    } else {
      // Mobile additional tests
      const { context, page } = await newPage(browser, vp)
      await page.goto(cfg.url, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await sleep(SETTLE_MS)

      // f) Mobile About section
      await scrollToSection(page, 'about')
      await sleep(800)
      await shot(page, vp, 'f-about')

      // k) Mobile Console section with chips
      await scrollToSection(page, 'console')
      await sleep(800)
      await shot(page, vp, 'k-console-mobile')

      // g) Mobile Contact screen
      await scrollToSection(page, 'contact')
      await sleep(1000)
      await shot(page, vp, 'g-contact')

      await context.close()

      // h) Mobile project page
      if (target === 'app') {
        const { context: mProjContext, page: mProjPage } = await newPage(browser, vp)
        await mProjPage.goto(new URL('work/ai-candidate-evaluation', cfg.url).href, { waitUntil: 'load' })
        await mProjPage.evaluate(() => document.fonts.ready)
        await sleep(800)
        await shot(mProjPage, vp, 'h-project-mobile')
        await mProjContext.close()
      }
    }
  }

  await browser.close()
  console.log(`saved to ${path.relative(root, cfg.out)}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
