import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

type Base = 'bin' | 'oct' | 'dec' | 'hex';

export function BaseConverter({ tool }: { tool: Tool }) {
    const [values, setValues] = useState({
        bin: '',
        oct: '',
        dec: '',
        hex: ''
    });

    const [error, setError] = useState<string | null>(null);

    const updateValues = (value: string, fromBase: Base) => {
        if (!value) {
            setValues({ bin: '', oct: '', dec: '', hex: '' });
            setError(null);
            return;
        }

        try {
            let decimal: number;

            // Parse input to decimal
            switch (fromBase) {
                case 'bin':
                    if (/[^01]/.test(value)) throw new Error('Invalid binary digit');
                    decimal = parseInt(value, 2);
                    break;
                case 'oct':
                    if (/[^0-7]/.test(value)) throw new Error('Invalid octal digit');
                    decimal = parseInt(value, 8);
                    break;
                case 'dec':
                    if (/[^0-9]/.test(value)) throw new Error('Invalid decimal digit');
                    decimal = parseInt(value, 10);
                    break;
                case 'hex':
                    if (/[^0-9a-fA-F]/.test(value)) throw new Error('Invalid hex digit');
                    decimal = parseInt(value, 16);
                    break;
            }

            if (isNaN(decimal)) throw new Error('Invalid number');

            setError(null);
            setValues({
                bin: decimal.toString(2),
                oct: decimal.toString(8),
                dec: decimal.toString(10),
                hex: decimal.toString(16).toUpperCase()
            });
        } catch (err) {
            setError((err as Error).message);
            // Keep the input value that caused error, but maybe clear others or leave them stale?
            // User experience: Let's just update the changed field and leave others as is, 
            // but effectively we can't calculate others.
            // Better: update the specific field being typed, but don't update others if invalid.
            setValues(prev => ({
                ...prev,
                [fromBase]: value
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, base: Base) => {
        updateValues(e.target.value, base);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="max-w-xl mx-auto flex flex-col gap-6">
                {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 mb-2">
                        {error}
                    </div>
                )}

                <div className="grid gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium flex items-center justify-between">
                            Decimal (Base 10)
                            <span className="text-xs text-muted-foreground font-normal">Normal numbers (0-9)</span>
                        </label>
                        <input
                            type="text"
                            value={values.dec}
                            onChange={(e) => handleChange(e, 'dec')}
                            className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium flex items-center justify-between">
                            Hexadecimal (Base 16)
                            <span className="text-xs text-muted-foreground font-normal">Web colors, memory (0-9, A-F)</span>
                        </label>
                        <input
                            type="text"
                            value={values.hex}
                            onChange={(e) => handleChange(e, 'hex')}
                            className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring uppercase"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium flex items-center justify-between">
                            Binary (Base 2)
                            <span className="text-xs text-muted-foreground font-normal">Computers (0-1)</span>
                        </label>
                        <textarea
                            value={values.bin}
                            onChange={(e) => updateValues(e.target.value, 'bin')}
                            className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium flex items-center justify-between">
                            Octal (Base 8)
                            <span className="text-xs text-muted-foreground font-normal">Unix permissions (0-7)</span>
                        </label>
                        <input
                            type="text"
                            value={values.oct}
                            onChange={(e) => handleChange(e, 'oct')}
                            className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
