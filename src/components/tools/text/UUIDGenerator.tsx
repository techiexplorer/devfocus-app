import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

// Minimal UUID v4 implementation using crypto.randomUUID


export function UUIDGenerator({ tool }: { tool: Tool }) {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(1);
    const [hyphens, setHyphens] = useState(true);
    const [uppercase, setUppercase] = useState(false);

    const generate = () => {
        const newUuids: string[] = [];
        for (let i = 0; i < count; i++) {
            let uuid: string = crypto.randomUUID();
            if (!hyphens) uuid = uuid.replace(/-/g, '');
            if (uppercase) uuid = uuid.toUpperCase();
            newUuids.push(uuid);
        }
        setUuids(newUuids);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">Quantity</label>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="tool-input"
                />
            </div>

            <div className="tool-form-group" style={{ flexDirection: 'row', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={hyphens}
                        onChange={(e) => setHyphens(e.target.checked)}
                    />
                    Hyphens
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={uppercase}
                        onChange={(e) => setUppercase(e.target.checked)}
                    />
                    Uppercase
                </label>
            </div>

            <div className="tool-actions">
                <button className="btn btn-primary" onClick={generate}>
                    Generate UUIDs
                </button>
                {uuids.length > 0 && (
                    <button className="btn btn-secondary" onClick={copyToClipboard}>
                        Copy Result
                    </button>
                )}
            </div>

            {uuids.length > 0 && (
                <div className="tool-form-group" style={{ marginTop: '2rem' }}>
                    <label className="tool-label">Result</label>
                    <textarea
                        readOnly
                        value={uuids.join('\n')}
                        rows={Math.min(count, 10)}
                        className="tool-textarea"
                        style={{ resize: 'vertical' }}
                    />
                </div>
            )}
        </ToolShell>
    );
}
