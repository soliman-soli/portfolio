import type { Metadata } from 'next'
import { Archivo, JetBrains_Mono, Press_Start_2P } from 'next/font/google'
import { StageTransitionProvider } from '@/components/transition/StageTransition'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
})

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'Soliman Ahmed - Backend Engineer | AI Systems & RAG',
  description:
    'Backend-focused computer engineering student building production-grade RAG pipelines, AI evaluation systems and scalable REST APIs.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable} ${pressStart2P.variable}`}
    >
      <body>
        <StageTransitionProvider>
          <a href="#work" className="skip-link mono">
            skip to work &rarr;
          </a>
          {children}
        </StageTransitionProvider>
      </body>
    </html>
  )
}
