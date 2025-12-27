import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './ToolShell.css';

interface ToolShellProps {
    title: string;
    description: string;
    children: ReactNode;
}

export function ToolShell({ title, description, children }: ToolShellProps) {
    return (
        <div className="tool-shell">
            <div className="tool-header">
                <Link to="/" className="back-link">
                    ← Back to Tools
                </Link>
                <h1 className="tool-title">{title}</h1>
                <p className="tool-description">{description}</p>
            </div>
            <div className="tool-content">
                {children}
            </div>
        </div>
    );
}
