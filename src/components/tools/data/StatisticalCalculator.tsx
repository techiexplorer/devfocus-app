import { useState, useMemo } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Calculator } from 'lucide-react';

export function StatisticalCalculator({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [separator, setSeparator] = useState(',');

    const stats = useMemo(() => {
        // Parse numbers
        let numbers: number[] = [];
        if (input.trim()) {
            const splitRegex = separator === '\\n' ? /\r?\n/ : new RegExp(`[${separator}\\s]+`);
            numbers = input
                .split(splitRegex)
                .map(s => parseFloat(s.trim()))
                .filter(n => !isNaN(n));
        }

        if (numbers.length === 0) return null;

        numbers.sort((a, b) => a - b);

        const count = numbers.length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / count;

        // Median
        const mid = Math.floor(count / 2);
        const median = count % 2 !== 0 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;

        // Mode
        const counts = new Map<number, number>();
        let maxFreq = 0;
        numbers.forEach(n => {
            const c = (counts.get(n) || 0) + 1;
            counts.set(n, c);
            if (c > maxFreq) maxFreq = c;
        });
        const mode = maxFreq > 1 ? [...counts.entries()].filter(([_, c]) => c === maxFreq).map(([n]) => n) : [];

        // Range
        const min = numbers[0];
        const max = numbers[count - 1];
        const range = max - min;

        // Variance & Standard Deviation (Population)
        const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
        const stdDev = Math.sqrt(variance);

        // Standard Deviation (Sample)
        const stdDevSample = count > 1 ? Math.sqrt(numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (count - 1)) : 0;

        return {
            count,
            sum,
            mean,
            median,
            mode: mode.length > 0 ? mode.join(', ') : 'No mode',
            min,
            max,
            range,
            variance,
            stdDev,
            stdDevSample
        };
    }, [input, separator]);

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Data Set</label>
                        <select
                            value={separator}
                            onChange={(e) => setSeparator(e.target.value)}
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                            <option value=",">Separate by Comma</option>
                            <option value=" ">Separate by Space</option>
                            <option value="\n">Separate by Newline</option>
                            <option value=";">Separate by Semicolon</option>
                        </select>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter numbers separated by comma (e.g. 10, 20, 15, 40)"
                        className="flex-1 min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                    <div className="text-xs text-muted-foreground">
                        Supports standard numbers. Non-numeric values will be ignored.
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-sm font-medium">Statistics</label>
                    {!stats ? (
                        <div className="flex-1 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                            <Calculator className="w-12 h-12 mb-4 opacity-50" />
                            <p>Enter data to calculate statistics</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <StatCard label="Count (N)" value={stats.count} />
                            <StatCard label="Sum (Σ)" value={stats.sum} />
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Mean (Average)" value={stats.mean} highlight />
                                <StatCard label="Median" value={stats.median} highlight />
                            </div>
                            <StatCard label="Mode" value={stats.mode} />
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Minimum" value={stats.min} />
                                <StatCard label="Maximum" value={stats.max} />
                            </div>
                            <StatCard label="Range" value={stats.range} />
                            <div className="border-t border-border/50 my-2"></div>
                            <StatCard label="Standard Deviation (σ)" value={stats.stdDev} />
                            <StatCard label="Standard Deviation (Sample)" value={stats.stdDevSample} />
                            <StatCard label="Variance (σ²)" value={stats.variance} />
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}

function StatCard({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) {
    const displayValue = typeof value === 'number'
        ? value.toLocaleString(undefined, { maximumFractionDigits: 4 })
        : value;

    return (
        <div className={`p-3 rounded-lg border ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className={`font-mono font-medium truncate ${highlight ? 'text-primary text-xl' : 'text-foreground text-lg'}`}>
                {displayValue}
            </div>
        </div>
    );
}
