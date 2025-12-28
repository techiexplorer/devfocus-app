import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import CryptoJS from 'crypto-js';
import { Lock, Unlock, Copy, ArrowDown } from 'lucide-react';

export function EncryptionTool({ tool }: { tool: Tool }) {
    const [input, setInput] = useState('');
    const [secret, setSecret] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

    const process = () => {
        if (!input || !secret) return;

        try {
            if (mode === 'encrypt') {
                const encrypted = CryptoJS.AES.encrypt(input, secret).toString();
                setOutput(encrypted);
            } else {
                const bytes = CryptoJS.AES.decrypt(input, secret);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                if (!decrypted) throw new Error('Invalid key or malformed ciphertext');
                setOutput(decrypted);
            }
        } catch (e) {
            setOutput('Error: Could not decrypt. Check your key and input.');
        }
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                {/* Mode Selector */}
                <div className="flex bg-muted/30 p-1 rounded-lg self-center">
                    <button
                        onClick={() => { setMode('encrypt'); setOutput(''); }}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'encrypt' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:bg-background/50'
                            }`}
                    >
                        <Lock className="w-4 h-4" /> Encrypt
                    </button>
                    <button
                        onClick={() => { setMode('decrypt'); setOutput(''); }}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${mode === 'decrypt' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:bg-background/50'
                            }`}
                    >
                        <Unlock className="w-4 h-4" /> Decrypt
                    </button>
                </div>

                {/* Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Input Text</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter AES ciphertext to decrypt...'}
                        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                    />
                </div>

                {/* Secret Key */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Secret Key</label>
                    <input
                        type="password"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Enter a strong secret key"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={process}
                        disabled={!input || !secret}
                        className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <ArrowDown className="w-4 h-4" />
                        {mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
                    </button>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium flex justify-between items-center">
                        Result
                        {output && (
                            <button
                                onClick={() => navigator.clipboard.writeText(output)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                        )}
                    </label>
                    <div className="min-h-[120px] p-3 rounded-md border border-input bg-muted/30 break-all font-mono text-sm whitespace-pre-wrap">
                        {output || <span className="text-muted-foreground italic">Result will appear here...</span>}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
