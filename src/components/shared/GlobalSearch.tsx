import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { TOOLS } from '../../config/tools';
import type { ToolCategory, Tool } from '../../config/tools';

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filteredTools = TOOLS.flatMap((c: ToolCategory) => c.children).filter((t: Tool) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit results

    const handleSelect = (toolId: string) => {
        navigate(`/tool/${toolId}`);
        setIsOpen(false);
        setQuery('');
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleNav = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredTools.length - 1));
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            }
            if (e.key === 'Enter' && filteredTools[selectedIndex]) {
                handleSelect(filteredTools[selectedIndex].id);
            }
        };
        window.addEventListener('keydown', handleNav);
        return () => window.removeEventListener('keydown', handleNav);
    }, [isOpen, filteredTools, selectedIndex]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <div
                className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg translate-x-[-50%] gap-4 border bg-background p-0 shadow-lg sm:rounded-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
                {filteredTools.length > 0 && (
                    <div className="max-h-[300px] overflow-y-auto p-1">
                        {filteredTools.map((tool: Tool, index: number) => (
                            <div
                                key={tool.id}
                                className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none ${index === selectedIndex ? 'bg-accent text-accent-foreground' : ''
                                    }`}
                                onClick={() => handleSelect(tool.id)}
                            >
                                <span>{tool.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">{tool.description}</span>
                            </div>
                        ))}
                    </div>
                )}
                {filteredTools.length === 0 && query && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No results found.
                    </div>
                )}
            </div>
        </div>
    );
}
