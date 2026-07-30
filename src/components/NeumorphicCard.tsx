import { type CSSProperties, type ReactNode } from 'react'

interface NeumorphicCardProps {
  children: ReactNode
  variant?: 'raised' | 'indented' | 'pressed'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
  onClick?: () => void
  hoverable?: boolean
  glow?: 'green' | 'red' | 'none'
}

const paddingMap = {
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6 lg:p-7',
}

const variantMap = {
  raised: 'neumo-raised',
  indented: 'neumo-indented',
  pressed: 'neumo-pressed',
}

const glowMap = {
  green: 'animate-glow-green',
  red: 'animate-glow-red',
  none: '',
}

export default function NeumorphicCard({
  children,
  variant = 'raised',
  padding = 'md',
  className = '',
  style,
  onClick,
  hoverable = false,
  glow = 'none',
}: NeumorphicCardProps) {
  return (
    <div
      className={`rounded-2xl ${variantMap[variant]} ${paddingMap[padding]} ${glowMap[glow]} ${
        hoverable ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
      <div className="min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-primary truncate leading-snug">{title}</h3>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

export function CardStat({
  label,
  value,
  trend,
  variant = 'neutral',
}: {
  label: string
  value: string
  trend?: 'up' | 'down'
  variant?: 'success' | 'danger' | 'neutral'
}) {
  const valueColor = {
    success: 'text-phosphor',
    danger: 'text-crimson',
    neutral: 'text-primary',
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] sm:text-xs text-secondary font-semibold uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={`text-lg sm:text-xl lg:text-2xl font-black ${valueColor[variant]}`}>
          {value}
        </span>
        {trend && (
          <span className={`text-[10px] sm:text-xs font-bold flex items-center gap-0.5 ${trend === 'up' ? 'text-phosphor' : 'text-crimson'}`}>
            {trend === 'up' ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {trend === 'up' ? '+12.5%' : '-3.2%'}
          </span>
        )}
      </div>
    </div>
  )
}
