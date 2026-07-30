import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="
        neumo-raised
        relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
        cursor-pointer select-none
        transition-all duration-300
        active:scale-95
      "
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Icon */}
      <span className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun */}
        <svg
          className={`absolute transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        {/* Moon */}
        <svg
          className={`absolute transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* Label */}
      <span className="text-primary min-w-[3ch]">{isDark ? 'Dark' : 'Light'}</span>

      {/* Track */}
      <span className="relative w-8 h-4 rounded-full bg-surface-indented neumo-indented !shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] border-0">
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-phosphor transition-all duration-300 ${
            isDark ? 'left-0.5' : 'left-[18px]'
          }`}
        />
      </span>
    </button>
  )
}
