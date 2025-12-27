import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t py-6 md:py-8 mt-auto bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row max-w-screen-2xl mx-auto px-8">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left w-full">
                    Made with <Heart className="inline-block h-4 w-4 text-red-500 fill-current animate-pulse align-middle" /> for developers who love simplicity.
                </p>
            </div>
        </footer>
    );
}
