import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Work from '@/sections/Work'
import Approach from '@/sections/Approach'
import Stack from '@/sections/Stack'
import Contact from '@/sections/Contact'

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Work />
        <Approach />
        <Stack />
      </main>
      <Contact />
    </>
  )
}
