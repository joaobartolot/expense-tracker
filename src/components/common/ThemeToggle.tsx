import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

interface ThemeToggleProps {
    theme: Theme;
    onToggle: () => void;
    title?: string;
}

export function ThemeToggle({
    theme,
    onToggle,
    title,
}: ThemeToggleProps) {
    const isDark = theme === 'dark';
    const Icon = isDark ? Sun : Moon;
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={label}
            aria-pressed={isDark}
            title={title ?? label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/15 text-white transition-all duration-300 focus:outline-none focus:ring-0 focus-visible:ring-0"
        >
            <Icon
                className={`h-5 w-5 transition-transform duration-300 ${
                    isDark ? 'text-amber-300' : 'text-sky-100'
                }`}
            />
        </button>
    );
}
