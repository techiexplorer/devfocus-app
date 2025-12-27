import { useState, useEffect, useRef, useMemo } from 'react';
import { useTime } from '../../hooks/useTime';
import { Input } from "../ui/input";

export function Greeting() {
    const [name, setName] = useState(() => localStorage.getItem('user-name') || 'Developer');
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const time = useTime();

    useEffect(() => {
        localStorage.setItem('user-name', name);
    }, [name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const greeting = useMemo(() => {
        const hour = time.getHours();
        if (hour >= 5 && hour < 12) return 'Good morning,';
        if (hour >= 12 && hour < 17) return 'Good afternoon,';
        if (hour >= 17 && hour < 21) return 'Good evening,';
        return 'Good luck working through the night,';
    }, [time]);

    const handleBlur = () => {
        setIsEditing(false);
        if (!name.trim()) setName('Developer');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            if (!name.trim()) setName('Developer');
        }
    };

    return (
        <div className="hidden md:flex items-center gap-2 text-sm whitespace-nowrap">
            <span className="text-muted-foreground">{greeting}</span>
            {isEditing ? (
                <Input
                    ref={inputRef}
                    type="text"
                    className="h-6 w-32 px-1 py-0 text-sm border-none border-b rounded-none focus-visible:ring-0 focus-visible:border-primary shadow-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <span
                    className="font-semibold cursor-pointer border-b border-dotted border-primary hover:text-primary transition-colors"
                    onClick={() => setIsEditing(true)}
                    title="Click to edit name"
                >
                    {name}
                </span>
            )}
        </div>
    );
}
