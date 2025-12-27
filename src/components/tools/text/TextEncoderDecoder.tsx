import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

type Mode = 'base64' | 'url' | 'html';

export function TextEncoderDecoder({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<Mode>('base64');
    const [result, setResult] = useState('');
    const [error, setError] = useState<string | null>(null);

    const process = (action: 'encode' | 'decode') => {
        setError(null);
        try {
            let output = '';
            if (mode === 'base64') {
                output = action === 'encode' ? btoa(input) : atob(input);
            } else if (mode === 'url') {
                output = action === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
            } else if (mode === 'html') {
                // Simple HTML entity encoding
                if (action === 'encode') {
                    output = input.replace(/[\u00A0-\u9999<>\&]/g, (i) => '&#' + i.charCodeAt(0) + ';');
                } else {
                    const doc = new DOMParser().parseFromString(input, 'text/html');
                    output = doc.documentElement.textContent || '';
                }
            }
            setResult(output);
        } catch (e) {
            setError("Conversion failed. Check your input.");
        }
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">Mode</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {(['base64', 'url', 'html'] as Mode[]).map(m => (
                        <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                            <input
                                type="radio"
                                name="mode"
                                checked={mode === m}
                                onChange={() => { setMode(m); setResult(''); setError(null); }}
                            />
                            {m === 'html' ? 'HTML Entities' : m}
                        </label>
                    ))}
                </div>
            </div>

            <div className="tool-form-group">
                <label className="tool-label">Input</label>
                <textarea
                    className="tool-textarea"
                    rows={5}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>

            <div className="tool-actions">
                <button className="btn btn-primary" onClick={() => process('encode')}>
                    Encode
                </button>
                <button className="btn btn-primary" onClick={() => process('decode')}>
                    Decode
                </button>
            </div>

            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

            {result && (
                <div className="tool-form-group" style={{ marginTop: '2rem' }}>
                    <label className="tool-label">Result</label>
                    <textarea
                        className="tool-textarea"
                        rows={5}
                        value={result}
                        readOnly
                    />
                </div>
            )}
        </ToolShell>
    );
}
