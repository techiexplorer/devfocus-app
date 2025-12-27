import { useState, useEffect } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function HashGenerator({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const generateHashes = async () => {
            if (!input) {
                setHashes({});
                return;
            }
            const encoder = new TextEncoder();
            const data = encoder.encode(input);

            const toHex = (buffer: ArrayBuffer) =>
                Array.from(new Uint8Array(buffer))
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('');

            try {
                const sha1Buf = await crypto.subtle.digest('SHA-1', data);
                const sha256Buf = await crypto.subtle.digest('SHA-256', data);
                const sha384Buf = await crypto.subtle.digest('SHA-384', data);
                const sha512Buf = await crypto.subtle.digest('SHA-512', data);

                setHashes({
                    'SHA-1': toHex(sha1Buf),
                    'SHA-256': toHex(sha256Buf),
                    'SHA-384': toHex(sha384Buf),
                    'SHA-512': toHex(sha512Buf),
                });
            } catch (e) {
                console.error('Hashing failed', e);
            }
        };

        generateHashes();
    }, [input]);

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">Input Text</label>
                <textarea
                    className="tool-textarea"
                    rows={3}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something here..."
                />
            </div>

            <div className="tool-form-group">
                <label className="tool-label">Hashes</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <div key={algo} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>{algo}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    readOnly
                                    className="tool-input"
                                    value={hash}
                                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                                />
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigator.clipboard.writeText(hash)}
                                    title="Copy"
                                    style={{ minWidth: '60px' }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    ))}
                    {!input && <div style={{ color: 'var(--color-text-dim)', fontStyle: 'italic' }}>Start typing to generate hashes securely in real-time.</div>}
                </div>
            </div>
        </ToolShell>
    );
}
