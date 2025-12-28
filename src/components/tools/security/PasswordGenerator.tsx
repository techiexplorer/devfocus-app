import { useState, useCallback } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { RefreshCw, Copy, Check } from 'lucide-react';

export function PasswordGenerator({ tool }: { tool: Tool }) {
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [password, setPassword] = useState('');
    const [copied, setCopied] = useState(false);

    const generatePassword = useCallback(() => {
        let charset = '';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        if (charset === '') {
            setPassword('');
            return;
        }

        let newPassword = '';
        const charsetLength = charset.length;
        // Use crypto.getRandomValues for better randomness implies sticking to numbers, 
        // mapping them to charset.
        const randomValues = new Uint32Array(length);
        crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            newPassword += charset[randomValues[i] % charsetLength];
        }

        setPassword(newPassword);
        setCopied(false);
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    // Generate on mount or change
    useState(() => {
        generatePassword();
    });

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const calculateStrength = () => {
        let score = 0;
        if (length > 8) score++;
        if (length > 12) score++;
        if (includeUppercase) score++;
        if (includeLowercase) score++;
        if (includeNumbers) score++;
        if (includeSymbols) score++;

        if (score < 3) return { label: 'Weak', color: 'bg-red-500' };
        if (score < 5) return { label: 'Medium', color: 'bg-yellow-500' };
        return { label: 'Strong', color: 'bg-green-500' };
    };

    const strength = calculateStrength();

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-6 max-w-xl mx-auto">
                <div className="relative">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="font-mono text-xl break-all mr-4">{password || 'Select options...'}</div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={generatePassword}
                                className="p-2 rounded hover:bg-muted transition-colors"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
                                title="Copy"
                                disabled={!password}
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    {password && (
                        <div className="absolute bottom-0 left-0 h-1 transition-all duration-300 rounded-bl-lg rounded-br-lg"
                            style={{ width: '100%', backgroundColor: 'transparent' }}>
                            <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: '100%' }}></div>
                        </div>
                    )}
                </div>

                <div className="text-sm font-medium text-center">
                    Strength: <span className={`${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                </div>

                <div className="space-y-6 p-6 border border-border rounded-lg">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Password Length: {length}</label>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center space-x-3 p-3 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors">
                            <input
                                type="checkbox"
                                checked={includeUppercase}
                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Uppercase (A-Z)</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors">
                            <input
                                type="checkbox"
                                checked={includeLowercase}
                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Lowercase (a-z)</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors">
                            <input
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={(e) => setIncludeNumbers(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Numbers (0-9)</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors">
                            <input
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={(e) => setIncludeSymbols(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Symbols (!@#$)</span>
                        </label>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
