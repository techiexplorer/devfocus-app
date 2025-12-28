import { useTime } from '../../hooks/useTime';
import { useTheme } from '../../hooks/useTheme';
import { Greeting } from './Greeting';
import './Header.css';

export function Header() {
    const time = useTime();
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === 'system') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('system');
    };

    const getThemeIcon = () => {
        if (theme === 'system') return 'Auto';
        if (theme === 'light') return 'Light';
        return 'Dark';
    };

    const formatTime = (date: Date, timeZone?: string) => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone
            }).format(date);
        } catch (e) {
            return '00:00:00';
        }
    };

    return (
        <header className="app-header">
            <div className="left-section">
                <div className="brand">devfocus.app</div>
                <nav className="nav-links">
                    <a href="/about" className="nav-link">About</a>
                </nav>
            </div>

            <Greeting />

            <div className="right-section">
                {/* Command K Hint */}
                <div className="cmd-k-hint" title="Press Ctrl+K to search">
                    <span className="cmd-key">Ctrl</span> + <span className="cmd-key">K</span>
                </div>

                <div className="divider"></div>

                <div className="clocks">
                    <div className="clock-item">
                        <span className="clock-label">UTC</span>
                        <span className="clock-value">{formatTime(time, 'UTC')}</span>
                    </div>
                    <div className="clock-item">
                        <span className="clock-label">Loc</span>
                        <span className="clock-value">{formatTime(time)}</span>
                    </div>
                </div>

                <div className="divider"></div>

                <a
                    href="https://github.com/devfocus/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link"
                    title="View on GitHub"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={`Theme: ${theme}`}
                >
                    {getThemeIcon()}
                </button>
            </div>
        </header>
    );
}
