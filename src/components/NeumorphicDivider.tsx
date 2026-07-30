import { type ReactNode } from 'react'

interface NeumorphicDividerProps {
  label?: string | ReactNode
  className?: string
}

export default function NeumorphicDivider({ label, className = '' }: NeumorphicDividerProps) {
  if (!label) {
    return (
      <div className={`h-0.5 rounded-full neumo-indented !p-0 border-0 ${className}`} />
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-0.5 rounded-full neumo-indented !p-0 border-0" />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-0.5 rounded-full neumo-indented !p-0 border-0" />
    </div>
  )
}
