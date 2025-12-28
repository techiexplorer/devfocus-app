import { Link } from 'react-router-dom';
import { useTime } from '../../hooks/useTime';
import { useTheme } from '../theme-provider';
import { Greeting } from './Greeting';
import { Button } from "@/components/ui/button";
import { Github, Moon, Sun } from "lucide-react";

export function Header() {
    const time = useTime();
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const getThemeIcon = () => {
        return theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
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
            <div className="container flex h-12 items-center justify-between px-4 max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-4 sm:gap-6">
                    <Link to="/" className="font-bold tracking-tight hover:text-primary transition-colors">
                        devfocus.app
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-medium">
                        <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                    </nav>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                    <Greeting />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden md:flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <span className="opacity-70">UTC</span>
                            <span className="tabular-nums font-medium text-foreground">{formatTime(time, 'UTC')}</span>
                        </div>
                        <div className="h-3 w-[1px] bg-border"></div>
                        <div className="flex items-center gap-1.5">
                            <span className="opacity-70">LOC</span>
                            <span className="tabular-nums font-medium text-foreground">{formatTime(time)}</span>
                        </div>
                    </div>

                    <div className="h-4 w-[1px] bg-border hidden md:block"></div>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                            <a href="https://github.com/techiexplorer/devfocus-app" target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={toggleTheme}
                            title={`Toggle Theme (${theme})`}
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
