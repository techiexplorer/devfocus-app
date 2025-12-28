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
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search tools..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1 bg-muted p-1 rounded-md self-end sm:self-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-sm ${layout === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                        onClick={() => setLayout('grid')}
                        title="Grid View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-sm ${layout === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                        onClick={() => setLayout('list')}
                        title="List View"
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {filteredCategories.map((category: ToolCategory) => (
                    <section key={category.id} className="space-y-4">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{category.name}</h2>

                        <div className={
                            layout === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                : "flex flex-col gap-2"
                        }>
                            {category.children.map((tool: Tool) => (
                                <Link to={`/tool/${tool.id}`} key={tool.id} className="block group">
                                    <Card className={`h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group-hover:scale-[1.01] ${layout === 'list' ? 'flex flex-row items-center p-4' : ''}`}>
                                        {layout === 'grid' ? (
                                            <CardHeader>
                                                <CardTitle className="text-base">{tool.name}</CardTitle>
                                                <CardDescription className="line-clamp-2 mt-2">{tool.description}</CardDescription>
                                            </CardHeader>
                                        ) : (
                                            <>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold truncate">{tool.name}</div>
                                                </div>
                                                <div className="text-sm text-muted-foreground flex-1 truncate px-4 hidden sm:block">
                                                    {tool.description}
                                                </div>
                                            </>
                                        )}
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No tools found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
