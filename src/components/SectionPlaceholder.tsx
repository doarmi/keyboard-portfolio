import type { ReactNode } from 'react'

interface SectionPlaceholderProps {
  children?: ReactNode
  id: string
  title: string
}

export default function SectionPlaceholder({ children, id, title }: SectionPlaceholderProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  )
}
