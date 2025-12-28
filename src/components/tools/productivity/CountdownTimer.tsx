import { useState, useEffect, useRef } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function CountdownTimer({ tool }: { tool: Tool }) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Inputs
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);

    const intervalRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const playAlarm = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1);
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        playAlarm();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft]);

    const handleStart = () => {
        if (timeLeft === 0) {
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            if (totalSeconds === 0) return;
            setTimeLeft(totalSeconds);
            setDuration(totalSeconds);
        }
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setDuration(0);
    };

    const setPreset = (m: number) => {
        setHours(0);
        setMinutes(m);
        setSeconds(0);
        setIsRunning(false);
        setTimeLeft(m * 60);
        setDuration(m * 60);
    };

    // Calculate progress for circular indicator (simplified as bar for now)
    const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
                {/* Timer Display */}
                <div className="relative w-64 h-64 flex items-center justify-center rounded-full border-4 border-muted">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            className="stroke-primary fill-none transition-all duration-1000 ease-linear"
                            strokeWidth="8"
                            strokeDasharray="753.98" // 2 * pi * 120
                            strokeDashoffset={753.98 - (753.98 * progress) / 100}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="text-5xl font-mono font-bold tracking-wider tabular-nums">
                        {formatTime(timeLeft || (hours * 3600 + minutes * 60 + seconds))}
                    </div>
                </div>

                {/* Inputs (only show if not running/paused with time left) */}
                {timeLeft === 0 && (
                    <div className="flex items-center gap-4 text-center">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase font-semibold text-muted-foreground">Hrs</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={hours}
                                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-16 h-12 text-center text-xl rounded-md border border-input bg-background"
                            />
                        </div>
                        <span className="text-2xl mt-6">:</span>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase font-semibold text-muted-foreground">Min</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={minutes}
                                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                className="w-16 h-12 text-center text-xl rounded-md border border-input bg-background"
                            />
                        </div>
                        <span className="text-2xl mt-6">:</span>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs uppercase font-semibold text-muted-foreground">Sec</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={seconds}
                                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                className="w-16 h-12 text-center text-xl rounded-md border border-input bg-background"
                            />
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-4">
                    {!isRunning ? (
                        <button
                            onClick={handleStart}
                            className="w-16 h-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <Play className="w-8 h-8 fill-current ml-1" />
                        </button>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="w-16 h-16 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all border border-border"
                        >
                            <Pause className="w-8 h-8 fill-current" />
                        </button>
                    )}

                    <button
                        onClick={handleReset}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                        title="Reset"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap justify-center gap-2">
                    <button onClick={() => setPreset(5)} className="px-3 py-1 rounded-full bg-muted/50 hover:bg-muted text-sm transition-colors">5 min</button>
                    <button onClick={() => setPreset(15)} className="px-3 py-1 rounded-full bg-muted/50 hover:bg-muted text-sm transition-colors">15 min</button>
                    <button onClick={() => setPreset(25)} className="px-3 py-1 rounded-full bg-muted/50 hover:bg-muted text-sm transition-colors">Pomodoro (25)</button>
                    <button onClick={() => setPreset(60)} className="px-3 py-1 rounded-full bg-muted/50 hover:bg-muted text-sm transition-colors">1 hr</button>
                </div>
            </div>
        </ToolShell>
    );
}
