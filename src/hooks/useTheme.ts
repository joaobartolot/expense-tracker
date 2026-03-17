import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
type ThemePreference = Theme | 'system';

const THEME_STORAGE_KEY = 'expense-tracker-theme';

function getSystemTheme(): Theme {
    if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        return 'dark';
    }

    return 'light';
}

function getInitialPreference(): ThemePreference {
    if (typeof window === 'undefined') {
        return 'system';
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return 'system';
}

export function useTheme() {
    const [themePreference, setThemePreference] =
        useState<ThemePreference>(getInitialPreference);
    const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
    const theme = themePreference === 'system' ? systemTheme : themePreference;

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () =>
            setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

        updateTheme();
        mediaQuery.addEventListener('change', updateTheme);

        return () => mediaQuery.removeEventListener('change', updateTheme);
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        root.dataset.theme = theme;
        root.style.colorScheme = theme;
    }, [theme]);

    useEffect(() => {
        if (themePreference === 'system') {
            window.localStorage.removeItem(THEME_STORAGE_KEY);
            return;
        }

        window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    }, [themePreference]);

    function toggleTheme() {
        setThemePreference((currentPreference) => {
            const resolvedTheme =
                currentPreference === 'system' ? systemTheme : currentPreference;

            return resolvedTheme === 'dark' ? 'light' : 'dark';
        });
    }

    return {
        theme,
        themePreference,
        toggleTheme,
        isUsingSystemTheme: themePreference === 'system',
    };
}
