import { useState } from 'react';
import * as Diff from 'diff';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CodeDiffChecker({ tool }: { tool: Tool }) {
    const [oldCode, setOldCode] = useState('');
    const [newCode, setNewCode] = useState('');
    const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);

    const compare = () => {
        const diff = Diff.diffLines(oldCode, newCode);
        setDiffResult(diff);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Original Code</label>
                        <Textarea
                            rows={10}
                            value={oldCode}
                            onChange={(e) => setOldCode(e.target.value)}
                            placeholder="Paste original code..."
                            className="font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">New Code</label>
                        <Textarea
                            rows={10}
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            placeholder="Paste new code..."
                            className="font-mono text-xs"
                        />
                    </div>
                </div>

                <Button onClick={compare} className="w-full md:w-auto">Compare</Button>

                {diffResult.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Differences</label>
                        <div className="font-mono text-xs border rounded-md p-4 bg-muted/50 overflow-x-auto whitespace-pre-wrap">
                            {diffResult.map((part, index) => (
                                <span
                                    key={index}
                                    className={`${part.added ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                                            part.removed ? 'bg-red-500/20 text-red-700 dark:text-red-300 line-through decoration-red-500/50' :
                                                'opacity-70'
                                        }`}
                                >
                                    {part.value}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
