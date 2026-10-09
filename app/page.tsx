'use client'

import { useRef } from 'react'
import { Backdrop } from '@/components/intro/Backdrop'
import { CornerBrackets } from '@/components/intro/CornerBrackets'
import { Loader } from '@/components/intro/Loader'
import { Hero } from '@/components/hero/Hero'
import { AboutSection } from '@/components/about/AboutSection'
import { Console } from '@/components/console/Console'
import { WorkSection } from '@/components/work/WorkSection'
import { ContactSection } from '@/components/contact/ContactSection'

export default function Home() {
  const replayRef = useRef<(() => void) | null>(null)

  return (
    <>
      <Loader onReplayRegister={(fn) => { replayRef.current = fn }} />
      <Backdrop />
      <CornerBrackets />

      <main>
        <Hero onReplay={() => replayRef.current?.()} />
        <AboutSection />
        <Console />
        <WorkSection />
        <ContactSection />
      </main>
    </>
  )
}
