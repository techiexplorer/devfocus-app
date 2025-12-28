import { useState, useCallback } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { useDropzone } from 'react-dropzone';
import { prominent } from 'color.js';
import { Upload, Copy, Check } from 'lucide-react';

export function ColorPaletteGenerator({ tool }: { tool: Tool }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            extractColors(url);
        }
    }, []);

    const extractColors = async (url: string) => {
        setLoading(true);
        try {
            // Get 6 prominent colors, plain format returns array of strings/arrays
            const extracted = await prominent(url, { amount: 6, format: 'hex' }) as unknown as string[];
            // color.js Prominent returns weird types sometimes, force verify
            if (Array.isArray(extracted)) {
                setColors(extracted);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const copyToClipboard = (color: string, index: number) => {
        navigator.clipboard.writeText(color);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px] ${isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-[300px] max-w-full object-contain rounded-lg shadow-sm"
                            />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">Upload Image</h3>
                                <p className="text-sm text-muted-foreground">
                                    Drop an image to extract its palette
                                </p>
                            </>
                        )}
                    </div>

                    {/* Palette */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-lg">Palette</h3>

                        {loading && (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
                                Extracting colors...
                            </div>
                        )}

                        {!loading && colors.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground opacity-50 bg-muted/20 rounded-lg">
                                No colors generated yet.
                            </div>
                        )}

                        {!loading && colors.length > 0 && (
                            <div className="grid grid-cols-1 gap-3">
                                {colors.map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-md shadow-inner ring-1 ring-border"
                                            style={{ backgroundColor: color }}
                                        />
                                        <div className="flex-1 font-mono font-medium text-lg uppercase">
                                            {color}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(color, idx)}
                                            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                            title="Copy Hex"
                                        >
                                            {copiedIndex === idx ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
