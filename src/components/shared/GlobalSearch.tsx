import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS } from '../../config/tools';
import './GlobalSearch.css';

interface SearchResult {
    id: string;
    name: string;
    category: string;
    description: string;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Toggle with Cmd/Ctrl + K
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

    // Focus input when open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const results: SearchResult[] = TOOLS.flatMap(category =>
        category.children
            .filter(tool =>
                tool.name.toLowerCase().includes(query.toLowerCase()) ||
                tool.description.toLowerCase().includes(query.toLowerCase())
            )
            .map(tool => ({
                id: tool.id,
                name: tool.name,
                category: category.name,
                description: tool.description
            }))
    ).slice(0, 10); // Limit results

    const handleNavigate = (toolId: string) => {
        navigate(`/tool/${toolId}`);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            if (results[selectedIndex]) {
                handleNavigate(results[selectedIndex].id);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={() => setIsOpen(false)}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-header">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search tools..."
                        className="search-input-global"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="search-body">
                    {results.length > 0 ? (
                        results.map((result, index) => (
                            <div
                                key={result.id}
                                className={`search-item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => handleNavigate(result.id)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="search-item-main">
                                    <span className="search-item-name">{result.name}</span>
                                    <span className="search-item-desc">{result.description}</span>
                                </div>
                                <span className="search-item-cat">{result.category}</span>
                            </div>
                        ))
                    ) : (
                        <div className="search-empty">No tools found</div>
                    )}
                </div>
                <div className="search-footer">
                    <span>Use <b>↑</b> <b>↓</b> to navigate</span>
                    <span><b>Enter</b> to select</span>
                    <span><b>Esc</b> to close</span>
                </div>
            </div>
        </div>
    );
}
