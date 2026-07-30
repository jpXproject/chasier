import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'success' | 'danger' | 'neutral' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface NeumorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  icon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'text-on-dark bg-phosphor border-phosphor/20',
  success: 'text-phosphor border-phosphor/10',
  danger: 'text-crimson border-crimson/10',
  neutral: 'text-silver border-white/5',
  ghost: 'text-secondary border-transparent shadow-none hover:shadow-none active:shadow-none bg-transparent hover:bg-white/5 active:bg-white/10',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-xs gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
}

export default function NeumorphicButton({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}: NeumorphicButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <button
      className={`
        neumo-raised
        inline-flex items-center justify-center font-semibold rounded-xl
        select-none cursor-pointer
        transition-all duration-200 ease-out
        active:scale-[0.97]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${isPrimary ? 'hover:brightness-110' : ''}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'pointer-events-none' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
