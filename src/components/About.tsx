import { ToolShell } from './shared/ToolShell';

export function About() {
    return (
        <ToolShell title="About" description="The philosophy behind devfocus.app">
            <div className="prose dark:prose-invert max-w-none space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                    <b>devfocus.app</b> is a collection of essential developer tools designed to be fast, secure, and offline-capable.
                </p>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Core Principles</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong className="text-foreground">Local First:</strong> All tools run entirely in your browser. No data is ever sent to a server.</li>
                        <li><strong className="text-foreground">Privacy Focused:</strong> What you type, paste, or generate stays on your device.</li>
                        <li><strong className="text-foreground">Minimalist:</strong> Clean interface with no distractions, ads, or cookies.</li>
                        <li><strong className="text-foreground">Open Source:</strong> Transparent code that you can trust and contribute to.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Contribution</h3>
                    <p className="text-muted-foreground">
                        Found a bug or want to suggest a new tool? Check out the project on <a href="https://github.com/techiexplorer/devfocus-app" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4 hover:text-primary">GitHub</a>.
                    </p>
                </div>
            </div>
        </ToolShell>
    );
}
