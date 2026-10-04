'use client'

import { forwardRef } from 'react'

export interface FloatingPreviewHandle {
  setTarget: (x: number, y: number) => void
  show: () => void
  hide: () => void
  setContent: (node: React.ReactNode) => void
}

interface FloatingPreviewProps {
  innerRef: React.RefObject<HTMLDivElement | null>
  cardRef: React.RefObject<HTMLDivElement | null>
}

export const FloatingPreview = forwardRef<HTMLDivElement, FloatingPreviewProps>(
  function FloatingPreview({ innerRef, cardRef }, ref) {
    return (
      <div
        ref={ref}
        id="pv"
        className="preview"
        aria-hidden="true"
      >
        <div ref={innerRef} className="preview-inner" id="pvin">
          <div ref={cardRef} />
        </div>
      </div>
    )
  }
)
