import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function TextCaseConverter({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const transforms = {
        upper: (s: string) => s.toUpperCase(),
        lower: (s: string) => s.toLowerCase(),
        camel: (s: string) => s.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, ''),
        snake: (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            .join('_') || s,
        kebab: (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            .join('-') || s,
        title: (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()),
        pascal: (s: string) => s.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, ''),
    };

    const handleTransform = (type: keyof typeof transforms) => {
        setResult(transforms[type](input));
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="tool-form-group">
                <label className="tool-label">Input Text</label>
                <textarea
                    className="tool-textarea"
                    rows={5}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something here..."
                />
            </div>

            <div className="tool-actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => handleTransform('upper')}>UPPER CASE</button>
                <button className="btn btn-secondary" onClick={() => handleTransform('lower')}>lower case</button>
                <button className="btn btn-secondary" onClick={() => handleTransform('camel')}>camelCase</button>
                <button className="btn btn-secondary" onClick={() => handleTransform('snake')}>snake_case</button>
                <button className="btn btn-secondary" onClick={() => handleTransform('kebab')}>kebab-case</button>
                <button className="btn btn-secondary" onClick={() => handleTransform('title')}>Title Case</button>
                <button className="btn btn-secondary" onClick={() => handleTransform('pascal')}>PascalCase</button>
            </div>

            {result && (
                <div className="tool-form-group" style={{ marginTop: '2rem' }}>
                    <label className="tool-label">Result</label>
                    <textarea
                        className="tool-textarea"
                        rows={5}
                        value={result}
                        readOnly
                    />
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', width: 'fit-content' }}
                        onClick={() => navigator.clipboard.writeText(result)}
                    >
                        Copy
                    </button>
                </div>
            )}
        </ToolShell>
    );
}
