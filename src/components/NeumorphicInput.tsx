import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

interface NeumorphicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  rightElement?: ReactNode
  error?: string
  helperText?: string
}

const NeumorphicInput = forwardRef<HTMLInputElement, NeumorphicInputProps>(
  ({ label, icon, rightElement, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary px-1">
            {label}
          </label>
        )}

        <div
          className={`
            neumo-indented
            flex items-center gap-2.5 rounded-xl px-4 py-2.5
            transition-all duration-200
            ${error ? '!shadow-[inset_4px_4px_8px_rgba(239,68,68,0.15),inset_-3px_-3px_7px_rgba(255,255,255,0.03)] border-crimson/20' : ''}
            ${className}
          `}
        >
          {icon && (
            <span className="flex-shrink-0 text-muted">{icon}</span>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-transparent text-sm text-primary
              placeholder:text-muted/60
              outline-none border-none
              ${props.type === 'number' ? '[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none' : ''}
            `}
            {...props}
          />
          {rightElement && (
            <span className="flex-shrink-0 text-muted">{rightElement}</span>
          )}
        </div>

        {error && (
          <p className="text-xs text-crimson mt-0.5 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-muted mt-0.5">{helperText}</p>
        )}
      </div>
    )
  }
)

NeumorphicInput.displayName = 'NeumorphicInput'
export default NeumorphicInput
