import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t py-4 mt-auto bg-background/50 backdrop-blur-sm">
            <div className="container flex items-center justify-center h-full max-w-screen-2xl mx-auto px-4">
                <p className="text-center text-xs text-muted-foreground">
                    Made with <Heart className="inline-block h-3 w-3 text-red-500 fill-current animate-pulse align-middle" /> for developers who love simplicity.
                </p>
            </div>
        </footer>
    );
}
