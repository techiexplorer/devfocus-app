import { useState, useMemo } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function JwtDecoder({ tool }: { tool: Tool }) {
    const [token, setToken] = useState('');

    const decoded = useMemo(() => {
        if (!token) return null;
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return { error: 'Invalid JWT structure. Expected 3 parts (header.payload.signature).' };
            }

            const decodePart = (part: string) => {
                try {
                    const base64Url = part.replace(/-/g, '+').replace(/_/g, '/');
                    const base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    return JSON.parse(base64);
                } catch (e) {
                    return null;
                }
            };

            const header = decodePart(parts[0]);
            const payload = decodePart(parts[1]);

            if (!header && !payload) { // If parsing strictly fails
                // Fallback to simple atob if unicode fix fails
                try {
                    return {
                        header: JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))),
                        payload: JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
                    };
                } catch (e) {
                    return { error: 'Failed to decode Base64 URL sections.' };
                }
            }

            return { header, payload };
        } catch (e) {
            return { error: (e as Error).message };
        }
    }, [token]);

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">JWT Token</label>
                <textarea
                    className="tool-textarea"
                    rows={5}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ey..."
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                />
            </div>

            {decoded && (
                <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <div>
                        <label className="tool-label">Header</label>
                        <textarea
                            readOnly
                            className="tool-textarea"
                            rows={10}
                            value={decoded.error || (decoded.header ? JSON.stringify(decoded.header, null, 2) : 'Invalid Header')}
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', backgroundColor: decoded.error ? '#fff0f0' : 'var(--color-bg)' }}
                        />
                    </div>
                    <div>
                        <label className="tool-label">Payload</label>
                        <textarea
                            readOnly
                            className="tool-textarea"
                            rows={10}
                            value={decoded.error || (decoded.payload ? JSON.stringify(decoded.payload, null, 2) : 'Invalid Payload')}
                            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', backgroundColor: decoded.error ? '#fff0f0' : 'var(--color-bg)' }}
                        />
                    </div>
                </div>
            )}
        </ToolShell>
    );
}
