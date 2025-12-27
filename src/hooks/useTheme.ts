import { useState, useEffect } from 'react';

type Theme = 'system' | 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        // Remove previous attributes
        root.removeAttribute('data-theme');

        if (theme === 'system') {
            localStorage.removeItem('theme');
        } else {
            root.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    return { theme, setTheme };
}
