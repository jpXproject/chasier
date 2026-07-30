import { type ReactNode } from 'react'

type BadgeVariant = 'success' | 'danger' | 'warning' | 'neutral' | 'info'
type BadgeSize = 'sm' | 'md'

interface NeumorphicBadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-phosphor-light text-phosphor border-phosphor/15',
  danger: 'bg-crimson-light text-crimson border-crimson/15',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/15',
  neutral: 'bg-white/5 text-silver border-white/10',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/15',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-0.5 text-[10px] gap-1',
  md: 'px-3 py-1 text-xs gap-1.5',
}

export default function NeumorphicBadge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}: NeumorphicBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full
        border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success'
              ? 'bg-phosphor'
              : variant === 'danger'
                ? 'bg-crimson'
                : variant === 'warning'
                  ? 'bg-amber-400'
                  : variant === 'info'
                    ? 'bg-sky-400'
                    : 'bg-silver'
          }`}
        />
      )}
      {children}
    </span>
  )
}
