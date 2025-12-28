import { useState, useMemo } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function RegexTester({ tool }: { tool: Tool }) {
    const [pattern, setPattern] = useState('[a-z]+');
    const [flags, setFlags] = useState('gm');
    const [text, setText] = useState('Hello world, this is a test string.');

    const result = useMemo(() => {
        try {
            if (!pattern) return [];
            const regex = new RegExp(pattern, flags);
            const matches = Array.from(text.matchAll(regex));
            return matches.map(m => ({
                match: m[0],
                index: m.index,
                groups: m.groups
            }));
        } catch (e) {
            return (e as Error).message;
        }
    }, [pattern, flags, text]);

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label className="tool-label">Pattern</label>
                        <input
                            type="text"
                            className="tool-input"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="Regex pattern"
                        />
                    </div>
                    <div style={{ width: '100px' }}>
                        <label className="tool-label">Flags</label>
                        <input
                            type="text"
                            className="tool-input"
                            value={flags}
                            onChange={(e) => setFlags(e.target.value)}
                            placeholder="g, m, i"
                        />
                    </div>
                </div>
            </div>

            <div className="tool-form-group">
                <label className="tool-label">Test String</label>
                <textarea
                    className="tool-textarea"
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <div className="tool-form-group">
                <label className="tool-label">Matches</label>
                <div style={{
                    marginTop: '0.5rem',
                    minHeight: '100px',
                    padding: '1rem',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem'
                }}>
                    {typeof result === 'string' ? (
                        <span style={{ color: 'red' }}>Error: {result}</span>
                    ) : result.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {result.map((m, i) => (
                                <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                    <strong>Match {i + 1}:</strong> "{m.match}" <span style={{ color: 'var(--color-text-dim)' }}>(Index: {m.index})</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span style={{ color: 'var(--color-text-dim)' }}>No matches found</span>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
