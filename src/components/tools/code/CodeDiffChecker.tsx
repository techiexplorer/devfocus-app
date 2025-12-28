import { useState } from 'react';
import * as Diff from 'diff';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function CodeDiffChecker({ tool }: { tool: Tool }) {
    const [oldCode, setOldCode] = useState('');
    const [newCode, setNewCode] = useState('');
    const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);

    const compare = () => {
        // defaults to char diff if not line diff? let's do generic 'diffWords' or 'diffLines'
        // diffLines usually better for code
        const diff = Diff.diffLines(oldCode, newCode);
        setDiffResult(diff);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="tool-form-group">
                    <label className="tool-label">Original Code</label>
                    <textarea
                        className="tool-textarea"
                        rows={10}
                        value={oldCode}
                        onChange={(e) => setOldCode(e.target.value)}
                        placeholder="Paste original code..."
                    />
                </div>
                <div className="tool-form-group">
                    <label className="tool-label">New Code</label>
                    <textarea
                        className="tool-textarea"
                        rows={10}
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="Paste new code..."
                    />
                </div>
            </div>

            <div className="tool-actions">
                <button className="btn btn-primary" onClick={compare}>Compare</button>
            </div>

            {diffResult.length > 0 && (
                <div className="tool-form-group" style={{ marginTop: '2rem' }}>
                    <label className="tool-label">Differences</label>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {diffResult.map((part, index) => (
                            <span
                                key={index}
                                style={{
                                    backgroundColor: part.added ? 'rgba(0, 255, 0, 0.2)' : part.removed ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
                                    color: part.added ? 'var(--color-text)' : part.removed ? 'var(--color-text)' : 'var(--color-text-dim)',
                                    textDecoration: part.removed ? 'line-through' : 'none'
                                }}
                            >
                                {part.value}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </ToolShell>
    );
}
