import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function CodeBeautifier({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [type, setType] = useState<'json'>('json'); // Only JSON reliably supported without heavy libs
    const [output, setOutput] = useState('');

    const beautify = () => {
        if (!input.trim()) return;

        // For now, only JSON is "safe" to beautify without a 4MB parser library
        // The previous JSON Formatter already does this, but we offer it here too for completeness
        try {
            if (type === 'json') {
                setOutput(JSON.stringify(JSON.parse(input), null, 4));
            }
        } catch (e) {
            setOutput("Invalid Content");
        }
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="radio" name="beauty-type" checked={type === 'json'} onChange={() => setType('json')} /> JSON
                    </label>
                    {/* Future: Add HTML/CSS/JS with lazy-loaded prettier */}
                    <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>(More languages coming soon)</span>
                </div>
            </div>

            <div className="tool-form-group">
                <label className="tool-label">Input Code</label>
                <textarea
                    className="tool-textarea"
                    rows={10}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>

            <div className="tool-actions">
                <button className="btn btn-primary" onClick={beautify}>Beautify</button>
            </div>

            {output && (
                <div className="tool-form-group" style={{ marginTop: '2rem' }}>
                    <label className="tool-label">Beautified Output</label>
                    <textarea
                        className="tool-textarea"
                        rows={15}
                        value={output}
                        readOnly
                    />
                    <button
                        className="btn btn-secondary"
                        style={{ marginTop: '0.5rem', width: 'fit-content' }}
                        onClick={() => navigator.clipboard.writeText(output)}
                    >
                        Copy Output
                    </button>
                </div>
            )}
        </ToolShell>
    );
}
