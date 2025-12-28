import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Eraser, ArrowRight, Copy } from 'lucide-react';

export function DataSanitizer({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    // Options
    const [trimWhitespace, setTrimWhitespace] = useState(true);
    const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
    const [removeDuplicates, setRemoveDuplicates] = useState(false);
    const [removePunctuation, setRemovePunctuation] = useState(false);
    const [toLowerCase, setToLowerCase] = useState(false);

    const process = () => {
        if (!input) return;

        let lines = input.split('\n');

        if (trimWhitespace) {
            lines = lines.map(line => line.trim());
        }

        if (removeEmptyLines) {
            lines = lines.filter(line => line.length > 0);
        }

        if (removePunctuation) {
            lines = lines.map(line => line.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""));
        }

        if (toLowerCase) {
            lines = lines.map(line => line.toLowerCase());
        }

        if (removeDuplicates) {
            lines = Array.from(new Set(lines));
        }

        setOutput(lines.join('\n'));
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-6 items-start h-[700px] lg:h-[600px]">
                {/* Input */}
                <div className="flex flex-col h-full gap-2">
                    <label className="text-sm font-medium">Raw Data</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your list or text here..."
                        className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                        {input ? input.split('\n').length : 0} lines
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4 p-4 rounded-lg bg-muted/20 border border-border h-auto lg:h-full justify-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Eraser className="w-4 h-4" /> Operations
                    </h3>

                    <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={trimWhitespace}
                                onChange={(e) => setTrimWhitespace(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Trim Whitespace</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={removeEmptyLines}
                                onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Remove Empty Lines</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={removeDuplicates}
                                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Remove Duplicates</span>
                        </label>
                        <div className="h-px bg-border/50 my-2"></div>
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={removePunctuation}
                                onChange={(e) => setRemovePunctuation(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Remove Punctuation</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={toLowerCase}
                                onChange={(e) => setToLowerCase(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>To Lowercase</span>
                        </label>
                    </div>

                    <button
                        onClick={process}
                        disabled={!input}
                        className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        Sanitize <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Output */}
                <div className="flex flex-col h-full gap-2">
                    <label className="text-sm font-medium flex justify-between items-center">
                        Clean Data
                        {output && (
                            <button
                                onClick={() => navigator.clipboard.writeText(output)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                        )}
                    </label>
                    <textarea
                        readOnly
                        value={output}
                        placeholder="Result will appear here..."
                        className="flex-1 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono focus-visible:outline-none resize-none"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                        {output ? output.split('\n').length : 0} lines
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
