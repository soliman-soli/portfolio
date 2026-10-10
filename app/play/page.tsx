import type { Metadata } from 'next'
import { Crt } from '@/components/arcade/Crt'
import { Game } from '@/components/arcade/Game'

export const metadata: Metadata = {
  title: 'Arcade Mini-Game | Soliman-OS v1.0',
  description: 'Retro side-scrolling arcade mini-game running inside Soliman-OS.',
}

export default function PlayPage() {
  return (
    <main className="w-full min-h-screen bg-[#050507]">
      <Crt>
        <Game />
      </Crt>
    </main>
  )
}
