import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../../config/tools';
import type { ToolCategory, Tool } from '../../config/tools';
import { LayoutGrid, List as ListIcon, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [layout, setLayout] = useState<'grid' | 'list'>(() => {
        return (localStorage.getItem('home-layout') as 'grid' | 'list') || 'grid';
    });

    useEffect(() => {
        localStorage.setItem('home-layout', layout);
    }, [layout]);

    const filteredCategories = TOOLS.map((category: ToolCategory) => ({
        ...category,
        children: category.children.filter((tool: Tool) =>
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter((category: ToolCategory) => category.children.length > 0);

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-center max-w-2xl mx-auto w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search tools..."
                        className="pl-9 pr-12 h-9 bg-background/50 backdrop-blur-sm transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50">
                            <span className="text-[10px]">⌘</span>K
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-sm ${layout === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                        onClick={() => setLayout('grid')}
                        title="Grid View"
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-sm ${layout === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                        onClick={() => setLayout('list')}
                        title="List View"
                    >
                        <ListIcon className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredCategories.map((category: ToolCategory) => (
                    <section key={category.id} className="space-y-3">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">{category.name}</h2>

                        <div className={
                            layout === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                                : "flex flex-col gap-2"
                        }>
                            {category.children.map((tool: Tool) => {
                                const isImplemented = tool.isImplemented;
                                return (
                                    <Link
                                        to={isImplemented ? `/tool/${tool.id}` : '#'}
                                        key={tool.id}
                                        className={`block group ${!isImplemented ? 'pointer-events-none' : ''}`}
                                        aria-disabled={!isImplemented}
                                    >
                                        <Card className={`h-full transition-all duration-200 ${isImplemented
                                                ? 'hover:shadow-md hover:border-primary/50 group-hover:-translate-y-0.5'
                                                : 'opacity-50 grayscale bg-muted/50 cursor-not-allowed border-dashed'
                                            } ${layout === 'list' ? 'flex flex-row items-center p-3' : ''}`}>
                                            {layout === 'grid' ? (
                                                <CardHeader className="p-4 relative">
                                                    {!isImplemented && (
                                                        <span className="absolute top-2 right-2 text-[10px] uppercase font-bold text-muted-foreground border px-1 rounded bg-background">
                                                            Soon
                                                        </span>
                                                    )}
                                                    <CardTitle className="text-sm font-semibold">{tool.name}</CardTitle>
                                                    <CardDescription className="text-xs line-clamp-2 mt-1.5">{tool.description}</CardDescription>
                                                </CardHeader>
                                            ) : (
                                                <>
                                                    <div className="flex-1 min-w-0 px-1 flex items-center gap-2">
                                                        <div className="text-sm font-semibold truncate">{tool.name}</div>
                                                        {!isImplemented && (
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground border px-1 rounded bg-background shrink-0">
                                                                Soon
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex-1 truncate px-4 hidden sm:block">
                                                        {tool.description}
                                                    </div>
                                                </>
                                            )}
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                        No tools found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
