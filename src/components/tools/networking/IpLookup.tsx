import { useState, useEffect } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { MapPin, Globe, Loader2 } from 'lucide-react';

interface IpData {
    ip: string;
    city?: string;
    region?: string;
    country_name?: string;
    country_code?: string;
    org?: string; // ISP
    asn?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
}

export function IpLookup({ tool }: { tool: Tool }) {
    const [ip, setIp] = useState('');
    const [data, setData] = useState<IpData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchIp = async (targetIp: string = '') => {
        setLoading(true);
        setError('');
        setData(null);
        try {
            // Using ipapi.co (Free tier, no key required for basic usage, rate limited)
            const url = targetIp
                ? `https://ipapi.co/${targetIp}/json/`
                : 'https://ipapi.co/json/';

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch IP details');

            const json = await res.json();
            if (json.error) throw new Error(json.reason || 'Error fetching data');

            setData(json);
            if (!targetIp) setIp(json.ip);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user IP on mount
    useEffect(() => {
        fetchIp();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchIp(ip);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="max-w-2xl mx-auto flex flex-col gap-8">
                {/* Search */}
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="Enter IP address (e.g., 8.8.8.8) or leave empty for yours"
                        className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
                        Lookup
                    </button>
                </form>

                {error && (
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-center">
                        {error}
                    </div>
                )}

                {data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Main Card */}
                        <div className="col-span-1 md:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col items-center justify-center text-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">{data.ip}</h2>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {data.city}, {data.region}, {data.country_name}
                            </p>
                        </div>

                        {/* Details Cards */}
                        <InfoCard label="ISP / Organization" value={data.org} />
                        <InfoCard label="ASN" value={data.asn} />
                        <InfoCard label="Timezone" value={data.timezone} />
                        <InfoCard label="Coordinates" value={`${data.latitude}, ${data.longitude}`} />
                        <InfoCard label="Country Code" value={data.country_code} />
                        <InfoCard label="Calling Code" value={(data as any).country_calling_code} />
                    </div>
                )}

                <p className="text-xs text-center text-muted-foreground mt-8">
                    Data provided by ipapi.co. This is a client-side lookup.
                </p>
            </div>
        </ToolShell>
    );
}

function InfoCard({ label, value }: { label: string, value?: string | number }) {
    return (
        <div className="p-4 rounded-lg border border-border bg-muted/20">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">{label}</div>
            <div className="text-lg font-medium truncate" title={String(value)}>{value || 'N/A'}</div>
        </div>
    );
}
