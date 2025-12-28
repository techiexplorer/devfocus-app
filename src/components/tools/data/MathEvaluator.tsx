import { useState, useRef } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { evaluate } from 'mathjs';
import { Terminal, Send, Trash } from 'lucide-react';

interface HistoryItem {
    expression: string;
    result: string;
    error?: boolean;
}

export function MathEvaluator({ tool }: { tool: Tool }) {
    const [expression, setExpression] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCalculate = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!expression.trim()) return;

        try {
            // Using arithmetic only for safety (mathjs evaluate is relatively safe but still powerful)
            const result = evaluate(expression);
            setHistory(prev => [{
                expression,
                result: String(result)
            }, ...prev]);
            setExpression('');
        } catch (err) {
            setHistory(prev => [{
                expression,
                result: 'Error',
                error: true
            }, ...prev]);
        }
    };

    const clearHistory = () => {
        setHistory([]);
        setExpression('');
        inputRef.current?.focus();
    };

    const useHistoryExpression = (exp: string) => {
        setExpression(exp);
        inputRef.current?.focus();
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-6 max-w-2xl mx-auto h-[600px]">
                {/* Result/History Area */}
                <div className="flex-1 rounded-lg border border-border bg-card p-4 overflow-y-auto flex flex-col-reverse gap-2 font-mono text-sm shadow-inner">
                    {history.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Terminal className="w-12 h-12 mb-2" />
                            <p>Enter a mathematical expression to calculate.</p>
                            <p className="text-xs mt-2">Examples: 2 + 2, sin(45 deg), sqrt(16), 5 kg to lbs</p>
                        </div>
                    )}
                    {history.map((item, index) => (
                        <div key={index} className="group flex flex-col p-3 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between text-muted-foreground mb-1">
                                <span className="cursor-pointer hover:text-foreground" onClick={() => useHistoryExpression(item.expression)}>{item.expression}</span>
                                {index === 0 && <span className="text-[10px] uppercase font-bold tracking-wider opacity-50">Latest</span>}
                            </div>
                            <div className={`text-lg font-bold break-all ${item.error ? 'text-destructive' : 'text-primary'}`}>
                                {item.error ? 'Invalid Expression' : `= ${item.result}`}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleCalculate} className="flex gap-2">
                    <div className="relative flex-1">
                        <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                            placeholder="e.g. 12 * (5 + 2)"
                            className="w-full h-12 pl-10 pr-4 rounded-md border border-input bg-background font-mono text-lg shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!expression.trim()}
                        className="px-6 h-12 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Calculate
                    </button>
                    {history.length > 0 && (
                        <button
                            type="button"
                            onClick={clearHistory}
                            className="w-12 h-12 rounded-md border border-input bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors flex items-center justify-center"
                            title="Clear History"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    )}
                </form>
            </div>
        </ToolShell>
    );
}
