import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function CodeMinifier({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [type, setType] = useState<'css' | 'json' | 'js'>('css');
    const [output, setOutput] = useState('');

    const minify = () => {
        if (!input.trim()) return;
        let res = input;

        if (type === 'json') {
            try {
                res = JSON.stringify(JSON.parse(input));
            } catch (e) {
                res = "Invalid JSON";
            }
        } else if (type === 'css') {
            // Simple regex minification for CSS (removes newlines, comments, extra spaces)
            res = res
                .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
                .replace(/\s+/g, " ") // Collapse whitespace
                .replace(/\s*([{}:;,])\s*/g, "$1") // Remove space around chars
                .replace(/;\}/g, "}") // Remove trailing semicolon
                .trim();
        } else if (type === 'js') {
            // Very basic JS minification (WARNING: Basic)
            // ideally use a library, but sticking to lightweight regex for "simple" usage
            res = res
                // Remove single line comments
                .replace(/\/\/.*/g, "")
                // Remove multi line comments
                .replace(/\/\*[\s\S]*?\*\//g, "")
                // Collapse whitespace (riskier in JS due to strings/template literals, keeping safe mostly)
                .replace(/\s+/g, " ");
            // Note: Real JS minification requires AST usually.
        }
        setOutput(res);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="radio" name="min-type" checked={type === 'css'} onChange={() => setType('css')} /> CSS
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="radio" name="min-type" checked={type === 'json'} onChange={() => setType('json')} /> JSON
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="radio" name="min-type" checked={type === 'js'} onChange={() => setType('js')} /> JS (Basic)
                    </label>
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
                <button className="btn btn-primary" onClick={minify}>Minify</button>
            </div>

            {output && (
                <div className="tool-form-group" style={{ marginTop: '2rem' }}>
                    <label className="tool-label">Minified Output</label>
                    <textarea
                        className="tool-textarea"
                        rows={10}
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
