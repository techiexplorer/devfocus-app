import { useState, useCallback, useRef } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { useDropzone } from 'react-dropzone';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';

const SIZES = [16, 32, 48, 64, 128, 192, 512];

export function IconGenerator({ tool }: { tool: Tool }) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            const img = new Image();
            img.src = url;
            img.onload = () => setImage(img);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const downloadIcon = (size: number) => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = size;
        canvas.height = size;

        // Clear and draw
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(image, 0, 0, size, size);

        // Download
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `icon-${size}x${size}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Upload Area */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[200px] ${isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                >
                    <input {...getInputProps()} />
                    {previewUrl ? (
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={previewUrl}
                                alt="Original"
                                className="w-32 h-32 object-contain rounded-lg shadow-sm bg-white/50 p-2"
                            />
                            <p className="text-sm text-muted-foreground">Click or drop to replace</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">Upload Logo</h3>
                            <p className="text-sm text-muted-foreground">
                                Recommended: Square image, 512x512px or larger
                            </p>
                        </>
                    )}
                </div>

                {/* Grid of Results */}
                {image && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" /> Generated Icons
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {SIZES.map((size) => (
                                <div key={size} className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all">
                                    <div className="flex-1 flex items-center justify-center w-full min-h-[64px]">
                                        <div
                                            style={{
                                                width: size > 64 ? 64 : size,
                                                height: size > 64 ? 64 : size,
                                                backgroundImage: `url(${previewUrl})`,
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center'
                                            }}
                                            className="drop-shadow-sm"
                                        />
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="text-xs font-medium text-muted-foreground mb-2">{size}x{size}</div>
                                        <button
                                            onClick={() => downloadIcon(size)}
                                            className="w-full py-1.5 px-2 bg-muted hover:bg-primary hover:text-primary-foreground text-xs rounded transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Download className="w-3 h-3" /> PNG
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
