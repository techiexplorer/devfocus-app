import { useState, useCallback } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Upload, Download, ArrowRight, Image as ImageIcon } from 'lucide-react';

export function ImageOptimizer({ tool }: { tool: Tool }) {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [compressedImage, setCompressedImage] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    // Options
    const [maxSizeMB, setMaxSizeMB] = useState(1);
    const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setOriginalImage(file);
            setCompressedImage(null);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const compress = async () => {
        if (!originalImage) return;

        setIsCompressing(true);
        try {
            const options = {
                maxSizeMB: maxSizeMB,
                maxWidthOrHeight: maxWidthOrHeight,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(originalImage, options);
            setCompressedImage(compressedFile);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCompressing(false);
        }
    };

    const download = () => {
        if (!compressedImage) return;
        const url = URL.createObjectURL(compressedImage);
        const link = document.createElement('a');
        link.href = url;
        link.download = `optimized-${originalImage?.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6 max-w-6xl mx-auto">
                {/* Main Area */}
                <div className="space-y-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px] ${isDragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-[400px] w-auto object-contain rounded-lg shadow-sm"
                            />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">Upload Image</h3>
                                <p className="text-sm text-muted-foreground">
                                    Drag and drop or click to select
                                </p>
                            </>
                        )}
                    </div>

                    {/* Stats Comparison */}
                    {originalImage && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                                <div className="text-xs text-red-600 font-semibold uppercase tracking-wider mb-1">Original</div>
                                <div className="text-xl font-bold">{formatSize(originalImage.size)}</div>
                            </div>

                            <div className={`p-4 rounded-lg border transition-all ${compressedImage
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-muted/30 border-border border-dashed'
                                }`}>
                                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${compressedImage ? 'text-green-600' : 'text-muted-foreground'
                                    }`}>
                                    {compressedImage ? 'Optimized' : 'Estimated'}
                                </div>
                                <div className="text-xl font-bold">
                                    {compressedImage ? (
                                        <div className="flex items-center gap-2">
                                            {formatSize(compressedImage.size)}
                                            <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                                                -{Math.round((1 - compressedImage.size / originalImage.size) * 100)}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-sm font-normal italic">Waiting to compress...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Controls */}
                <div className="flex flex-col gap-6 p-6 rounded-xl border border-border bg-card h-fit">
                    <h3 className="font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Settings
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                Max Size (MB) <span>{maxSizeMB} MB</span>
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="10"
                                step="0.1"
                                value={maxSizeMB}
                                onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                Max Dimension <span>{maxWidthOrHeight}px</span>
                            </label>
                            <input
                                type="range"
                                min="100"
                                max="4096"
                                step="100"
                                value={maxWidthOrHeight}
                                onChange={(e) => setMaxWidthOrHeight(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex flex-col gap-3">
                        <button
                            onClick={compress}
                            disabled={!originalImage || isCompressing}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isCompressing ? 'Compressing...' : 'Compress Image'}
                            {!isCompressing && <ArrowRight className="w-4 h-4" />}
                        </button>

                        {compressedImage && (
                            <button
                                onClick={download}
                                className="w-full py-2.5 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
