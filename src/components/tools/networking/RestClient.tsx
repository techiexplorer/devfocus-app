import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Send, Plus, Trash2, Globe } from 'lucide-react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface Header {
    key: string;
    value: string;
}

export function RestClient({ tool }: { tool: Tool }) {
    const [method, setMethod] = useState<Method>('GET');
    const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
    const [headers, setHeaders] = useState<Header[]>([{ key: 'Content-Type', value: 'application/json' }]);
    const [body, setBody] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
    const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
    const updateHeader = (index: number, field: keyof Header, value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const sendRequest = async () => {
        setLoading(true);
        setError('');
        setResponse(null);

        try {
            const headerObj: Record<string, string> = {};
            headers.forEach(h => {
                if (h.key) headerObj[h.key] = h.value;
            });

            const options: RequestInit = {
                method,
                headers: headerObj,
            };

            if (method !== 'GET' && body) {
                options.body = body;
            }

            const startTime = performance.now();
            const res = await fetch(url, options);
            const endTime = performance.now();

            const text = await res.text();
            let data = text;
            try {
                data = JSON.parse(text);
            } catch (e) {
                // Not JSON
            }

            const resHeaders: Record<string, string> = {};
            res.headers.forEach((val, key) => resHeaders[key] = val);

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: resHeaders,
                data,
                time: Math.round(endTime - startTime)
            });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px] lg:h-[700px]">
                {/* Request Column */}
                <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2">
                    <div className="flex gap-2">
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value as Method)}
                            className="w-28 rounded-md border border-input bg-background px-3 py-2 font-semibold"
                        >
                            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://api.example.com/endpoint"
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                        />
                        <button
                            onClick={sendRequest}
                            disabled={loading || !url}
                            className="px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Tabs area for Headers/Body could go here, lets stick to simple blocks */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Headers</label>
                            <button onClick={addHeader} className="text-xs text-primary flex items-center gap-1 hover:underline">
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        </div>
                        {headers.map((header, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    placeholder="Key"
                                    value={header.key}
                                    onChange={(e) => updateHeader(i, 'key', e.target.value)}
                                    className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
                                />
                                <input
                                    placeholder="Value"
                                    value={header.value}
                                    onChange={(e) => updateHeader(i, 'value', e.target.value)}
                                    className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
                                />
                                <button onClick={() => removeHeader(i)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-sm font-medium">Body (JSON/Text)</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm resize-none"
                                placeholder='{"key": "value"}'
                            />
                        </div>
                    )}
                </div>

                {/* Response Column */}
                <div className="flex flex-col gap-4 h-full overflow-hidden border-l border-border pl-6">
                    <label className="text-sm font-medium flex items-center gap-2">
                        Response
                        {response && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${response.status >= 200 && response.status < 300 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {response.status} {response.statusText}
                            </span>
                        )}
                        {response && <span className="text-xs text-muted-foreground">{response.time}ms</span>}
                    </label>

                    {error && (
                        <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                            <strong>Error:</strong> {error}
                            <p className="text-xs mt-2 text-muted-foreground">Note: Browser CORS policies may block requests to servers that don't explicitly allow them.</p>
                        </div>
                    )}

                    {!response && !error && (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50 bg-muted/20 rounded-lg">
                            <Globe className="w-12 h-12 mb-2" />
                            <p>Send a request to see the response</p>
                        </div>
                    )}

                    {response && (
                        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                                <label className="text-xs font-semibold text-muted-foreground">Body</label>
                                <div className="flex-1 overflow-auto rounded-md border border-input bg-muted/30 p-3">
                                    <pre className="text-xs font-mono whitespace-pre-wrap">
                                        {typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : response.data}
                                    </pre>
                                </div>
                            </div>
                            <div className="h-1/3 flex flex-col gap-2 overflow-hidden">
                                <label className="text-xs font-semibold text-muted-foreground">Headers</label>
                                <div className="flex-1 overflow-auto rounded-md border border-input bg-muted/30 p-3">
                                    <pre className="text-xs font-mono">
                                        {JSON.stringify(response.headers, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
