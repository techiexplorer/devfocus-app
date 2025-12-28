import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CodeBeautifier({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [type, setType] = useState<'json'>('json');
    const [output, setOutput] = useState('');

    const beautify = () => {
        if (!input.trim()) return;

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
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium leading-none">Type</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name="beauty-type"
                                checked={type === 'json'}
                                onChange={() => setType('json')}
                                className="accent-primary"
                            />
                            JSON
                        </label>
                        <span className="text-xs text-muted-foreground">(More languages coming soon)</span>
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

                <Button onClick={beautify}>Beautify</Button>

                {output && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Beautified Output</label>
                        <Textarea
                            rows={15}
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
