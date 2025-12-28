import { useState, useEffect, useRef } from 'react';
import './Greeting.css';

export function Greeting() {
    const [name, setName] = useState(() => localStorage.getItem('user-name') || 'Developer');
    const [isEditing, setIsEditing] = useState(false);
    const [greeting, setGreeting] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage.setItem('user-name', name);
    }, [name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) setGreeting('Good morning,');
            else if (hour >= 12 && hour < 17) setGreeting('Good afternoon,');
            else if (hour >= 17 && hour < 21) setGreeting('Good evening,');
            else setGreeting('Good luck working through the night,');
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

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
        <div className="greeting-container">
            <span className="greeting-text">{greeting}</span>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    className="name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <span
                    className="user-name"
                    onClick={() => setIsEditing(true)}
                    title="Click to edit name"
                >
                    {name}
                </span>
            )}
        </div>
    );
}
