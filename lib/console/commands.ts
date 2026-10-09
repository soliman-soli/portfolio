import { projects } from '@/content/projects'
import { skillGroups, perks, playerCard } from '@/content/skills'
import { links } from '@/content/links'

export type Line =
  | { type: 'text'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'kv'; label: string; value: string }
  | {
      type: 'link'
      href: string
      label: string
      key?: string
      external?: boolean
      download?: boolean
    }
  | { type: 'runnable'; label: string; command: string }
  | { type: 'spacer' }
  | { type: 'muted'; text: string }

export interface CommandContext {
  unlocked: boolean
}

export interface CommandResult {
  lines: Line[]
  clear?: boolean
  unlock?: boolean
}

function levenshtein(a: string, b: string): number {
  const an = a.length
  const bn = b.length
  if (an === 0) return bn
  if (bn === 0) return an
  const matrix: number[][] = []
  for (let i = 0; i <= bn; i++) matrix[i] = [i]
  for (let j = 0; j <= an; j++) matrix[0][j] = j
  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[bn][an]
}

export function getAutocomplete(
  input: string,
  unlocked: boolean
): { text: string; matches?: string[] } {
  const trimmed = input.trimStart()
  if (trimmed.toLowerCase().startsWith('cat ')) {
    const arg = trimmed.slice(4).trimStart().toLowerCase()
    const candidates = projects
      .map((p) => p.slug)
      .filter((slug) => slug.toLowerCase().startsWith(arg))
    if (candidates.length === 1) {
      return { text: `cat ${candidates[0]}` }
    }
    if (candidates.length > 1) {
      return { text: input, matches: candidates }
    }
    return { text: input }
  }

  const prefix = trimmed.toLowerCase()
  const commands = [
    'help',
    'ls',
    'cat',
    'skills',
    'whoami',
    'contact',
    'cv',
    'clear',
    'ping',
    'exit',
  ]
  if (unlocked) {
    commands.push('hiscores')
  }

  if (!prefix) {
    return { text: input, matches: commands }
  }

  const matches = commands.filter((cmd) => cmd.startsWith(prefix))
  if (matches.length === 1) {
    return { text: matches[0] }
  }
  if (matches.length > 1) {
    return { text: input, matches }
  }
  return { text: input }
}

export function runCommand(
  rawInput: string,
  ctx: CommandContext
): CommandResult {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    return { lines: [] }
  }

  const parts = trimmed.split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const arg = parts.slice(1).join(' ').trim()
  const lowerTrimmed = trimmed.toLowerCase()

  // 1. help
  if (cmd === 'help') {
    return {
      lines: [
        { type: 'heading', text: 'available commands' },
        { type: 'kv', label: 'help', value: 'show this list' },
        { type: 'kv', label: 'ls', value: 'list projects' },
        { type: 'kv', label: 'cat <n|name>', value: 'open a project (e.g. cat 01, cat rag)' },
        { type: 'kv', label: 'skills', value: 'what I work with' },
        { type: 'kv', label: 'whoami', value: 'who is this' },
        { type: 'kv', label: 'contact', value: 'ways to reach me' },
        { type: 'kv', label: 'cv', value: 'download my CV' },
        { type: 'kv', label: 'clear', value: 'clear the screen' },
        { type: 'spacer' },
        { type: 'muted', text: 'tip: Tab autocompletes, ↑ for history' },
      ],
    }
  }

  // 2. whoami
  if (cmd === 'whoami') {
    return {
      lines: [
        { type: 'kv', label: 'name', value: playerCard.name },
        { type: 'kv', label: 'class', value: playerCard.class },
        { type: 'kv', label: 'subclass', value: playerCard.subclass },
        { type: 'kv', label: 'base', value: playerCard.base },
        { type: 'kv', label: 'education', value: playerCard.educationShort },
      ],
    }
  }

  // 3. ls
  if (cmd === 'ls') {
    const lines: Line[] = [
      { type: 'heading', text: `projects (0${projects.length})` },
    ]
    for (const p of projects) {
      lines.push({
        type: 'runnable',
        label: `${p.index}  ${p.title}   [${p.statusLabel}]`,
        command: `cat ${p.index}`,
      })
    }
    lines.push({ type: 'spacer' })
    lines.push({ type: 'muted', text: 'tip: cat 01 opens a project' })
    return { lines }
  }

  // 4. cat <n|name>
  if (cmd === 'cat') {
    if (!arg) {
      return {
        lines: [{ type: 'text', text: 'usage: cat <n|name>   (try ls)' }],
      }
    }

    const cleanArg = arg.toLowerCase()
    // Exact index match: "1", "01"
    let match = projects.find(
      (p) =>
        p.index.toLowerCase() === cleanArg ||
        String(parseInt(p.index, 10)) === cleanArg
    )

    // Exact slug match
    if (!match) {
      match = projects.find((p) => p.slug.toLowerCase() === cleanArg)
    }

    // Substring match in slug or title
    if (!match) {
      const candidates = projects.filter(
        (p) =>
          p.slug.toLowerCase().includes(cleanArg) ||
          p.title.toLowerCase().includes(cleanArg)
      )
      if (candidates.length === 1) {
        match = candidates[0]
      } else if (candidates.length > 1) {
        return {
          lines: [
            {
              type: 'text',
              text: `ambiguous: ${candidates.map((c) => c.slug).join(', ')}`,
            },
          ],
        }
      }
    }

    if (!match) {
      return {
        lines: [{ type: 'text', text: `no such project: ${arg}. try ls` }],
      }
    }

    const lines: Line[] = [
      { type: 'heading', text: match.title },
      { type: 'muted', text: `${match.statusLabel} · ${match.year}` },
      { type: 'text', text: match.summary },
      { type: 'spacer' },
    ]

    for (const h of match.highlights) {
      lines.push({ type: 'kv', label: h.value, value: h.label })
    }

    lines.push({
      type: 'kv',
      label: 'stack',
      value: match.stack.join(' · '),
    })
    lines.push({ type: 'spacer' })
    lines.push({
      type: 'link',
      href: `/work/${match.slug}`,
      label: 'open full project ▸',
    })

    return { lines }
  }

  // 5. skills
  if (cmd === 'skills') {
    const lines: Line[] = []
    for (const group of skillGroups) {
      lines.push({ type: 'heading', text: group.name })
      lines.push({ type: 'text', text: group.skills.join(' · ') })
      lines.push({ type: 'spacer' })
    }
    lines.push({ type: 'kv', label: 'perks', value: perks.join(' · ') })
    return { lines }
  }

  // 6. contact
  if (cmd === 'contact') {
    return {
      lines: [
        { type: 'heading', text: 'contact' },
        {
          type: 'link',
          key: 'email',
          href: links.mailto,
          label: links.email,
        },
        {
          type: 'link',
          key: 'linkedin',
          href: links.linkedin,
          label: links.linkedinDisplay,
          external: true,
        },
        {
          type: 'link',
          key: 'github',
          href: links.github,
          label: links.githubDisplay,
          external: true,
        },
        {
          type: 'link',
          key: 'cv',
          href: links.cv,
          label: 'Soliman_Ahmed_CV.pdf',
          download: true,
        },
      ],
    }
  }

  // 7. cv
  if (cmd === 'cv') {
    return {
      lines: [
        { type: 'text', text: 'preparing Soliman_Ahmed_CV.pdf ...' },
        {
          type: 'link',
          href: links.cv,
          label: 'download ▸',
          download: true,
        },
      ],
    }
  }

  // 8. clear
  if (cmd === 'clear') {
    return { lines: [], clear: true }
  }

  // Hidden 1: ping / ping soliman
  if (lowerTrimmed === 'ping' || lowerTrimmed === 'ping soliman') {
    return {
      lines: [
        { type: 'text', text: 'PONG · soliman is online · Cairo, Egypt' },
        { type: 'runnable', label: 'say hi ▸', command: 'contact' },
      ],
    }
  }

  // Hidden 2: sudo hire soliman
  if (lowerTrimmed === 'sudo hire soliman') {
    return {
      lines: [
        { type: 'text', text: '[sudo] password for guest: ********' },
        {
          type: 'text',
          text: 'access granted. you have excellent taste.',
        },
        { type: 'heading', text: 'contact' },
        {
          type: 'link',
          key: 'email',
          href: links.mailto,
          label: links.email,
        },
        {
          type: 'link',
          key: 'linkedin',
          href: links.linkedin,
          label: links.linkedinDisplay,
          external: true,
        },
        {
          type: 'link',
          key: 'github',
          href: links.github,
          label: links.githubDisplay,
          external: true,
        },
        {
          type: 'link',
          key: 'cv',
          href: links.cv,
          label: 'Soliman_Ahmed_CV.pdf',
          download: true,
        },
      ],
    }
  }

  // Hidden 3: other sudo ...
  if (cmd === 'sudo') {
    return {
      lines: [
        {
          type: 'text',
          text: 'guest is not in the sudoers file. This incident will be reported.',
        },
      ],
    }
  }

  // Hidden 4: rm -rf
  if (lowerTrimmed.startsWith('rm -rf')) {
    return {
      lines: [{ type: 'text', text: 'nice try.' }],
    }
  }

  // Hidden 5: exit
  if (cmd === 'exit') {
    return {
      lines: [
        {
          type: 'text',
          text: 'there is no exit. only the contact section.',
        },
        { type: 'link', href: '#contact', label: 'go to contact ▸' },
      ],
    }
  }

  // Hidden 6: hiscores (ONLY if ctx.unlocked)
  if (cmd === 'hiscores' && ctx.unlocked) {
    return {
      lines: [
        { type: 'heading', text: 'HI-SCORES' },
        {
          type: 'kv',
          label: '-70%',
          value: 'document search latency (RAG Document Q&A API vs keyword search)',
        },
        {
          type: 'kv',
          label: '<2 min',
          value: 'to evaluate a candidate (AI Candidate Evaluation System)',
        },
        {
          type: 'kv',
          label: '+30%',
          value: 'retrieval precision from hybrid search (RAG Document Q&A API)',
        },
        {
          type: 'kv',
          label: '$12,000',
          value: 'monthly revenue deficit uncovered (Sales Intelligence Dashboard)',
        },
      ],
    }
  }

  // Unknown command
  const known = [
    'help',
    'ls',
    'cat',
    'skills',
    'whoami',
    'contact',
    'cv',
    'clear',
    'ping',
    'exit',
  ]
  if (ctx.unlocked) {
    known.push('hiscores')
  }

  let closest: string | null = null
  let minDistance = Infinity

  for (const k of known) {
    const dist = levenshtein(cmd, k)
    if (dist <= 2 && dist < minDistance) {
      minDistance = dist
      closest = k
    }
  }

  let unknownText = `command not found: ${cmd}. try help`
  if (closest) {
    unknownText += `. did you mean ${closest}?`
  }

  return {
    lines: [{ type: 'text', text: unknownText }],
  }
}
