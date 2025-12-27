import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Download, Upload, X } from 'lucide-react';

export function ImageResizer({ tool }: { tool: Tool }) {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [aspectRatio, setAspectRatio] = useState<number>(0);
    const [keepAspectRatio, setKeepAspectRatio] = useState(true);
    const [quality, setQuality] = useState(0.9);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImage(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            const img = new Image();
            img.onload = () => {
                setWidth(img.width);
                setHeight(img.height);
                setAspectRatio(img.width / img.height);
            };
            img.src = objectUrl;
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1
    });

    const handleWidthChange = (w: number) => {
        setWidth(w);
        if (keepAspectRatio && aspectRatio) {
            setHeight(Math.round(w / aspectRatio));
        }
    };

    const handleHeightChange = (h: number) => {
        setHeight(h);
        if (keepAspectRatio && aspectRatio) {
            setWidth(Math.round(h * aspectRatio));
        }
    };

    const handleDownload = () => {
        if (!preview || !image) return;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            if (ctx) {
                // Better quality resizing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `resized-${image.name}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    }
                }, image.type, quality);
            }
        };
        img.src = preview;
    };

    const reset = () => {
        setImage(null);
        setPreview(null);
        setWidth(0);
        setHeight(0);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-6">
                {!preview ? (
                    <div
                        {...getRootProps()}
                        className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-center">Drop an image here, or click to select</p>
                        <p className="text-sm text-muted-foreground mt-2">Supports PNG, JPG, WEBP</p>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="relative rounded-lg border border-border overflow-hidden bg-muted/30 flex items-center justify-center min-h-[300px]">
                                <img src={preview} alt="Preview" className="max-w-full max-h-[500px] object-contain" />
                                <button
                                    onClick={reset}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background border border-border shadow-sm transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-80 flex flex-col gap-6 p-4 rounded-lg border border-border h-fit">
                            <h3 className="font-semibold text-lg">Resize Options</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Width (px)</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Height (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="aspect"
                                        checked={keepAspectRatio}
                                        onChange={(e) => setKeepAspectRatio(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="aspect" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Maintain Aspect Ratio
                                    </label>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <label className="text-sm font-medium">Quality ({Math.round(quality * 100)}%)</label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={quality}
                                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <button
                                    onClick={handleDownload}
                                    className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
