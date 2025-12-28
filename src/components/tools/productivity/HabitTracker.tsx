import { useState, useEffect } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Check } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface Habit {
    id: string;
    name: string;
    completedDates: string[]; // ISO date strings
}

export function HabitTracker({ tool }: { tool: Tool }) {
    const [habits, setHabits] = useState<Habit[]>(() => {
        const saved = localStorage.getItem('habits-data');
        return saved ? JSON.parse(saved) : [];
    });
    const [newHabit, setNewHabit] = useState('');

    useEffect(() => {
        localStorage.setItem('habits-data', JSON.stringify(habits));
    }, [habits]);

    const addHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabit.trim()) return;
        setHabits([...habits, {
            id: crypto.randomUUID(),
            name: newHabit.trim(),
            completedDates: []
        }]);
        setNewHabit('');
    };

    const deleteHabit = (id: string) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const toggleHabit = (habitId: string, dateStr: string) => {
        setHabits(habits.map(h => {
            if (h.id !== habitId) return h;
            const isCompleted = h.completedDates.includes(dateStr);
            return {
                ...h,
                completedDates: isCompleted
                    ? h.completedDates.filter(d => d !== dateStr)
                    : [...h.completedDates, dateStr]
            };
        }));
    };

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i)); // [Today-6, Today-5, ... Today]

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Add Form */}
                <form onSubmit={addHabit} className="flex gap-4">
                    <Input
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="Enter a new habit (e.g., Read 30 mins)..."
                        className="flex-1"
                    />
                    <Button type="submit" disabled={!newHabit.trim()} className="gap-2">
                        <Plus className="w-4 h-4" /> Add Habit
                    </Button>
                </form>

                {/* Habits Grid */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    {/* Header Row */}
                    <div className="flex items-center border-b bg-muted/30">
                        <div className="flex-1 p-4 font-semibold text-sm">Habit</div>
                        <div className="flex">
                            {last7Days.map(date => (
                                <div key={date.toString()} className="w-10 sm:w-14 p-2 text-center border-l">
                                    <div className="text-[10px] text-muted-foreground uppercase">{format(date, 'EEE')}</div>
                                    <div className="text-sm font-bold">{format(date, 'd')}</div>
                                </div>
                            ))}
                        </div>
                        <div className="w-14 p-2 text-center border-l font-semibold text-sm flex items-center justify-center text-muted-foreground">
                            Action
                        </div>
                    </div>

                    {/* Habit Rows */}
                    {habits.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No habits added yet. Start tracking your goals!
                        </div>
                    ) : (
                        habits.map(habit => (
                            <div key={habit.id} className="flex items-center border-b last:border-0 hover:bg-muted/10 transition-colors">
                                <div className="flex-1 p-4 font-medium truncate">{habit.name}</div>
                                <div className="flex">
                                    {last7Days.map(date => {
                                        const dateStr = format(date, 'yyyy-MM-dd');
                                        const isCompleted = habit.completedDates.includes(dateStr);
                                        return (
                                            <div key={dateStr} className="w-10 sm:w-14 h-14 border-l flex items-center justify-center">
                                                <button
                                                    onClick={() => toggleHabit(habit.id, dateStr)}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                        ? 'bg-green-500 text-white shadow-sm scale-100'
                                                        : 'bg-muted text-transparent hover:bg-muted-foreground/20 scale-90'
                                                        }`}
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="w-14 h-14 border-l flex items-center justify-center">
                                    <button
                                        onClick={() => deleteHabit(habit.id)}
                                        className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
