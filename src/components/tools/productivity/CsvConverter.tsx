import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Check, Upload } from 'lucide-react';

export function CsvConverter({ tool }: { tool: Tool }) {
    const [csv, setCsv] = useState('');
    const [json, setJson] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        setError('');
        if (!csv.trim()) return;

        Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setError('Error parsing CSV: ' + results.errors[0].message);
                } else {
                    setJson(JSON.stringify(results.data, null, 2));
                }
            },
            error: (err: Error) => {
                setError(err.message);
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setCsv(text);
                // Auto convert on upload
                // We need to wait for state update or pass text directly?
                // Better let user verify first or use effect. Let's convert manually for now to keep it simple, or just set it.
            };
            reader.readAsText(file);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[700px]">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">CSV Input</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Button variant="ghost" size="sm" className="gap-2 pointer-events-none">
                                <Upload className="w-4 h-4" /> Upload File
                            </Button>
                        </div>
                    </div>
                    <textarea
                        className="flex-1 w-full p-4 rounded-lg border bg-background font-mono text-xs resize-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder={`id,name,email\n1,John,john@example.com\n2,Jane,jane@example.com`}
                        value={csv}
                        onChange={(e) => setCsv(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">JSON Output</label>
                        {json && (
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-2">
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                Copy
                            </Button>
                        )}
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            readOnly
                            className="absolute inset-0 w-full h-full p-4 rounded-lg border bg-muted/30 font-mono text-xs resize-none outline-none"
                            value={json}
                            placeholder="JSON result will appear here..."
                        />
                        {error && (
                            <div className="absolute top-2 left-2 right-2 bg-destructive/10 text-destructive text-xs p-2 rounded border border-destructive/20">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-4">
                <Button onClick={handleConvert} disabled={!csv} className="gap-2">
                    Convert CSV to JSON <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </ToolShell>
    );
}
