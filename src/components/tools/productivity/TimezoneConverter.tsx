import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { toZonedTime, format as formatTz } from 'date-fns-tz';
import { Clock, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Common timezones list
const TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Australia/Sydney',
    'Asia/Kolkata',
    'Asia/Dubai'
].sort();

export function TimezoneConverter({ tool }: { tool: Tool }) {
    const [baseTime, setBaseTime] = useState(new Date().toISOString().slice(0, 16));
    const [selectedZones, setSelectedZones] = useState<string[]>(['UTC', 'America/New_York']);

    const addZone = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const zone = e.target.value;
        if (zone && !selectedZones.includes(zone)) {
            setSelectedZones([...selectedZones, zone]);
        }
    };

    const removeZone = (zone: string) => {
        setSelectedZones(selectedZones.filter(z => z !== zone));
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Base Time Input */}
                <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Select Date & Time (Local)</label>
                        <input
                            type="datetime-local"
                            value={baseTime}
                            onChange={(e) => setBaseTime(e.target.value)}
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-lg font-mono shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </div>

                {/* Zone List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" /> Converted Times
                        </h3>

                        <div className="relative">
                            <select
                                className="opacity-0 absolute inset-0 w-full cursor-pointer"
                                onChange={addZone}
                                value=""
                            >
                                <option value="">Add Timezone...</option>
                                {TIMEZONES.map(tz => (
                                    <option key={tz} value={tz} disabled={selectedZones.includes(tz)}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Plus className="w-4 h-4" /> Add Timezone
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {selectedZones.map(zone => {
                            let timeStr = 'Invalid Date';
                            try {
                                const date = new Date(baseTime);
                                const zonedDate = toZonedTime(date, zone);
                                timeStr = formatTz(zonedDate, 'PPpp', { timeZone: zone });
                            } catch (e) {
                                // invalid date input maybe
                            }

                            return (
                                <div key={zone} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors group">
                                    <div>
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{zone}</div>
                                        <div className="text-xl font-mono">{timeStr}</div>
                                    </div>
                                    <button
                                        onClick={() => removeZone(zone)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
