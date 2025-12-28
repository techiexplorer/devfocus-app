import { useState, useEffect } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { Plus, X, Trash2 } from 'lucide-react';

interface Task {
    id: string;
    text: string;
}

interface MatrixData {
    q1: Task[]; // Urgent & Important
    q2: Task[]; // Not Urgent & Important
    q3: Task[]; // Urgent & Not Important
    q4: Task[]; // Not Urgent & Not Important
}

export function TaskMatrix({ tool }: { tool: Tool }) {
    const [tasks, setTasks] = useState<MatrixData>(() => {
        const saved = localStorage.getItem('devfocus-task-matrix');
        return saved ? JSON.parse(saved) : { q1: [], q2: [], q3: [], q4: [] };
    });

    useEffect(() => {
        localStorage.setItem('devfocus-task-matrix', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (quadrant: keyof MatrixData, text: string) => {
        if (!text.trim()) return;
        const newTask: Task = {
            id: crypto.randomUUID(),
            text: text.trim()
        };
        setTasks(prev => ({
            ...prev,
            [quadrant]: [...prev[quadrant], newTask]
        }));
    };

    const removeTask = (quadrant: keyof MatrixData, id: string) => {
        setTasks(prev => ({
            ...prev,
            [quadrant]: prev[quadrant].filter(t => t.id !== id)
        }));
    };

    const clearQuadrant = (quadrant: keyof MatrixData) => {
        if (confirm('Clear all tasks in this quadrant?')) {
            setTasks(prev => ({
                ...prev,
                [quadrant]: []
            }));
        }
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[800px] md:h-[600px]">
                {/* Quadrant 1: Urgent & Important */}
                <Quadrant
                    title="Do First"
                    subtitle="Urgent & Important"
                    color="bg-red-500/10 border-red-500/20"
                    headerColor="text-red-700 dark:text-red-400"
                    tasks={tasks.q1}
                    onAdd={(text) => addTask('q1', text)}
                    onRemove={(id) => removeTask('q1', id)}
                    onClear={() => clearQuadrant('q1')}
                />

                {/* Quadrant 2: Not Urgent & Important */}
                <Quadrant
                    title="Schedule"
                    subtitle="Not Urgent & Important"
                    color="bg-blue-500/10 border-blue-500/20"
                    headerColor="text-blue-700 dark:text-blue-400"
                    tasks={tasks.q2}
                    onAdd={(text) => addTask('q2', text)}
                    onRemove={(id) => removeTask('q2', id)}
                    onClear={() => clearQuadrant('q2')}
                />

                {/* Quadrant 3: Urgent & Not Important */}
                <Quadrant
                    title="Delegate"
                    subtitle="Urgent & Not Important"
                    color="bg-yellow-500/10 border-yellow-500/20"
                    headerColor="text-yellow-700 dark:text-yellow-400"
                    tasks={tasks.q3}
                    onAdd={(text) => addTask('q3', text)}
                    onRemove={(id) => removeTask('q3', id)}
                    onClear={() => clearQuadrant('q3')}
                />

                {/* Quadrant 4: Not Urgent & Not Important */}
                <Quadrant
                    title="Eliminate"
                    subtitle="Not Urgent & Not Important"
                    color="bg-green-500/10 border-green-500/20"
                    headerColor="text-green-700 dark:text-green-400"
                    tasks={tasks.q4}
                    onAdd={(text) => addTask('q4', text)}
                    onRemove={(id) => removeTask('q4', id)}
                    onClear={() => clearQuadrant('q4')}
                />
            </div>
        </ToolShell>
    );
}

function Quadrant({
    title,
    subtitle,
    color,
    headerColor,
    tasks,
    onAdd,
    onRemove,
    onClear
}: {
    title: string;
    subtitle: string;
    color: string;
    headerColor: string;
    tasks: Task[];
    onAdd: (text: string) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
}) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onAdd(input);
            setInput('');
        }
    };

    return (
        <div className={`flex flex-col h-full rounded-lg border ${color} overflow-hidden`}>
            <div className="flex items-center justify-between p-3 border-b border-border/10 bg-background/50 backdrop-blur-sm">
                <div>
                    <h3 className={`font-bold ${headerColor}`}>{title}</h3>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
                {tasks.length > 0 && (
                    <button onClick={onClear} className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors" title="Clear All">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className="group flex items-start justify-between gap-2 p-2 rounded bg-background shadow-sm border border-border/50 hover:border-primary/30 transition-colors animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-sm break-words">{task.text}</span>
                        <button
                            onClick={() => onRemove(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="h-full flex items-center justify-center text-muted-foreground/30 text-sm font-medium italic">
                        Empty
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-3 bg-background/50 border-t border-border/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add task..."
                        className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="h-9 px-3 bg-primary text-primary-foreground rounded-md disabled:opacity-50 transition-colors hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
