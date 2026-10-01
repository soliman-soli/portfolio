import Reveal from '@/components/Reveal'
import Button from '@/components/Button'
import FloatingIsland from '@/components/islands/FloatingIsland'
import { profile } from '@/data/profile'

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/** Waving flag island variant - a server island with a flag on top */
function FlagIsland() {
  return (
    <div className="relative inline-block w-[200px]">
      <FloatingIsland variant="automation" size="md" alt />
      {/* Overlaid waving flag */}
      <div
        className="absolute top-[20%] left-[48%] pointer-events-none"
        aria-hidden="true"
      >
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          {/* Flagpole */}
          <line x1="4" y1="0" x2="4" y2="32" stroke="var(--brass)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Flag cloth */}
          <rect
            className="flag-cloth"
            x="4"
            y="2"
            width="22"
            height="13"
            rx="1"
            fill="var(--brass)"
            opacity="0.9"
          />
          {/* Tiny stripes on flag */}
          <line x1="4" y1="7" x2="26" y2="7" stroke="var(--paper)" strokeWidth="1" opacity="0.5" />
          <line x1="4" y1="11" x2="26" y2="11" stroke="var(--paper)" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="section-padding relative overflow-hidden"
      >
        {/* Background fill */}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'var(--emerald-deep)' }}
          aria-hidden="true"
        />

        {/* Decorative island */}
        <div
          className="absolute right-[6%] top-[8%] hidden lg:block z-0 pointer-events-none"
          aria-hidden="true"
        >
          <FlagIsland />
        </div>

        <div className="container-main relative z-10">
          <Reveal>
            <p className="mono-label mb-4" style={{ color: 'var(--brass)' }}>
              {'04 \u2014 Contact'}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              id="contact-heading"
              className="
                font-serif
                text-[clamp(2.25rem,5vw,4.5rem)]
                font-semibold leading-tight tracking-tight
                mb-8
              "
              style={{ color: 'var(--ivory)' }}
            >
              Let&apos;s build something<br />
              that runs itself.
            </h2>
          </Reveal>

          <Reveal delay={0.2} className="flex flex-wrap gap-4 items-center">
            <Button
              href={`mailto:${profile.email}`}
              variant="primary"
              size="lg"
              className="!bg-[var(--brass)] !text-[var(--emerald-deep)] hover:!bg-[var(--brass-soft)]"
            >
              {profile.email}
            </Button>

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="
                flex items-center gap-2
                px-6 py-3 rounded-[8px]
                border border-[var(--brass-soft)]/50
                text-[var(--brass-soft)] text-sm
                hover:border-[var(--brass)] hover:text-[var(--brass)]
                transition-all duration-250 ease-arch
                focus-visible:ring-2 focus-visible:ring-[var(--brass)]
              "
            >
              <GithubIcon />
              GitHub
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="
                flex items-center gap-2
                px-6 py-3 rounded-[8px]
                border border-[var(--brass-soft)]/50
                text-[var(--brass-soft)] text-sm
                hover:border-[var(--brass)] hover:text-[var(--brass)]
                transition-all duration-250 ease-arch
                focus-visible:ring-2 focus-visible:ring-[var(--brass)]
              "
            >
              <LinkedInIcon />
              LinkedIn
            </a>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer
        role="contentinfo"
        style={{
          background: 'var(--emerald-deep)',
          borderTop: '1px solid rgba(176, 141, 87, 0.2)',
        }}
      >
        <div className="container-main py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs font-mono text-[var(--brass-soft)]">
            <span className="opacity-60">© {new Date().getFullYear()} Soliman. All rights reserved.</span>
            <a
              href={`mailto:${profile.email}`}
              className="opacity-80 hover:opacity-100 hover:text-[var(--brass)] transition-colors underline-offset-4 hover:underline"
            >
              {profile.email}
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="
                flex items-center gap-2 text-xs font-mono
                text-[var(--brass-soft)] opacity-80
                hover:opacity-100 hover:text-[var(--brass)]
                transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-[var(--brass)]
              "
            >
              <GithubIcon />
              <span>GitHub</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="
                flex items-center gap-2 text-xs font-mono
                text-[var(--brass-soft)] opacity-80
                hover:opacity-100 hover:text-[var(--brass)]
                transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-[var(--brass)]
              "
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
            <a
              href="#top"
              className="
                font-mono text-xs text-[var(--brass-soft)] opacity-60
                hover:opacity-100 hover:text-[var(--brass)]
                transition-all duration-250 ease-arch
                focus-visible:ring-2 focus-visible:ring-[var(--brass)]
                ml-2
              "
            >
              ↑ Back to top
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
