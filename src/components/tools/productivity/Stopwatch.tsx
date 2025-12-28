import { useState, useRef, useEffect } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

export function Stopwatch({ tool }: { tool: Tool }) {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);

    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - time;
            intervalRef.current = window.setInterval(() => {
                setTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        setLaps(prev => [time, ...prev]);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
                {/* Display */}
                <div className="text-7xl font-mono font-bold tracking-wider tabular-nums text-foreground">
                    {formatTime(time)}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleStartPause}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRunning
                            ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                            : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                            }`}
                        title={isRunning ? "Pause" : "Start"}
                    >
                        {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                    </button>

                    <button
                        onClick={handleLap}
                        disabled={!isRunning && time === 0}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Lap"
                    >
                        <Flag className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={time === 0}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Reset"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                {/* Laps */}
                {laps.length > 0 && (
                    <div className="w-full border border-border rounded-lg bg-card overflow-hidden">
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted text-muted-foreground sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Lap</th>
                                        <th className="px-4 py-2 text-right font-medium">Time</th>
                                        <th className="px-4 py-2 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laps.map((lapTime, index) => {
                                        const lapNumber = laps.length - index;
                                        // const prevLapTime = laps[index + 1] || 0;
                                        // const currentLapDuration = lapTime - prevLapTime; // Unused for now


                                        return (
                                            <tr key={index} className="border-t border-border/50">
                                                <td className="px-4 py-3 text-muted-foreground">#{lapNumber}</td>
                                                <td className="px-4 py-3 text-right font-mono text-foreground font-medium">
                                                    {formatTime(index === laps.length - 1 ? lapTime : laps[index] - laps[index + 1])}
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                                                    {formatTime(lapTime)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
