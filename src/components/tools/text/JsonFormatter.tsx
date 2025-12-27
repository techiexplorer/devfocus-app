import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function JsonFormatter({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const format = (space: number) => {
        try {
            if (!input.trim()) return;
            let parsed;
            try {
                parsed = JSON.parse(input);
            } catch (e) {
                // Try parsing as JS object (looser JSON)
                // new Function returns the evaluated object from string like "{key: 'val'}"
                const cleanInput = input.trim();
                // wrapper to ensure it's treated as expression
                // eslint-disable-next-line @typescript-eslint/no-implied-eval
                parsed = new Function('return ' + (cleanInput.startsWith('{') || cleanInput.startsWith('[') ? cleanInput : '{' + cleanInput + '}'))();
            }

            setInput(JSON.stringify(parsed, null, space));
            setError(null);
        } catch (e) {
            setError("Invalid JSON or JS Object");
        }
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">JSON Input / Output</label>
                <textarea
                    className="tool-textarea"
                    rows={15}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='{"key": "value"}'
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                />
            </div>

            {error && (
                <div style={{ color: 'red', padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '4px', marginBottom: '1rem' }}>
                    Error: {error}
                </div>
            )}

            <div className="tool-actions">
                <button className="btn btn-primary" onClick={() => format(2)}>
                    Format (Prettify)
                </button>
                <button className="btn btn-secondary" onClick={() => format(0)}>
                    Minify
                </button>
                <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(input)}>
                    Copy Current
                </button>
                <button className="btn btn-secondary" onClick={() => setInput('')}>
                    Clear
                </button>
            </div>
        </ToolShell>
    );
}
