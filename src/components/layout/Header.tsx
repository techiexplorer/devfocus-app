import { Link } from 'react-router-dom';
import { useTime } from '../../hooks/useTime';
import { useTheme } from '../theme-provider';
import { Greeting } from './Greeting';
import { Button } from "@/components/ui/button";
import { Github, Moon, Sun, Monitor } from "lucide-react";

export function Header() {
    const time = useTime();
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === 'system') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('system');
    };

    const getThemeIcon = () => {
        if (theme === 'system') return <Monitor className="h-4 w-4" />;
        if (theme === 'light') return <Sun className="h-4 w-4" />;
        return <Moon className="h-4 w-4" />;
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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 sm:px-8 max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-6">
                    <Link to="/" className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
                        devfocus.app
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-medium">
                        <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                    </nav>
                </div>

                <Greeting />

                <div className="flex items-center gap-4">
                    {/* Command K Hint - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded select-none cursor-default" title="Press Ctrl+K to search">
                        <span className="text-[10px]">⌘</span>K
                    </div>

                    <div className="h-4 w-[1px] bg-border hidden md:block"></div>

                    <div className="hidden md:flex items-center gap-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground uppercase tracking-wider text-[10px]">UTC</span>
                            <span className="tabular-nums font-medium">{formatTime(time, 'UTC')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Loc</span>
                            <span className="tabular-nums font-medium">{formatTime(time)}</span>
                        </div>
                    </div>

                    <div className="h-4 w-[1px] bg-border hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                            <a href="https://github.com/devfocus/app" target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={toggleTheme}
                            title={`Theme: ${theme}`}
                        >
                            {getThemeIcon()}
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
