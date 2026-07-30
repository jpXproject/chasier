import { type SelectHTMLAttributes, forwardRef } from 'react'

interface NeumorphicSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
}

const NeumorphicSelect = forwardRef<HTMLSelectElement, NeumorphicSelectProps>(
  ({ label, options, placeholder, error, className = '', ...props }, ref) => {
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
            flex items-center rounded-xl
            transition-all duration-200
            ${error ? '!shadow-[inset_4px_4px_8px_rgba(239,68,68,0.15),inset_-3px_-3px_7px_rgba(255,255,255,0.03)] border-crimson/20' : ''}
            ${className}
          `}
        >
          <select
            ref={ref}
            className="
              w-full bg-transparent text-sm text-primary
              outline-none border-none px-4 py-2.5
              appearance-none cursor-pointer
            "
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="mr-3 flex-shrink-0 text-muted pointer-events-none"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {error && (
          <p className="text-xs text-crimson mt-0.5">{error}</p>
        )}
      </div>
    )
  }
)

NeumorphicSelect.displayName = 'NeumorphicSelect'
export default NeumorphicSelect
