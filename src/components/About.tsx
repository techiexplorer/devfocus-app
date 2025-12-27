import { Link } from 'react-router-dom';

export function About() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-lg)' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-text-dim)' }}>
                ← Back to Tools
            </Link>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.05em', marginBottom: '1rem' }}>
                About DevFocus
            </h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-dim)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                A collection of essential developer tools, designed to be simple, fast, and privacy-focused.
            </p>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Goal</h2>
                <p style={{ lineHeight: 1.6 }}>
                    We wanted a "daily driver" toolset that doesn't feel cluttered or ad-heavy.
                    DevFocus is built to be your go-to tab for quick transformations, formatting, and generation tasks.
                    Everything runs client-side—your data never leaves your browser.
                </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Contribute</h2>
                <p style={{ lineHeight: 1.6 }}>
                    DevFocus is open source. You can contribute to the project, suggest new tools, or report bugs on our GitHub repository.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <a
                        href="https://github.com/devfocus/app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ textDecoration: 'none', display: 'inline-block' }}
                    >
                        Visit on GitHub
                    </a>
                </div>
            </section>

            <section>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
                    Version 1.0.0
                </p>
            </section>
        </div>
    );
}
