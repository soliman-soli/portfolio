import type { Metadata } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
})

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Soliman — Software Engineer & Automation Architect',
  description:
    'Computer engineering student and software engineer specialising in backend systems, automation pipelines, and desktop apps. Based in Egypt.',
  keywords: [
    'software engineer',
    'automation architect',
    'TypeScript',
    'React',
    'Next.js',
    'C++',
    'Qt',
    'Node.js',
    'portfolio',
    'Soliman',
  ],
  openGraph: {
    title: 'Soliman — Software Engineer & Automation Architect',
    description: 'I design and build software systems that automate the boring parts.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soliman — Software Engineer & Automation Architect',
    description: 'I design and build software systems that automate the boring parts.',
  },
  robots: { index: true, follow: true },
}

/** Ensure permanent light theme — clears any legacy dark mode preference */
const forceLightScript = `
(function() {
  try {
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
  } catch (_) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: forceLightScript }} />
        {/* Favicon — brass S monogram */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230F4C3A'/><text x='16' y='23' font-size='20' text-anchor='middle' font-family='serif' font-weight='bold' fill='%23B08D57'>S</text></svg>" />
      </head>
      <body
        className={`${fraunces.variable} ${geistSans.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  )
}
