import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Copy, RefreshCw } from 'lucide-react';

const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;

const WORDS = LOREM_TEXT.replace(/[.,?]/g, '').toLowerCase().split(' ');
const SENTENCES = LOREM_TEXT.split('. ').filter(s => s.length > 0);
const PARAGRAPHS = [
    LOREM_TEXT,
    `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.`,
    `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`
];

export function LoremIpsumGenerator({ tool }: { tool: Tool }) {
    const [count, setCount] = useState(3);
    const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
    const [text, setText] = useState('');

    const generate = () => {
        let result: string[] = [];

        switch (type) {
            case 'words':
                for (let i = 0; i < count; i++) {
                    result.push(WORDS[i % WORDS.length]);
                }
                setText(result.join(' '));
                break;
            case 'sentences':
                for (let i = 0; i < count; i++) {
                    let s = SENTENCES[i % SENTENCES.length];
                    if (!s.endsWith('.')) s += '.';
                    result.push(s);
                }
                setText(result.join(' '));
                break;
            case 'paragraphs':
                for (let i = 0; i < count; i++) {
                    result.push(PARAGRAPHS[i % PARAGRAPHS.length]);
                }
                setText(result.join('\n\n'));
                break;
        }
    };

    // Generate initially
    useState(() => {
        generate();
    });

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="paragraphs">Paragraphs</option>
                            <option value="sentences">Sentences</option>
                            <option value="words">Words</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Count</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <button
                        onClick={generate}
                        className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ml-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Generate
                    </button>

                    <button
                        onClick={copyToClipboard}
                        className="h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Copy className="w-4 h-4" />
                        Copy
                    </button>
                </div>

                <div className="relative">
                    <textarea
                        value={text}
                        readOnly
                        className="min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y font-serif leading-relaxed"
                    />
                </div>
            </div>
        </ToolShell>
    );
}
