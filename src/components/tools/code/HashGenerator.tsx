import { useState, useEffect } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export function HashGenerator({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const generateHashes = async () => {
            if (!input) {
                setHashes({});
                return;
            }
            const encoder = new TextEncoder();
            const data = encoder.encode(input);

            const toHex = (buffer: ArrayBuffer) =>
                Array.from(new Uint8Array(buffer))
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('');

            try {
                const sha1Buf = await crypto.subtle.digest('SHA-1', data);
                const sha256Buf = await crypto.subtle.digest('SHA-256', data);
                const sha384Buf = await crypto.subtle.digest('SHA-384', data);
                const sha512Buf = await crypto.subtle.digest('SHA-512', data);

                setHashes({
                    'SHA-1': toHex(sha1Buf),
                    'SHA-256': toHex(sha256Buf),
                    'SHA-384': toHex(sha384Buf),
                    'SHA-512': toHex(sha512Buf),
                });
            } catch (e) {
                console.error('Hashing failed', e);
            }
        };

        generateHashes();
    }, [input]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Input Text
                    </label>
                    <Textarea
                        rows={3}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type something here..."
                        className="font-mono text-sm"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Hashes</h3>
                    <div className="space-y-4">
                        {Object.entries(hashes).map(([algo, hash]) => (
                            <div key={algo} className="space-y-1.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{algo}</span>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={hash}
                                        className="font-mono text-xs"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyToClipboard(hash)}
                                        title="Copy"
                                        className="shrink-0"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {!input && (
                            <div className="text-sm text-muted-foreground italic py-8 text-center border rounded-md border-dashed">
                                Start typing above to generate hashes securely in real-time.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
