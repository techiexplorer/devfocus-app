import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
            res = res
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .replace(/\s+/g, " ")
                .replace(/\s*([{}:;,])\s*/g, "$1")
                .replace(/;\}/g, "}")
                .trim();
        } else if (type === 'js') {
            res = res
                .replace(/\/\/.*/g, "")
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .replace(/\s+/g, " ");
        }
        setOutput(res);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium leading-none">Type</label>
                    <div className="flex gap-4">
                        {(['css', 'json', 'js'] as const).map((t) => (
                            <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="min-type"
                                    checked={type === t}
                                    onChange={() => setType(t)}
                                    className="accent-primary"
                                />
                                {t.toUpperCase()} {t === 'js' && '(Basic)'}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Input Code</label>
                    <Textarea
                        rows={10}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="font-mono text-xs"
                    />
                </div>

                <Button onClick={minify}>Minify</Button>

                {output && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Minified Output</label>
                        <Textarea
                            rows={10}
                            value={output}
                            readOnly
                            className="font-mono text-xs bg-muted"
                        />
                        <Button
                            variant="secondary"
                            onClick={() => navigator.clipboard.writeText(output)}
                        >
                            Copy Output
                        </Button>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
