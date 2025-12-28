import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { ArrowRightLeft } from 'lucide-react';

const CATEGORIES = {
    length: {
        name: 'Length',
        units: {
            m: 'Meter',
            km: 'Kilometer',
            cm: 'Centimeter',
            mm: 'Millimeter',
            ft: 'Feet',
            in: 'Inch',
            yd: 'Yard',
            mi: 'Mile'
        },
        rates: {
            m: 1,
            km: 0.001,
            cm: 100,
            mm: 1000,
            ft: 3.28084,
            in: 39.3701,
            yd: 1.09361,
            mi: 0.000621371
        }
    },
    weight: {
        name: 'Weight',
        units: {
            kg: 'Kilogram',
            g: 'Gram',
            mg: 'Milligram',
            lb: 'Pound',
            oz: 'Ounce',
            st: 'Stone'
        },
        rates: {
            kg: 1,
            g: 1000,
            mg: 1000000,
            lb: 2.20462,
            oz: 35.274,
            st: 0.157473
        }
    },
    temperature: {
        name: 'Temperature',
        units: {
            c: 'Celsius',
            f: 'Fahrenheit',
            k: 'Kelvin'
        }
    },
    data: {
        name: 'Digital Storage',
        units: {
            b: 'Byte',
            kb: 'Kilobyte',
            mb: 'Megabyte',
            gb: 'Gigabyte',
            tb: 'Terabyte',
            pb: 'Petabyte'
        },
        rates: {
            b: 1,
            kb: 1 / 1024,
            mb: 1 / (1024 * 1024),
            gb: 1 / (1024 * 1024 * 1024),
            tb: 1 / (1024 * 1024 * 1024 * 1024),
            pb: 1 / (1024 * 1024 * 1024 * 1024 * 1024)
        }
    }
} as const;

type Category = keyof typeof CATEGORIES;

export function UnitConverter({ tool }: { tool: Tool }) {
    const [category, setCategory] = useState<Category>('length');
    const [fromUnit, setFromUnit] = useState(Object.keys(CATEGORIES['length'].units)[0]);
    const [toUnit, setToUnit] = useState(Object.keys(CATEGORIES['length'].units)[1]);
    const [fromValue, setFromValue] = useState<number>(1);

    const handleCategoryChange = (c: Category) => {
        setCategory(c);
        const units = Object.keys(CATEGORIES[c].units);
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
        setFromValue(1);
    };

    const convert = (value: number, from: string, to: string, cat: Category): number => {
        if (cat === 'temperature') {
            if (from === to) return value;
            let celsius = value;
            // To Celsius
            if (from === 'f') celsius = (value - 32) * 5 / 9;
            if (from === 'k') celsius = value - 273.15;

            // From Celsius
            if (to === 'c') return celsius;
            if (to === 'f') return (celsius * 9 / 5) + 32;
            if (to === 'k') return celsius + 273.15;
            return celsius;
        }

        const rates = (CATEGORIES[cat] as any).rates;
        const fromRate = rates[from];
        const toRate = rates[to];
        return (value / fromRate) * toRate;
    };

    const result = convert(fromValue, fromUnit, toUnit, category);

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">
                <div className="flex justify-center">
                    <div className="inline-flex rounded-lg border border-input p-1 bg-muted/20">
                        {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                            <button
                                key={c}
                                onClick={() => handleCategoryChange(c)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${category === c
                                        ? 'bg-background shadow-sm text-foreground'
                                        : 'text-muted-foreground hover:bg-muted/50'
                                    }`}
                            >
                                {CATEGORIES[c].name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                    {/* From */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-muted-foreground">From</label>
                        <input
                            type="number"
                            value={fromValue}
                            onChange={(e) => setFromValue(parseFloat(e.target.value) || 0)}
                            className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm"
                        >
                            {Object.entries(CATEGORIES[category].units).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Operator */}
                    <div className="flex justify-center pt-6">
                        <div className="p-2 rounded-full bg-muted text-muted-foreground">
                            <ArrowRightLeft className="w-6 h-6" />
                        </div>
                    </div>

                    {/* To */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-muted-foreground">To</label>
                        <div className="h-12 w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-lg flex items-center font-semibold overflow-hidden">
                            {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </div>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm"
                        >
                            {Object.entries(CATEGORIES[category].units).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
