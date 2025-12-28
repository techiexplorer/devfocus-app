import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function MarkdownEditor({ tool }: { tool: Tool }) {
    const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing **markdown** here!');
    const [html, setHtml] = useState('');

    useEffect(() => {
        // Basic type assertion since marked can return Promise or string
        const result = marked(markdown, { async: false });
        if (typeof result === 'string') {
            setHtml(result);
        }
    }, [markdown]);

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '600px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className="tool-label" style={{ marginBottom: '0.5rem' }}>Markdown Input</label>
                    <textarea
                        className="tool-textarea"
                        style={{ flex: 1, resize: 'none' }}
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className="tool-label" style={{ marginBottom: '0.5rem' }}>Preview</label>
                    <div
                        style={{
                            flex: 1,
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '1rem',
                            overflowY: 'auto',
                            backgroundColor: 'var(--color-bg)'
                        }}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
            </div>

            <div className="tool-actions">
                <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(html)}>
                    Copy HTML
                </button>
                <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(markdown)}>
                    Copy Markdown
                </button>
            </div>
        </ToolShell>
    );
}
