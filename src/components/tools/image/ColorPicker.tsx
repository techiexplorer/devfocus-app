import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';

export function ColorPicker({ tool }: { tool: Tool }) {
    const [color, setColor] = useState("#3b82f6");
    const [rgb, setRgb] = useState("");
    const [hsl, setHsl] = useState("");

    // Convert hex to other formats
    useEffect(() => {
        // Simple hex validation and conversion
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            const hex = color.substring(1);
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            setRgb(`rgb(${r}, ${g}, ${b})`);

            // RGB to HSL
            const rNorm = r / 255;
            const gNorm = g / 255;
            const bNorm = b / 255;
            const max = Math.max(rNorm, gNorm, bNorm);
            const min = Math.min(rNorm, gNorm, bNorm);
            let h = 0, s = 0, l = (max + min) / 2;

            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                    case gNorm: h = (bNorm - rNorm) / d + 2; break;
                    case bNorm: h = (rNorm - gNorm) / d + 4; break;
                }
                h /= 6;
            }

            setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
        }
    }, [color]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col gap-4">
                    <HexColorPicker color={color} onChange={setColor} />
                    <div className="w-full h-12 rounded-lg border border-border" style={{ backgroundColor: color }}></div>
                </div>

                <div className="flex-1 flex flex-col gap-4 w-full max-w-md">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">HEX</label>
                        <input
                            type="text"
                            value={color}
                            onChange={handleHexChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">RGB</label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {rgb}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">HSL</label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {hsl}
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
