'use client'

import { motion } from 'framer-motion'
import Chip from './Chip'
import type { Project } from '@/data/projects'

const EASE = [0.22, 1, 0.36, 1] as const


interface ProjectCardProps {
  project: Project
}

/** Renders the inline SVG architecture diagram from typed data */
function ArchDiagram({ project }: { project: Project }) {
  // Build an ID→position map for arrow rendering
  const nodeMap = new Map(project.diagram.map((n) => [n.id, n]))

  // Compute a viewBox that fits all nodes
  const maxX = Math.max(...project.diagram.map((n) => n.x + n.w)) + 10
  const maxY = Math.max(...project.diagram.map((n) => n.y + n.h)) + 10
  const viewBox = `0 0 ${maxX} ${maxY}`

  return (
    <svg
      viewBox={viewBox}
      className="w-full overflow-visible"
      style={{ height: '64px' }}
      aria-label={`Architecture diagram for ${project.title}`}
    >
      <defs>
        <marker id={`arrow-${project.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polyline points="0,0 6,3 0,6" fill="none" stroke="var(--brass)" strokeWidth="1" />
        </marker>
      </defs>

      {/* Arrows / connections */}
      {project.diagramArrows.map(({ from, to, label }, i) => {
        const fromNode = nodeMap.get(from)
        const toNode = nodeMap.get(to)
        if (!fromNode || !toNode) return null
        const x1 = fromNode.x + fromNode.w
        const y1 = fromNode.y + fromNode.h / 2
        const x2 = toNode.x
        const y2 = toNode.y + toNode.h / 2
        const mx = (x1 + x2) / 2
        return (
          <g key={i}>
            <path
              className="diagram-arrow"
              d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
              fill="none"
              stroke="var(--brass)"
              strokeWidth="1"
              opacity="0.7"
              markerEnd={`url(#arrow-${project.id})`}
              strokeDasharray="4"
            />
            {label && (
              <text x={mx} y={(y1 + y2) / 2 - 4} textAnchor="middle" className="font-mono" style={{ fontSize: '7px', fill: 'var(--brass)', opacity: 0.8 }}>
                {label}
              </text>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {project.diagram.map((node) => (
        <g key={node.id}>
          <rect
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx="4"
            fill="var(--surface)"
            stroke="var(--brass-soft)"
            strokeWidth="1"
          />
          <text
            x={node.x + node.w / 2}
            y={node.y + node.h / 2 + 4}
            textAnchor="middle"
            style={{ fontSize: '9px', fill: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)', fontWeight: '400' }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="
        relative group
        bg-[var(--surface)] rounded-card
        p-6 lg:p-8
        border border-[var(--brass-soft)]/40
        shadow-card
        hover:shadow-card-hover
        hover:border-[var(--brass)]/60
        transition-all duration-400 ease-arch
        flex flex-col gap-5
      "
      aria-label={`Project: ${project.title}`}
    >
      {/* Brass border draw effect on hover (pseudo via box-shadow) */}

      {/* Header */}
      <div>
        <h3 className="font-serif text-[var(--step-2)] text-[var(--text-primary)] mb-1">
          {project.title}
        </h3>
        <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
          {project.problem}
        </p>
      </div>

      {/* Architecture diagram */}
      <div className="overflow-hidden">
        <ArchDiagram project={project} />
      </div>

      {/* Stack chips */}
      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <Chip key={tech} label={tech} />
        ))}
      </div>

      {/* Outcome */}
      <p className="font-sans text-sm text-[var(--text-primary)] border-t border-[var(--brass-soft)]/30 pt-4 leading-relaxed">
        <span className="mono-label text-xs mr-2">→</span>
        {project.outcome}
      </p>
    </motion.article>
  )
}
