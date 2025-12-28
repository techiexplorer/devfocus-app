import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ToolShellProps {
    title: string;
    description: string;
    children: ReactNode;
}

export function ToolShell({ title, description, children }: ToolShellProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <Button variant="ghost" size="sm" className="self-start -ml-2 text-muted-foreground hover:text-foreground" asChild>
                    <Link to="/">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Tools
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
